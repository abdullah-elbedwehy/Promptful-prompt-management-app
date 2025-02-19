# Promptful

Promptful is a modern web application for managing, organizing, and customizing AI prompts. Built with React and Vite, it offers a fast and responsive interface for creating, editing, and using prompts with various AI platforms.

## Features

- 🚀 Lightning-fast performance with React + Vite
- 🌙 Dark mode support
- 🔄 Real-time prompt updates
- 🎯 Dynamic variable handling
- 🎨 Modern, responsive design
- 🔍 Search and filter functionality
- 📱 Mobile-friendly interface

## Tech Stack

- **Frontend:**
  - React + TypeScript
  - Vite (Build tool)
  - Styled Components
  - React Query (Data fetching)
  - React Router (Routing)
  - React Hook Form (Form handling)
  - Framer Motion (Animations)
  - Zustand (State management)

- **Backend:**
  - Flask API
  - SQLite database

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Python 3.8+ (for the backend)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/promptful.git
   cd promptful
   ```

2. Install frontend dependencies:
   ```bash
   cd promptful-v2
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Start the backend server (in a separate terminal):
   ```bash
   cd ../backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   flask run --debug
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## Project Structure

```
promptful-v2/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Layout/
│   │   ├── Prompts/
│   │   └── UI/
│   ├── context/           # React Context providers
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   ├── api/              # API client and utilities
│   ├── store/            # Zustand store
│   ├── styles/           # Global styles and theme
│   └── types/            # TypeScript type definitions
├── public/               # Static assets
└── index.html           # HTML entry point
```

## Development

### Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Code Style

- Uses TypeScript for type safety
- ESLint and Prettier for code formatting
- Component-based architecture
- CSS-in-JS with styled-components

## Features in Detail

### Prompt Management

- Create, edit, and delete prompts
- Support for multiple AI platforms
- Dynamic variable system
- Rich text editing
- Instant search and filtering

### Theme Support

- Light and dark mode
- System preference detection
- Smooth transitions
- Consistent design language

### Performance

- Code splitting
- Lazy loading
- Optimized bundle size
- Efficient state management
- Responsive design

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React and Vite teams
- All contributors and maintainers
- Open source community
