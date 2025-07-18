# Ethereum Wallet Dashboard

A simple React application for displaying Ethereum## Custom Hook useWallet

The `useWallet` hook provides a convenient interface for working with the wallet:

```typescript
const {
  address,           // Connected wallet address
  isConnected,       // Connection status
  balance,           // Formatted balance in ETH
  isBalanceLoading,  // Balance loading status
  isBalanceError,    // Balance loading error
  connectors,        // Available connectors
  isPending,         // Connection status
  connectWallet,     // Connection function
  disconnectWallet,  // Disconnection function
} = useWallet()
```

## Configurationilt using modern Web3 technologies.

## Technologies

- **React** - library for building user interfaces
- **TypeScript** - typed JavaScript for better development
- **Wagmi** - library for interacting with Ethereum via Web3
- **Viem** - low-level library for working with Ethereum
- **Shadcn/UI** - beautiful and accessible UI components
- **Tailwind CSS** - utility-first CSS framework for styling
- **Bun** - fast JavaScript runtime and package manager
- **Vite** - modern build tool

## Features

- ✅ Wallet connection (MetaMask, WalletConnect and others)
- ✅ Display connected wallet address
- ✅ Display ETH balance with real-time data
- ✅ Custom hook for wallet state management
- ✅ Современный и чистый интерфейс
- ✅ Поддержка темной темы
- ✅ Отзывчивый дизайн

## Установка и запуск

1. Убедитесь, что у вас установлен [Bun](https://bun.sh/)

2. Клонируйте репозиторий:
\`\`\`bash
git clone <repository-url>
cd eth-wallet-app
\`\`\`

3. Установите зависимости:
\`\`\`bash
bun install
\`\`\`

4. Запустите приложение в режиме разработки:
\`\`\`bash
bunx vite
\`\`\`

5. Откройте [http://localhost:5173](http://localhost:5173) в браузере

## Структура проекта

\`\`\`
src/
├── components/
│   ├── ui/          # Переиспользуемые UI компоненты (Shadcn)
│   ├── WalletConnect.tsx    # Компонент для подключения кошелька
│   └── WalletBalance.tsx    # Компонент для отображения баланса
├── hooks/
│   └── useWallet.ts         # Кастомный хук для работы с кошельком
├── lib/
│   └── utils.ts            # Утилитарные функции
├── config/
│   └── wagmi.ts            # Конфигурация Wagmi
├── App.tsx                 # Главный компонент приложения
├── main.tsx               # Точка входа
└── index.css              # Глобальные стили
\`\`\`

## Использование

### Подключение кошелька
1. Откройте приложение в браузере
2. Нажмите на кнопку с названием вашего кошелька (MetaMask, WalletConnect и т.д.)
3. Подтвердите подключение в кошельке

### Просмотр баланса
После подключения кошелька автоматически отобразится:
- Адрес кошелька (сокращенный)
- Текущий баланс ETH с точностью до 4 знаков после запятой
- Кнопка для отключения кошелька

## Кастомный хук useWallet

Хук \`useWallet\` предоставляет удобный интерфейс для работы с кошельком:

\`\`\`typescript
const {
  address,           // Адрес подключенного кошелька
  isConnected,       // Статус подключения
  balance,           // Отформатированный баланс в ETH
  isBalanceLoading,  // Статус загрузки баланса
  isBalanceError,    // Ошибка загрузки баланса
  connectors,        // Доступные коннекторы
  isPending,         // Статус подключения
  connectWallet,     // Функция подключения
  disconnectWallet,  // Функция отключения
} = useWallet()
\`\`\`

## Конфигурация

### Wagmi Configuration
Файл \`src/config/wagmi.ts\` содержит конфигурацию для подключения к Ethereum:
- Поддерживаемые сети: Mainnet, Sepolia
- Коннекторы: MetaMask, WalletConnect, Injected

### Для WalletConnect
Замените \`projectId\` в \`src/config/wagmi.ts\` на ваш реальный Project ID из [WalletConnect Cloud](https://cloud.walletconnect.com/).

## Сборка для продакшена

\`\`\`bash
bun run build
\`\`\`

Собранное приложение будет находиться в папке \`dist/\`.

## Лицензия

MIT

## Автор

Создано с использованием современных технологий Web3 и React экосистемы.
