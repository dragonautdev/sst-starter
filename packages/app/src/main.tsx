import ReactDOM from 'react-dom/client'
import './index.css'
import reportWebVitals from './reportWebVitals.ts'
import { AuthProvider} from './AuthContext.tsx'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'
import { Toaster } from './components/ui/sonner'

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <AuthProvider>
    <RouterProvider router={router} />
    <Toaster richColors />
  </AuthProvider>
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
