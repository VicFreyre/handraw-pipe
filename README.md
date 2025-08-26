# ✋🎨 HandDraw BETA 0.01
<p align="center">
  <img src="https://github.com/user-attachments/assets/44ce6b97-feaf-480a-aef9-7b5f8e5d8c06" width="1100" />
</p>

Deploy da prototipação de interface: [Acesse aqui 🚀](https://handraw-gvuj68zs5-vics-projects-becbc9ab.vercel.app/)

Desenhe na tela usando apenas gestos das mãos capturados pela webcam!  
O **HandDraw** é uma aplicação web inovadora que utiliza **inteligência artificial** para transformar movimentos das mãos em desenhos digitais — sem necessidade de mouse ou touch.

---

## 🚀 Funcionalidades
-  **Desenho por gestos**: Una o polegar e o indicador para ativar o modo de desenho.  
-  **Detecção de mãos em tempo real**: Utiliza **MediaPipe Hands** para identificar e rastrear os movimentos da mão.  
-  **Paleta de cores**: Escolha entre várias cores para seu traço.  
-  **Ajuste de espessura**: Controle o tamanho do pincel de **1 a 20 pixels**.  
-  **Modo borracha**: Apague partes do desenho facilmente.  
-  **Limpar tela**: Remova todo o desenho com um clique.  
-  **Salvar desenho**: Baixe seu desenho como imagem **PNG**.  
-  **Interface moderna**: Desenvolvida com **React** e estilizada com **Tailwind CSS**.  

---

## 📂 Estrutura do Projeto

```bash
handraw-main/
├── public/
│   └── index.html                # Arquivo HTML principal
├── src/                          # Código-fonte da aplicação
│   ├── components/               # Componentes React reutilizáveis
│   │   └── HandDrawingApp.tsx    # Componente principal do app de desenho
│   ├── App.tsx                   # Componente raiz da aplicação
│   ├── index.css                 # Estilos globais
│   ├── main.tsx                  # Ponto de entrada da aplicação React
│   └── vite-env.d.ts             # Tipagens para Vite e TypeScript
├── .gitignore                    # Arquivos e pastas ignorados pelo Git
├── README.md                     # Documentação do projeto
├── eslint.config.js              # Configuração do ESLint
├── package-lock.json             # Lockfile de dependências
├── package.json                  # Dependências e scripts do projeto
├── postcss.config.js             # Configuração do PostCSS
├── tailwind.config.js            # Configuração do Tailwind CSS
├── tsconfig.app.json             # Configuração do TypeScript para app
├── tsconfig.json                 # Configuração principal do TypeScript
├── tsconfig.node.json            # Configuração do TypeScript para Node
└── vite.config.ts                # Configuração do Vite
```
---

## 🛠️ Tecnologias Utilizadas
React, TypeScript, MediaPipe Hands, Tailwind CSS e Vite.
<p align="rigth">
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" alt="react" width="40" height="40"/>  
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" alt="typescript" width="40" height="40"/>  
  <img src="https://viz.mediapipe.dev/logo.png" alt="mediapipe" width="40" height="40"/>  
  <img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg" alt="tailwindcss" width="58" height="40"/>  
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vite/vite-original.svg" alt="vite" width="40" height="40"/>  
</p>


---

## 📦 Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/VicFreyre/handraw-pipe.git
cd handraw-pipe
npm install
npm run dev
```

## 👩‍💻 Autor

**Victória Freyre**  

[LinkedIn](https://www.linkedin.com/in/vict%C3%B3ria-freyre-220b05291/)



