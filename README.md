# Escala Semanal da Igreja (Church Weekly Roster)

Uma aplicação simples e eficiente para gerenciar e visualizar a escala de trabalho semanal de uma igreja. Permite que um administrador gerencie membros, defina os dias de culto e gere automaticamente uma escala justa e aleatória usando a API do Google Gemini. Os membros podem visualizar facilmente suas tarefas e receber notificações.

## Funcionalidades

- **Dois Modos de Visualização:**
  - **Visão de Membro:** Veja a escala semanal completa com as tarefas pessoais destacadas. Inclui um sistema de notificação para as tarefas atribuídas.
  - **Visão de Administrador:** Um painel de controle completo para gerenciar os membros da igreja, configurar quais dias têm cultos, postar avisos e gerar/exportar a escala.
- **Geração de Escala com IA:** Utiliza a API do Google Gemini para criar uma escala semanal equilibrada e aleatória para cultos, porteiros e líderes de hinos.
- **Estado Persistente:** Todos os dados (membros, escala, configurações, avisos) são salvos no `localStorage` do navegador, preservando suas informações entre as sessões.
- **Design Responsivo:** Construído com TailwindCSS para uma experiência de usuário limpa e adaptável tanto em desktops quanto em dispositivos móveis.
- **Funcionalidade de Exportação:** Administradores podem exportar a escala gerada para um arquivo `.txt` para fácil compartilhamento e impressão.

## Tecnologias Utilizadas

- **React**
- **TypeScript**
- **Vite** (Ambiente de desenvolvimento e build)
- **Google Gemini API** (`@google/genai`)
- **TailwindCSS** (via CDN)
- **Font Awesome**

---

## Guia de Instalação e Publicação

### 1. Desenvolvimento Local

Para executar o projeto em sua máquina local, siga estes passos.

**Pré-requisitos:**
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- `npm` ou `yarn`

**Passos:**
1.  **Instale as dependências:**
    Abra o terminal na pasta do projeto e execute:
    ```bash
    npm install
    ```

2.  **Configure a Chave da API:**
    Você precisará de uma chave da API do Google Gemini.
    - Crie um arquivo chamado `.env` na raiz do projeto.
    - Adicione sua chave da API a este arquivo da seguinte forma:
      ```
      API_KEY="SUA_CHAVE_API_AQUI"
      ```

3.  **Inicie o Servidor de Desenvolvimento:**
    Execute o comando abaixo para iniciar o servidor do Vite:
    ```bash
    npm run dev
    ```
    A aplicação estará disponível em `http://localhost:5173`.

### 2. Publicando na Vercel

A Vercel oferece uma maneira simples e eficiente de publicar sites, com integração contínua a partir do seu repositório Git.

**Pré-requisitos:**
- Uma conta na [Vercel](https://vercel.com/).
- Seu projeto em um repositório Git (GitHub, GitLab, Bitbucket).

**Passos:**
1.  **Faça o Push do seu Código:** Envie o código do projeto para o seu repositório Git.

2.  **Crie um Novo Projeto na Vercel:**
    - No painel da Vercel, clique em **"Add New..."** -> **"Project"**.
    - Conecte seu provedor Git e selecione o repositório do projeto.

3.  **Configure o Projeto:**
    A Vercel detectará automaticamente que é um projeto Vite e preencherá as configurações de build:
    - **Framework Preset:** `Vite`
    - **Build Command:** `npm run build`
    - **Output Directory:** `dist`

4.  **Adicione a Variável de Ambiente:**
    Esta é a etapa mais importante para a API funcionar.
    - Na tela de configuração do projeto, vá para a aba **"Settings"** e depois para a seção **"Environment Variables"**.
    - Adicione uma nova variável:
      - **Name:** `API_KEY`
      - **Value:** Cole a sua chave da API do Google Gemini aqui.

5.  **Publique o Site:**
    Clique em **"Deploy"**. A Vercel irá compilar e publicar sua aplicação. Após a conclusão, seu site estará no ar!

### 3. Executando no Android (com Capacitor)

Para empacotar a aplicação como um aplicativo nativo para Android, siga os passos abaixo.

1.  **Faça o Build da Aplicação Web:**
    Antes de sincronizar com o Capacitor, você precisa gerar a versão de produção dos seus arquivos da web.
    
    **Importante:** Certifique-se de que seu arquivo `.env` com a `API_KEY` está presente na raiz do projeto antes de executar o comando de build. A chave será incluída no pacote do aplicativo.
    
    ```bash
    npm run build
    ```
    Isso criará a pasta `dist` com seu aplicativo otimizado.

2.  **Adicione a Plataforma Android (se ainda não o fez):**
    ```bash
    npx cap add android
    ```

3.  **Sincronize as Alterações:**
    Copie os ativos da web para o projeto nativo:
    ```bash
    npx cap sync android
    ```

4.  **Abra no Android Studio:**
    ```bash
    npx cap open android
    ```

5.  **Compile e Execute:**
    Dentro do Android Studio, use o botão 'Run' (▶️) para compilar e executar o aplicativo em um emulador ou dispositivo físico.