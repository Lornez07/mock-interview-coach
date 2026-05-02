import { Link, useNavigate, useLocation } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Get token and username to determine if user is logged in
  const token = localStorage.getItem('token')
  const userName = localStorage.getItem('userName')

  // Don't render the navbar on public auth pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">AI</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900 hidden sm:block">
                Mock Interview Coach
              </span>
            </Link>
            
            {token && (
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                <Link
                  to="/"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === '/' 
                      ? 'border-indigo-500 text-slate-900' 
                      : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/history"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === '/history' 
                      ? 'border-indigo-500 text-slate-900' 
                      : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                  }`}
                >
                  History
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {token ? (
              <>
                <span className="text-sm font-medium text-slate-600 hidden sm:block">
                  Hi, {userName || 'User'}
                </span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu (simplified) */}
      {token && (
        <div className="sm:hidden border-t border-slate-200 flex justify-around py-2">
           <Link
            to="/"
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              location.pathname === '/' 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/history"
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              location.pathname === '/history' 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            History
          </Link>
        </div>
      )}
    </nav>
  )
}
