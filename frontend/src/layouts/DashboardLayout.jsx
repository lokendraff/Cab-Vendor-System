import { useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { 
  Home, 
  Car, 
  Calendar, 
  User, 
  LogOut,
  Menu,
  X 
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { cn } from '../utils/cn'

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (window.innerWidth >= 1024) {
        const sidebarRect = document.querySelector('aside')?.getBoundingClientRect()
        if (sidebarRect && e.clientX <= sidebarRect.right + 20) {
          setSidebarCollapsed(false)
        } else if (!sidebarOpen) {
          setSidebarCollapsed(true)
        }
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [sidebarOpen])

  const sidebarWidth = sidebarCollapsed ? 'w-20 lg:w-72' : 'w-72 lg:w-72'

  return (
    <div className="min-h-screen glass bg-gradient-to-br from-slate-50/50 via-white/30 to-indigo-50/50 dark:from-slate-950/80 dark:via-slate-900/70 dark:to-gray-900/50 backdrop-blur-sm">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-fade-in" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Enhanced Sidebar */}
      <motion.aside 
        layout
        animate={{ width: sidebarOpen ? 280 : sidebarCollapsed ? 80 : 288 }}
        className={cn(
          `fixed z-50 top-0 left-0 h-full ${sidebarWidth} bg-white/80 dark:bg-slate-900/90 glass-card shadow-2xl backdrop-blur-xl border-r border-white/20 dark:border-slate-800/50 transition-all duration-500 ease-out`,
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        initial={false}
      >
        <motion.div 
          layout
          className="p-6 border-b border-white/10 dark:border-slate-800/50 sticky top-0 bg-inherit backdrop-blur-sm z-10"
        >
          <motion.div className="flex items-center space-x-3" layout>
            <motion.div 
              className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/25 animate-sparkle"
              layout
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Car className="w-7 h-7 lg:w-8 lg:h-8 text-white drop-shadow-lg" />
            </motion.div>
            {!sidebarCollapsed && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="min-w-0"
              >
                <h2 className="font-black text-2xl lg:text-2xl gradient-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
                  CabVendor
                </h2>
                <p className="text-xs opacity-75 font-medium text-slate-600 dark:text-slate-400">Premium Fleet</p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
        
        <nav className="p-2 lg:p-6 space-y-1 lg:space-y-2 overflow-y-auto h-[calc(100vh-140px)] scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
          {navItems.map((item) => (
            <NavLink 
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={location.pathname === item.href}
              collapsed={sidebarCollapsed}
            />
          ))}
        </nav>
        
        {/* Bottom actions */}
        <motion.div 
          className="absolute bottom-6 left-6 right-6 lg:bottom-8 backdrop-blur-sm z-10"
          layout
        >
          <div className="flex space-x-2">
            <DarkToggle />
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                className="flex-1 lg:flex-none" 
                onClick={handleLogout}
                size="sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {!sidebarCollapsed && 'Logout'}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </motion.aside>

      {/* Enhanced Header */}
      <motion.header 
        className={cn(
          "lg:hidden p-4 border-b border-slate-200/50 bg-white/80 backdrop-blur-sm sticky top-0 z-30 shadow-sm",
          sidebarCollapsed ? 'lg:pl-24' : 'lg:pl-80'
        )}
        initial={false}
      >
        <div className="flex items-center justify-between">
          <motion.div
            className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg"
            whileTap={{ scale: 0.98, rotate: 90 }}
            transition={{ type: 'spring' }}
          >
            <Menu className="w-6 h-6 text-white" />
          </motion.div>
          
          <div className="flex items-center space-x-2">
            <DarkToggle />
            <motion.div
              className="w-10 h-10 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg animate-bounce-gentle"
              whileHover={{ scale: 1.1 }}
            >
              <span className="text-white font-bold text-lg">8</span>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main content with smooth transitions */}
      <motion.main 
        className={cn(
          "p-6 lg:p-12 transition-all duration-500",
          sidebarCollapsed ? 'lg:ml-20 lg:mr-6' : 'lg:ml-80 lg:mr-12'
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait" onExitComplete>
          <Outlet />
        </AnimatePresence>
      </motion.main>
    </div>
  )
}

export default DashboardLayout

