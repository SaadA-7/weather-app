import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import Layout from './routes/Layout'
import DetailView from './routes/DetailView'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<App />} />
          <Route path="/cityDetails/:cityName" element={<DetailView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)