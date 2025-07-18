# Ethereum Wallet Dashboard

A simple React application for displaying Ethereum## Custom Hook use## CThe `useWallet` hooThe `useWallet` hook provides a convenient interface for wallet interactions:

```typescript MetaMask, WalletConnect, Injected

### For WalletConnect
Replace `projectId` in `src/config/wagmi.ts` with your actual Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/).

## Production Build

```bash
bun run build
```

The built application will be in the `dist/` folder.

## License

MIT

## Author

Created using modern Web3 and React ecosystem technologies.t interface for wallet interactions:stom Hook useWallet

The `useWallet` hook provides a convenient interface for wallet interactions:let

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
- ✅ Modern and clean interface
- ✅ Dark theme support
- ✅ Responsive design

## Installation and Setup

1. Make sure you have [Bun](https://bun.sh/) installed

2. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd eth-wallet-app
\`\`\`

3. Install dependencies:
\`\`\`bash
bun install
\`\`\`

4. Run the application in development mode:
\`\`\`bash
bunx vite
\`\`\`

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Project Structure

\`\`\`
src/
├── components/
│   ├── ui/          # Reusable UI components (Shadcn)
│   ├── WalletConnect.tsx    # Component for wallet connection
│   └── WalletBalance.tsx    # Component for displaying balance
├── hooks/
│   └── useWallet.ts         # Custom hook for wallet interactions
├── lib/
│   └── utils.ts            # Utility functions
├── config/
│   └── wagmi.ts            # Wagmi configuration
├── App.tsx                 # Main application component
├── main.tsx               # Entry point
└── index.css              # Global styles
\`\`\`

## Usage

### Connecting a Wallet
1. Open the application in your browser
2. Click on the button with your wallet name (MetaMask, WalletConnect, etc.)
3. Confirm the connection in your wallet

### Viewing Balance
After connecting your wallet, you will automatically see:
- Wallet address (shortened)
- Current ETH balance with 4 decimal places
- Button to disconnect the wallet

## Custom Hook useWallet

Хук \`useWallet\` предоставляет удобный интерфейс для работы с кошельком:

\`\`\`typescript
const {
  address,           // Connected wallet address
  isConnected,       // Connection status
  balance,           // Formatted ETH balance
  isBalanceLoading,  // Balance loading status
  isBalanceError,    // Balance loading error
  connectors,        // Available connectors
  isPending,         // Connection status
  connectWallet,     // Connect function
  disconnectWallet,  // Disconnect function
} = useWallet()
\`\`\`

## Configuration

### Wagmi Configuration
File \`src/config/wagmi.ts\` contains the Ethereum connection configuration:
- Supported networks: Mainnet, Sepolia
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
