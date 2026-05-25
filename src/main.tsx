import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Remove StrictMode in production for better perf (dev double-renders)
const root = import.meta.env.DEV ? (
  <StrictMode>
    <App />
  </StrictMode>
) : (
  <App />
)

createRoot(document.getElementById('root')!).render(root)
