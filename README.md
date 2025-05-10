# Pos-Admin Frontend

A modern Vue.js 3 based admin dashboard for POS (Point of Sale) system.

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Yarn package manager
- Git

### System Requirements

- Operating System: Windows 10/11, macOS, or Linux
- RAM: Minimum 4GB (8GB recommended)
- Disk Space: Minimum 2GB free space
- Browser: Chrome, Firefox, Safari, or Edge (latest versions)

### Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd Pos-Admin
```

2. Install dependencies:

```bash
yarn install
```

3. Create environment file:

```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:

```
VITE_API_MERCHANT="
VITE_DOMAIN_MERCHANT="
VITE_DOMAIN_CLIENT="
VITE_DEFAULT_LOCALE="
VITE_FALLBACK_LOCALE="
VITE_SUPPORTED_LOCALES="
VITE_DOMAIN_KITCHEN="

```

5. Start development server:

```bash
yarn dev
```

6. Build for production:

```bash
yarn build
```

## 📁 Project Structure

```
Pos-Admin/
├── public/              # Static files
├── src/
│   ├── assets/         # Images, fonts, and other static assets
│   ├── components/     # Reusable Vue components
│   ├── composables/    # Vue composition functions
│   ├── data/          # Static data files
│   ├── directives/    # Vue custom directives
│   ├── layouts/       # Layout components
│   ├── router/        # Vue Router configuration
│   ├── services/      # API services and utilities
│   ├── stores/        # Pinia store modules
│   ├── views/         # Page components
│   ├── App.vue        # Root component
│   └── main.js        # Application entry point
├── .env.example       # Environment variables template
├── .eslintrc.cjs      # ESLint configuration
├── jsconfig.json      # JavaScript configuration
├── package.json       # Project dependencies and scripts
├── vite.config.js     # Vite configuration
└── vercel.json        # Vercel deployment configuration
```

## 🛠️ Tech Stack

- Vue.js 3
- Vite
- Pinia (State Management)
- Vue Router
- Bootstrap 5
- Element Plus
- Axios
- Vue I18n (Internationalization)
- Chart.js
- CKEditor
- FullCalendar
- And more (see package.json for complete list)

## 📦 Dependencies

### Core Dependencies

- Vue 3.2.31
- Vue Router 4.2.5
- Pinia 2.1.6
- Bootstrap 5.3.2
- Element Plus 2.8.3
- Axios 1.6.7

### Development Dependencies

- Vite 4.4.11
- ESLint 8.51.0
- SASS 1.69.1

## 🚀 Deployment

### Production Build

```bash
yarn build
```

The build files will be generated in the `dist` directory.

### Server Deployment

```bash
cd /var/www/html/Pos-Admin
git pull
yarn build
```

## 📚 Documentation

- [Vue 3 Documentation](https://v3.vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vue Router Documentation](https://router.vuejs.org/)
