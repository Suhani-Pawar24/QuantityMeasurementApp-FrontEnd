
# Quantity Measurement App - Frontend

A modern React-based web application for converting units of measurement. Users can authenticate, perform unit conversions across various measurement types, and view their conversion history.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Architecture](#architecture)
- [Components](#components)
- [Hooks](#hooks)
- [Services](#services)
- [Contributing](#contributing)

## ✨ Features

- **User Authentication**: Sign up and log in securely
- **Unit Conversion**: Convert between multiple units of measurement (length, weight, temperature, volume, etc.)
- **Multiple Actions**: Support for conversions, comparisons, and other measurement operations
- **Conversion History**: View past conversions and track your calculations
- **Error Handling**: User-friendly error messages and validation
- **Responsive UI**: Modern and intuitive interface
- **Protected Routes**: Secure access to measurement features for authenticated users

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.0
- **Routing**: React Router DOM 6.20.0
- **HTTP Client**: Axios 1.6.0
- **Styling**: CSS (custom stylesheets)
- **State Management**: React Context API

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ActionSelector.jsx         # Select conversion action type
│   ├── ErrorBanner.jsx            # Display error messages
│   ├── HistoryList.jsx            # Show conversion history
│   ├── OperatorSelector.jsx       # Select operators
│   ├── ResultDisplay.jsx          # Display calculation results
│   ├── TypeSelector.jsx           # Select measurement type
│   └── UnitInput.jsx              # Input unit selection
├── context/             # React Context for state management
│   └── MeasurementContext.jsx     # Global measurement state
├── hooks/               # Custom React hooks
│   ├── useConversion.js           # Handle unit conversion logic
│   ├── useHistory.js              # Manage conversion history
│   └── useUnits.js                # Load and manage units
├── pages/               # Page components
│   ├── Login.jsx                  # User login page
│   ├── MeasurementApp.jsx         # Main measurement conversion page
│   └── SignUp.jsx                 # User registration page
├── services/            # API and external service integration
│   └── api.js                     # API endpoints and authentication
├── styles/              # CSS stylesheets
│   ├── ActionSelector.css
│   ├── Auth.css
│   ├── ErrorBanner.css
│   ├── global.css
│   ├── HistoryList.css
│   ├── MeasurementApp.css
│   ├── OperatorSelector.css
│   ├── ResultDisplay.css
│   ├── TypeSelector.css
│   └── UnitInput.css
├── App.jsx              # Main app component with routing
└── main.jsx             # Application entry point
```

## 🚀 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd QuantityMeasurementApp-Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint** (if needed)
   - Update the API base URL in `src/services/api.js` to point to your backend

## 🏃 Getting Started

### Development Mode

Start the development server with hot module reloading:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (Vite default)

### Build for Production

Create an optimized production build:

```bash
npm run build
```

The compiled files will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Linting

Run ESLint to check code quality:

```bash
npm run lint
```

## 📜 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Dev Server | `npm run dev` | Start development server with HMR |
| Build | `npm run build` | Create optimized production build |
| Preview | `npm run preview` | Preview production build locally |
| Lint | `npm run lint` | Check code quality with ESLint |

## 🏗️ Architecture

### Authentication Flow

```
Signup → Login → Protected Routes (MeasurementApp with LocalStorage)
```

The app uses **Local Storage** for session management, storing user authentication data. Protected routes redirect unauthenticated users to the login page.

### State Management

The app uses **React Context API** for global state management:

- **MeasurementContext**: Manages conversion state including:
  - Selected measurement type
  - From/To units
  - Input values
  - Conversion results
  - Error messages
  - Loading states

### Data Flow

1. User selects measurement type → Units load via `useUnits()`
2. User enters values and selects units → State updates in context
3. User clicks calculate → `useConversion()` processes the conversion
4. Result is displayed and saved to history
5. History is managed via `useHistory()`

## 🧩 Components

### Core Components

- **TypeSelector**: Allows users to select measurement type (length, weight, etc.)
- **UnitInput**: Component for selecting and entering unit values
- **OperatorSelector**: Selects the operation to perform
- **ActionSelector**: Selects the action type for conversion
- **ResultDisplay**: Shows the conversion result
- **ErrorBanner**: Displays validation and error messages
- **HistoryList**: Shows past conversions

### Page Components

- **Login**: User authentication page
- **SignUp**: New user registration
- **MeasurementApp**: Main application with all conversion components

## 🎣 Custom Hooks

### useConversion()

Handles unit conversion logic.

```javascript
const { calculate } = useConversion();
```

### useUnits()

Loads available units based on selected measurement type.

```javascript
const { units } = useUnits();
```

### useHistory()

Manages conversion history.

```javascript
const { history, addToHistory } = useHistory();
```

## 🔌 Services

### api.js

Contains all API calls and authentication logic:

- `authAPI.login()` - User authentication
- `authAPI.signup()` - User registration
- `authAPI.getCurrentUser()` - Get current authenticated user
- `conversionAPI.convert()` - Perform unit conversion

## 📝 Environment Variables

If your backend requires environment variables, create a `.env` file:

```
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Quantity Measurement App
```

Then access them in your code:

```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/feature-name`)
2. Commit changes (`git commit -m 'Add feature'`)
3. Push to branch (`git push origin feature/feature-name`)
4. Open a Pull Request

## 📄 License

This project is [MIT Licensed](LICENSE) or specify your license here.

## 📞 Support

For issues, questions, or suggestions, please create an issue in the repository.

---

**Happy Converting! 📐**