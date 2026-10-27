import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

const root = createRoot(document.getElementById('root')!)

function showLoadError(err: unknown) {
  console.error('App failed to load:', err)
  root.render(
    <div className="auth-loading" role="alert">
      <strong>Something went wrong loading the app.</strong>
      <span>Open the browser console for details, then refresh.</span>
    </div>,
  )
}

Promise.all([import('./App'), import('./hooks/useAuth')])
  .then(([{ default: App }, { AuthProvider }]) => {
    root.render(
      <StrictMode>
        <AuthProvider>
          <App />
        </AuthProvider>
      </StrictMode>,
    )
  })
  .catch(showLoadError)
