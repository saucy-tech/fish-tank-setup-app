# Fish Tank Cycling Tracker

A Progressive Web App (PWA) to help you track and monitor your fish tank cycling process.

## Features

- **Dashboard**: View your current cycling phase, progress, and latest water parameters
- **Water Readings**: Record and track ammonia, nitrite, nitrate, pH, and temperature readings
- **Cycling Guide**: Learn about the nitrogen cycle and get tips for successful cycling
- **Progress Tracking**: Visual indicators of your progress through the cycling phases
- **Data Visualization**: Charts to visualize your water parameters over time
- **Offline Support**: Works even when you're offline (PWA)
- **Mobile Friendly**: Responsive design works on all devices

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/fish-tank-setup-app.git
cd fish-tank-setup-app
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Usage

1. **Dashboard**: The main page shows your current cycling phase, progress, and latest readings.
2. **Add Readings**: Use the "Add New Reading" button to record your water parameters.
3. **View History**: Go to the Readings page to see all your historical readings.
4. **Learn**: Visit the Guide page to learn about the nitrogen cycle and get tips.

## Customization

You can customize your start date and cycling phases in the `src/app/data/tankSetupData.ts` file.

## Technologies Used

- Next.js
- TypeScript
- Tailwind CSS
- Chart.js
- date-fns
- Local Storage for data persistence

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Created for fish keepers to easily track their tank cycling process
- Inspired by the need for a simple, user-friendly way to monitor water parameters
