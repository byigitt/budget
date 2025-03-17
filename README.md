# Budget Tracker

A comprehensive budget tracking application built with React, TypeScript, and TailwindCSS.

## Features

- 📊 **Dashboard** - Get a quick overview of your financial status
- 💰 **Transaction Management** - Track income, expenses, and transfers
- 📋 **Budget Planning** - Set and track budget goals
- 🏦 **Account Management** - Manage multiple accounts in one place
- 📈 **Reports and Analytics** - Visualize your spending patterns
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🌓 **Dark Mode** - Easy on the eyes, day or night
- 📷 **Receipt Scanning** - Capture and store receipts
- 📊 **Forecasting** - Predict future financial status
- 💾 **Data Backup** - Export and import your financial data

## Tech Stack

- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Router** - Navigation
- **Recharts** - Data visualization
- **date-fns** - Date manipulation
- **localStorage** - Data persistence

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (v8 or higher)

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/byigitt/budget.git
   cd budget
   ```

2. Install dependencies

   ```bash
   pnpm install
   ```

3. Start the development server

   ```bash
   pnpm dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

```bash
pnpm build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
budget-tracker/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable components
│   │   ├── Dashboard/  # Dashboard components
│   │   ├── Layout/     # Layout components
│   │   ├── Transactions/ # Transaction components
│   │   └── UI/         # UI components
│   ├── contexts/       # React contexts
│   ├── hooks/          # Custom hooks
│   ├── pages/          # Page components
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
├── tailwind.config.js  # TailwindCSS configuration
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite configuration
```

## Data Privacy

All your financial data is stored locally in your browser's localStorage. No data is sent to any server.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
