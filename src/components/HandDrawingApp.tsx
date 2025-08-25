import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera } from '@mediapipe/camera_utils';
import { Hands, Results } from '@mediapipe/hands';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import {
  Palette,
  Eraser,
  Trash2,
  Download,
  Github,
  Video,
  Square,
  Minus,
  Plus,
  Settings
} from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

const HandDrawingApp: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const handsRef = useRef<Hands | null>(null);
  const cameraRef = useRef<Camera | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [showWhiteBoard, setShowWhiteBoard] = useState(false);

  // Use useRef para os estados que precisam ser acessados pelo MediaPipe
  const currentColorRef = useRef('#8B5CF6');
  const brushSizeRef = useRef(5);
  const isEraserRef = useRef(false);
  const lastPointRef = useRef<Point | null>(null);

  const colors = [
    '#8B5CF6', '#EC4899', '#EF4444', '#F97316',
    '#EAB308', '#22C55E', '#06B6D4', '#3B82F6',
    '#6366F1', '#A855F7', '#FFFFFF', '#000000'
  ];

  const initializeMediaPipe = useCallback(async () => {
    if (videoRef.current && canvasRef.current) {
      const hands = new Hands({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        },
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.5,
      });

      hands.onResults(onResults);
      handsRef.current = hands;

      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          if (handsRef.current && videoRef.current) {
            await handsRef.current.send({ image: videoRef.current });
          }
        },
        width: 1280,
        height: 720,
      });

      cameraRef.current = camera;
      await camera.start();
    }
  }, []);

  const onResults = useCallback((results: Results) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx) return;

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

    const drawingCanvas = drawingCanvasRef.current;
    const drawingCtx = drawingCanvas?.getContext('2d');
    if (!drawingCtx) return;

    if (results.multiHandLandmarks) {
      for (const landmarks of results.multiHandLandmarks) {
        drawConnectors(ctx, landmarks, Hands.HAND_CONNECTIONS, {
          color: '#00FF00',
          lineWidth: 2
        });
        drawLandmarks(ctx, landmarks, {
          color: '#FF0000',
          lineWidth: 1,
          radius: 3
        });

        const indexTip = landmarks[8];
        const thumbTip = landmarks[4];

        const distance = Math.sqrt(
          Math.pow((thumbTip.x - indexTip.x) * canvas.width, 2) +
          Math.pow((thumbTip.y - indexTip.y) * canvas.height, 2)
        );

        const currentPoint: Point = {
          x: indexTip.x * canvas.width,
          y: indexTip.y * canvas.height
        };

        if (distance < 40) {
          setIsDrawing(true);
          if (lastPointRef.current) {
            drawingCtx.globalCompositeOperation = isEraserRef.current ? 'destination-out' : 'source-over';
            drawingCtx.strokeStyle = isEraserRef.current ? 'rgba(0,0,0,1)' : currentColorRef.current;
            drawingCtx.lineWidth = isEraserRef.current ? brushSizeRef.current * 2 : brushSizeRef.current;
            drawingCtx.lineCap = 'round';
            drawingCtx.lineJoin = 'round';

            drawingCtx.beginPath();
            drawingCtx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
            drawingCtx.lineTo(currentPoint.x, currentPoint.y);
            drawingCtx.stroke();
          }
          lastPointRef.current = currentPoint;
        } else {
          setIsDrawing(false);
          lastPointRef.current = null;
        }
      }
    }
    ctx.restore();
  }, []);

  const clearCanvas = () => {
    const drawingCanvas = drawingCanvasRef.current;
    const ctx = drawingCanvas?.getContext('2d');
    if (ctx && drawingCanvas) {
      ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    }
  };

  const saveDrawing = () => {
    const drawingCanvas = drawingCanvasRef.current;
    if (!drawingCanvas) return;

    const link = document.createElement('a');
    link.download = `desenho-${new Date().getTime()}.png`;
    link.href = drawingCanvas.toDataURL();
    link.click();
  };

  useEffect(() => {
    initializeMediaPipe();

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
    };
  }, [initializeMediaPipe]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-800">
      <header className="bg-black/30 backdrop-blur-md border-b border-purple-500/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">HandDraw</h1>
              <p className="text-purple-300 text-sm">Desenhe com suas mãos!</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.open('https://https://github.com/VicFreyre/handraw-pipe', '_blank')}
              className="flex items-center space-x-2 bg-purple-600/20 hover:bg-purple-600/30 transition-all duration-300 px-4 py-2 rounded-lg border border-purple-500/30"
            >
              <Github className="w-4 h-4 text-purple-300" />
              <span className="text-purple-300 text-sm">Visite o Repositório</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <div className="w-80 bg-black/40 backdrop-blur-md border-r border-purple-500/20 p-6">
          <div className="space-y-6">
            <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/20">
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <Video className="w-4 h-4 mr-2" />
                Modo de Visualização
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowWhiteBoard(false)}
                  className={`flex-1 px-3 py-2 rounded-lg transition-all duration-300 ${
                    !showWhiteBoard
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                      : 'bg-purple-800/30 text-purple-300 hover:bg-purple-700/30'
                  }`}
                >
                  <Video className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-xs">Webcam</span>
                </button>
                <button
                  onClick={() => setShowWhiteBoard(true)}
                  className={`flex-1 px-3 py-2 rounded-lg transition-all duration-300 ${
                    showWhiteBoard
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                      : 'bg-purple-800/30 text-purple-300 hover:bg-purple-700/30'
                  }`}
                >
                  <Square className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-xs">Lousa</span>
                </button>
              </div>
            </div>

            <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/20">
              <h3 className="text-white font-semibold mb-3">Ferramentas</h3>
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => {
                    isEraserRef.current = false;
                    lastPointRef.current = null; // Reinicia o ponto para evitar erros
                  }}
                  className={`flex-1 px-3 py-2 rounded-lg transition-all duration-300 ${
                    !isEraserRef.current
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                      : 'bg-purple-800/30 text-purple-300 hover:bg-purple-700/30'
                  }`}
                >
                  <Palette className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-xs">Pincel</span>
                </button>
                <button
                  onClick={() => {
                    isEraserRef.current = true;
                    lastPointRef.current = null; // Reinicia o ponto para evitar erros
                  }}
                  className={`flex-1 px-3 py-2 rounded-lg transition-all duration-300 ${
                    isEraserRef.current
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                      : 'bg-purple-800/30 text-purple-300 hover:bg-purple-700/30'
                  }`}
                >
                  <Eraser className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-xs">Borracha</span>
                </button>
              </div>

              <div className="mb-4">
                <label className="text-purple-300 text-sm mb-2 block">
                  Espessura: {brushSizeRef.current}px
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      brushSizeRef.current = Math.max(1, brushSizeRef.current - 1);
                      // Forçar a re-renderização para atualizar a UI
                      setBrushSize(brushSizeRef.current);
                    }}
                    className="w-8 h-8 bg-purple-700/50 hover:bg-purple-600/50 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-3 h-3 text-purple-300" />
                  </button>
                  <div className="flex-1 bg-purple-800/30 rounded-lg h-2 relative">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-lg transition-all duration-300"
                      style={{ width: `${(brushSizeRef.current / 20) * 100}%` }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      brushSizeRef.current = Math.min(20, brushSizeRef.current + 1);
                      // Forçar a re-renderização para atualizar a UI
                      setBrushSize(brushSizeRef.current);
                    }}
                    className="w-8 h-8 bg-purple-700/50 hover:bg-purple-600/50 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-3 h-3 text-purple-300" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/20">
              <h3 className="text-white font-semibold mb-3">Cores</h3>
              <div className="grid grid-cols-4 gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      currentColorRef.current = color;
                      isEraserRef.current = false;
                      // Forçar a re-renderização para atualizar a UI
                      setIsDrawing(isDrawing);
                    }}
                    className={`w-10 h-10 rounded-lg transition-all duration-300 ${
                      currentColorRef.current === color && !isEraserRef.current
                        ? 'ring-2 ring-purple-400 ring-offset-2 ring-offset-black scale-110'
                        : 'hover:scale-105'
                    } ${color === '#FFFFFF' ? 'border border-purple-500/30' : ''}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={clearCanvas}
                className="w-full bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 py-3 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-red-500/25"
              >
                <Trash2 className="w-4 h-4" />
                <span>Limpar Tudo</span>
              </button>

              <button
                onClick={saveDrawing}
                className="w-full bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-300 py-3 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-green-500/25"
              >
                <Download className="w-4 h-4" />
                <span>Salvar Desenho</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 relative">
          <div className="absolute inset-4 rounded-2xl overflow-hidden border-2 border-purple-500/30 shadow-2xl">
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              style={{ transform: 'scaleX(-1)' }}
            />

            <canvas
              ref={canvasRef}
              width={1280}
              height={720}
              className="absolute inset-0 w-full h-full"
              style={{
                transform: 'scaleX(-1)',
                opacity: 0,
                pointerEvents: 'none'
              }}
            />

            {showWhiteBoard && (
              <div className="absolute inset-0 bg-white" />
            )}

            <canvas
              ref={drawingCanvasRef}
              width={1280}
              height={720}
              className="absolute inset-0 w-full h-full"
              style={{
                transform: 'scaleX(-1)',
                pointerEvents: 'none'
              }}
            />

            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white">
              <p className="text-sm font-medium mb-1">Como usar:</p>
              <p className="text-xs text-purple-300">👆 Una o polegar e indicador para desenhar</p>
              <p className="text-xs text-purple-300">✋ Afaste os dedos para parar</p>
            </div>

            {isDrawing && (
              <div className="absolute top-4 right-4 bg-green-600/80 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm font-medium animate-pulse">
                ✏️ Desenhando...
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="bg-black/30 backdrop-blur-md border-t border-purple-500/20 p-4">
        <div className="text-center">
          <p className="text-purple-300 text-sm">
           Desenvolvido com ❤️ por <a href="https://www.linkedin.com/in/vict%C3%B3ria-freyre-220b05291/" className="text-purple-400 font-semibold" target="_blank" rel="noopener noreferrer">Victória Freyre</a>
          </p>
          <p className="text-purple-400 text-xs mt-1">
            
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HandDrawingApp;
