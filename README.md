# KDS Clave - Kitchen Display System

A modern, responsive Kitchen Display System (KDS) built with React, TypeScript, and Tailwind CSS.

## Features

- Real-time order tracking with color-coded timers
- Split view between active and completed orders
- Bulk order completion
- Responsive design (mobile-friendly)
- Modern UI with clean aesthetics

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm 7.x or later

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/kds-clave.git
cd kds-clave
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage

- **To Do Tab**: Shows active orders with real-time timers
  - Green: Under 1 minute
  - Orange: Between 1-2 minutes
  - Red: Over 2 minutes
- **Completed Tab**: Shows finished orders
- Click the checkbox or name to select orders
- Use the "Complete" button to mark selected orders as done
- Use the restore button to move completed orders back to active

## Built With

- React 18
- TypeScript
- Tailwind CSS
- Headless UI
- Hero Icons
- date-fns

## License

This project is licensed under the MIT License - see the LICENSE file for details. 