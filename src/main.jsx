import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider } from 'antd'
import './index.css'
import App from './App.jsx'
import { UserAuthContextProvider } from './context/userAuth'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#0F792C',
            borderRadius: 8,
            fontFamily: 'Inter, system-ui, sans-serif',
          },
        }}
      >
        <UserAuthContextProvider>
          <App />
        </UserAuthContextProvider>
      </ConfigProvider>
    </BrowserRouter>
  </StrictMode>,
)
