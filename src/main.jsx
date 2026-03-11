// React 应用入口（引入全局样式，并把 App 挂载到 #root）

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import './styles/variables.css';
import './styles/globals.css';
import './styles/glasscard.css';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
