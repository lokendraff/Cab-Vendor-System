import { Users, Car, MapPin, DollarSign } from 'lucide-react'

const StatsCard = ({ title, value, change, icon: Icon, color = 'blue' }) => {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    purple: 'from-purple-500 to-purple-600',
  }

  return (
    <div className="card p-6 h-full">
      <div className="flex items-center">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${colors[color]} text-white shadow-lg`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          <p className={`text-sm font-medium mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? '+' : ''}{change}%
          </p>
        </div>
      </div>
    </div>
  )
}

export default StatsCard

