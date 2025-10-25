# Escala Semanal da Igreja

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
- **Google Gemini API** (`@google/genai`)
- **TailwindCSS**
- **Font Awesome**

## Como Usar

### 1. Configuração do Administrador
- Mude para a **"Visão de Administrador"**.
- Vá para **"Gerenciar Membros"** para adicionar, editar ou remover participantes.
- Em **"Configurar Dias da Semana"**, ative os dias que terão culto e nomeie o serviço (ex: "Reunião de Oração", "Celebração de Domingo").
- Poste qualquer informação relevante na seção **"Avisos"**.
- Clique em **"Gerar Nova Escala"** para que a IA crie a escala.

### 2. Visão de Membro
- Selecione seu nome na lista suspensa em **"Visualizando como:"**.
- A escala será exibida, e quaisquer tarefas atribuídas a você serão destacadas.
- Clique no sino de notificação para ver um resumo de suas tarefas para a semana.

## Executando no Android (com Capacitor)

Esta aplicação pode ser empacotada como um aplicativo nativo para Android usando [Capacitor](https://capacitorjs.com/). Siga as instruções abaixo para configurar o projeto.

### Pré-requisitos
- [Node.js](https://nodejs.org/) e npm instalados.
- [Android Studio](https://developer.android.com/studio) instalado e configurado com um SDK do Android.

### Passos para a Configuração
1. **Instale a CLI do Capacitor:**
   Abra seu terminal e instale a interface de linha de comando do Capacitor globalmente:
   ```bash
   npm install -g @capacitor/cli
   ```
2. **Prepare os Ativos da Web:**
   O Capacitor precisa de um diretório de onde carregar os arquivos da web. A configuração está definida para usar uma pasta chamada `dist`.
   - Crie uma pasta chamada `dist` na raiz do projeto.
   - Copie todos os arquivos e pastas da aplicação (como `index.html`, `index.tsx`, etc.) para dentro da pasta `dist`.
3. **Adicione a Plataforma Android:**
   No diretório raiz do projeto, execute o comando a seguir para criar o projeto nativo do Android:
   ```bash
   npx cap add android
   ```
4. **Sincronize as Alterações:**
   Sempre que você modificar o código da web, precisará sincronizá-lo com o projeto nativo:
   ```bash
   npx cap sync android
   ```
5. **Abra no Android Studio:**
   Para construir e rodar o aplicativo, abra o projeto no Android Studio:
   ```bash
   npx cap open android
   ```
6. **Compile e Execute:**
   Dentro do Android Studio, use o botão 'Run' (▶️) para compilar e executar o aplicativo em um emulador ou dispositivo físico.
