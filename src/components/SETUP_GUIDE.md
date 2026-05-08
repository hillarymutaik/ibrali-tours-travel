# Ibrali Tours - Complete Setup Guide

## Directory Structure

```
ibrali-tours/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── PackageCard.jsx
│   │   └── Footer.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Packages.jsx
│   │   └── Booking.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Step 1: Create the Project Structure

1. **Create folders:**
   ```bash
   mkdir -p src/components src/pages public
   ```

2. **Move component files** (already created):
   - Copy `Navbar.jsx` to `src/components/Navbar.jsx`
   - Copy `Hero.jsx` to `src/components/Hero.jsx`
   - Copy `PackageCard.jsx` to `src/components/PackageCard.jsx`
   - Copy `Footer.jsx` to `src/components/Footer.jsx`

3. **Move page files** (already created):
   - Copy `Home.jsx` to `src/pages/Home.jsx`
   - Copy `Packages.jsx` to `src/pages/Packages.jsx`
   - Copy `Booking.jsx` to `src/pages/Booking.jsx`

## Step 2: Update App.jsx

Replace the contents of `src/App.jsx` with:

```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Packages from './pages/Packages'
import Booking from './pages/Booking'
import './index.css'

function App() {
  return (
    <Router basename="/ibrali-tours">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/booking" element={<Booking />} />
      </Routes>
    </Router>
  )
}

export default App
```

## Step 3: Update index.css

Replace the contents of `src/index.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

## Step 4: Install Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Update `tailwind.config.js`:

```js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## Step 5: Update vite.config.js

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/ibrali-tours/',
})
```

## Step 6: Update package.json

```json
{
  "name": "ibrali-tours",
  "private": true,
  "version": "0.1.0",
  "homepage": "https://yourusername.github.io/ibrali-tours",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.20.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "gh-pages": "^6.1.0"
  }
}
```

## Step 7: Testing Locally

```bash
npm run dev
```

Visit `http://localhost:5173` to see your site.

## Step 8: Deploy to GitHub Pages

```bash
# First, ensure everything is committed
git add .
git commit -m "Complete Ibrali Tours website"

# Deploy
npm run deploy
```

Your site will be live at: `https://yourusername.github.io/ibrali-tours`

## Customization Tips

1. **Colors**: Edit Tailwind classes in components (e.g., `bg-blue-600` → `bg-green-600`)
2. **Images**: Replace image URLs in `Home.jsx`, `Packages.jsx`, and `PackageCard.jsx`
3. **Content**: Update package details, prices, and descriptions in component data
4. **Contact Info**: Update footer contact details in `Footer.jsx`

## Next Steps: Add Backend

When ready to add bookings & payments:
1. Set up Firebase (Recommended for static hosting)
2. Add authentication with Firebase Auth
3. Store bookings in Firestore
4. Integrate payment gateway (Stripe/Paypal)

See the Firebase integration guide for complete setup.
