# ETH Wallet Dashboard

ETH Wallet Dashboard is a modern application for managing your Ethereum wallet, featuring an intuitive interface, high performance, and advanced capabilities.

## Description & Advantages
- **Instant wallet connection**: Supports popular Ethereum wallets, quick access to balance and transaction history.
- **Live balance & ETH price**: Displays wallet balance and current ETH price in real time.
- **Transaction history**: Shows the latest 5 transactions with detailed info, filters out failed transactions.
- **Network status**: Ethereum network indicator, automatic chainId detection.
- **Light & dark theme**: Switch between modes for comfortable use.
- **Validation & error handling**: Strict data validation via Zod, custom error classes, ErrorBoundary for UI protection.
- **Modular architecture**: Hooks, components, services, configs, and types for easy maintenance and extension.
- **Testing**: Unit tests for error monitoring logic included.
- **Modern technologies**: Bun for fast package management and running, Vite for instant builds, Tailwind CSS for adaptive design.
- **High performance**: Minimal response time, optimized requests, caching via React Query.
- **Security**: No need to store private keys, works only with public addresses.
- **Open source**: MIT license, easy to extend and integrate into your own projects.

## Features
- Connect your Ethereum wallet
- View wallet balance and ETH price
- Display transaction history (latest 5+ transactions)
- Network status indicator
- Light/dark theme toggle
- Error boundaries and robust validation
- Fast, modern UI with Tailwind CSS

## Tech Stack
- React + TypeScript
- Vite (bundler)
- Bun (runtime & package manager)
- Tailwind CSS
- React Query (data fetching)
- Zod (validation)

## Getting Started

### Prerequisites
- [Bun](https://bun.sh/) installed globally
- Node.js (if using npm/yarn for reference)

### Environment Variables
1. Copy `.env.example` to `.env.development` and `.env.production`.
2. Configure:
   - `VITE_ETHERSCAN_API_KEY` - Etherscan API key from https://etherscan.io/myapikey
3. Behavior notes:
   - Transaction history uses Etherscan V2 and needs a valid API key.
   - If `VITE_ETHERSCAN_API_KEY` is missing or set to `#`, the app disables Etherscan requests and returns an empty transaction list instead of failing the whole app.
   - Wallet connection and on-chain balance still work via Wagmi/RPC.

### Etherscan V2 Request Model
- Base API host: `https://api.etherscan.io`
- Endpoint format: `/v2/api`
- Network routing is done with `chainid` (for Sepolia: `11155111`)
- Explorer links still use network-specific domains (for example, `https://sepolia.etherscan.io`)

### Installation
1. **Clone the repository:**
   ```powershell
   git clone https://github.com/Vimpil/eth-wallet-dashboard.git
   cd eth-wallet-dashboard
   ```
2. **Install dependencies:**
   ```powershell
   bun install
   ```

### Running the App
Start the development server:
```powershell
bun run dev
```
Or use Vite directly:
```powershell
bunx vite
```

### Preview Production Build
Build the app:
```powershell
bun run build
```
Preview the production build:
```powershell
bun run preview
```
Or use Vite directly:
```powershell
bunx vite preview
```
The app will be available at [http://localhost:3000](http://localhost:3000) by default.

### Build for Production
```powershell
bun run build
```
Or use Vite directly:
```powershell
bunx vite build
```
The output will be in the `dist/` folder.

## Project Structure
```
eth-wallet-dashboard/
├── public/                # Static assets
├── src/
│   ├── components/        # UI components
│   ├── config/            # Network and wagmi config
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities, schemas, services
│   ├── types/             # TypeScript types
│   └── assets/            # Images and icons
├── index.html             # Main HTML file
├── package.json           # Project metadata
├── vite.config.ts         # Vite configuration
└── tailwind.config.js     # Tailwind CSS config
```

## Environment Variables
- Core wallet connection and balance work without sensitive keys.
- `VITE_ETHERSCAN_API_KEY` is required if you want transaction history enabled.

## Etherscan Configuration
- This project uses Etherscan V2 with a unified API host and `chainid`-based routing.
- Keep `VITE_ETHERSCAN_API_KEY` set in local and production environments if you want transaction history enabled.

## Troubleshooting
- If you encounter issues with Bun, ensure you have the latest version: `bun --version`
- `HTTP error! status: 404` for transaction history usually means an incorrect API host/endpoint combination. This project should call `https://api.etherscan.io/v2/api` with `chainid`.
- `NOTOK` usually indicates API key, quota/rate-limit, or account-level Etherscan API restrictions.
- If transaction history is unavailable, verify your key and restart dev server after `.env` changes.

## Testing
Unit tests are included for error monitoring and validation logic. To run tests:
```powershell
bun run test
```
Test files are located in `src/lib/errors/monitoring.test.ts` and cover error handling and monitoring features.

## Quality Checks
Run all quality gates before submitting or deploying:
```powershell
bun run lint
bun run test
bun run build
```

## License
This project is licensed under the MIT License.

## Contributing
Pull requests and issues are welcome!

---
Made with power for Ethereum enthusiasts.
