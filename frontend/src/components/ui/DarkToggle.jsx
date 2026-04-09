import { useTheme } from '../../contexts/ThemeContext'
import { Moon, Sun } from 'lucide-react'
import { Button } from './Button'

const DarkToggle = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:scale-105 hover:rotate-3 active:scale-95"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-orange-400" />
      ) : (
        <Moon className="w-5 h-5 text-slate-400" />
      )}
    </button>
  )
}

export { DarkToggle }

