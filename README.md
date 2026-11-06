# NextPay 💳

NextPay é uma landing page moderna de banco digital com foco em notificações locais de pagamento (PIX), simulando recebimentos em tempo real e o uso de Local Notifications no ecossistema mobile.

O projeto foi desenvolvido em React + Vite e inclui a estrutura base para futura integração com Capacitor e Android.

## Demonstração

A interface apresenta:
- painel de saldo bancário
- valor de PIX personalizável
- simulação de recebimento instantâneo
- agendamento de notificações locais
- bloco educativo sobre Local Notifications, Android 13+ e Push vs Local

## Tecnologias

- React
- Vite
- JavaScript
- Capacitor
- Local Notifications

## Estrutura do projeto

```bash
bancodigital/
├── .github/
│   └── workflows/
│       └── build-apk.yml
├── dist/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── capacitor.config.json
├── index.html
├── package.json
├── README.md
├── server.js
├── vite.config.js
└── package-lock.json
```

## Requisitos

Antes de iniciar, certifique-se de ter instalado:

- Node.js 18+
- npm

## Instalação

Clone o projeto:

```bash
git clone https://github.com/seu-usuario/nextpay.git
cd nextpay
```

Instale as dependências:

```bash
npm install
```

## Execução

### Modo de desenvolvimento

```bash
npm run dev
```

A aplicação será iniciada em:

```bash
http://localhost:5173/
```

### Build de produção

```bash
npm run build
```

### Servidor estático local

```bash
node server.js
```

## Capacitor / Android

Para preparar a versão nativa Android:

```bash
npm install @capacitor/core @capacitor/cli @capacitor/local-notifications
npx cap sync
```

Para abrir o projeto no Android Studio:

```bash
npm run cap:android
```

## Workflow de APK

O projeto inclui um workflow em GitHub Actions para gerar um APK de depuração automaticamente no GitHub Actions:

- Arquivo: `.github/workflows/build-apk.yml`

## Observações importantes

O plugin `@capacitor/local-notifications` exige permissões do sistema em Android 13+ (`POST_NOTIFICATIONS`). Em um app real, o fluxo correto é sempre verificar e solicitar a permissão antes de disparar qualquer notificação local.

## Licença

Este projeto está sob a licença MIT.

## Autor

Desenvolvido para demonstração de banco digital com foco em experiência de uso e notificações locais.
