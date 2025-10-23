# Yield Pilot 🚀

**One-click allocation to the highest yields across chains**

Yield Pilot is a cross-chain lending optimizer that puts your idle assets to generate best yeilds across chains. You can now aggregate all stablecoin assets from different chains and stake them in highest apy markets all in one transaction. No hassle of bridging, swapping, and depositing across chains.

## ✨ Features

### 🎯 Core Functionality

- **Unify Liquidity**: Consolidate stablecoina assets across chains into a single destination
- **Best Yields**: Rank Aave/Compound markets by APY, liquidity, and health
- **Bridge and Supply with Nexus**: Bridge to the right chain and asset seamlessly

### 🛠️ Key Components

- **Terminal**: Interactive yield farming interface with market rankings
- **Portfolio**: Track your cross-chain positions and balances

## 📱 Usage

### Terminal

1. Connect your wallet
2. Browse available yield opportunities
3. Select your preferred market
4. Click "Supply" to execute the flow:
   - Unify liquidity across chains
   - Bridge to destination chain
   - Supply to protocol

### Portfolio

- View your cross-chain positions
- Track protocol allocations
- Monitor total chain balances
- Analyze protocol performance

## 🔄 Flow Explanation

When you click "One-click Allocate":

1. **Fetch balances** and compute unified USDC/ETH across chains
2. **Bridge and Deposit** to destination chain using Nexus

## 🛡️ Security

- Wallet connections use industry-standard libraries
- All transactions require explicit user approval
- Private keys never leave your wallet

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Web3 wallet (MetaMask, WalletConnect, etc.)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/shantanuSakpal/yeild-pilot.git
   cd yeild-pilot
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

4. **Run the development server**

   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── terminal/          # Yield terminal interface
│   ├── portfolio/         # Portfolio tracking
├── components/           # React components
│   ├── terminal/         # Terminal-specific components
│   ├── portfolio/        # Portfolio components
│   └── ui/              # Reusable UI components
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries
│   ├── aave-v3/        # Aave V3 integration
│   └── constants.ts    # App constants
└── providers/          # React context providers
```

## 🔧 Tech Stack

### Frontend

- **Next.js 15** - React framework with app router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible component primitives

### Web3 Integration

- **Wagmi** - React hooks for Ethereum
- **RainbowKit** - Wallet connection UI
- **Viem** - TypeScript interface for Ethereum
- **Ethers.js** - Ethereum library

### DeFi Protocols

- **Aave V3** - Lending protocol integration
- **Nexus** - Cross-chain bridging

## 🌐 Supported Chains

- **Ethereum**
- **Arbitrum**
- **Avalanche**
- **Base**
- **BNB Chain**
- **Optimism**
- **Polygon**
- **Scroll**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- **Aave** - For the lending protocol infrastructure
- **Nexus** - For cross-chain bridging capabilities
- **RainbowKit** - For wallet connection UI
- **Next.js** - For the React framework

## 📞 Support

For support, email shantanuesakpa1420@gmail.com or ping me on X at @shantanu_1405.

---

**Built with ❤️ for ETHOnline 2025**
