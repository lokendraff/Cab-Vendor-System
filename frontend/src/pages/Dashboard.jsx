import { useEffect, useState } from 'react'
import AnimatedKPI from '../components/Dashboard/AnimatedKPI'
import ChartCard from '../components/Dashboard/ChartCard'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import { Car, MapPin, Users, DollarSign, Activity, Clock, Truck } from 'lucide-react'
import { Skeleton } from '../components/ui/Skeleton'
import { Button } from '../components/ui/Button'
import { cn } from '../utils/cn'

const chartData = [
  { name: 'Jan', bookings: 40, rides: 24 },
  { name: 'Feb', bookings: 30, rides: 13 },
  { name: 'Mar', bookings: 50, rides: 31 },
  { name: 'Apr', bookings: 60, rides: 45 },
  { name: 'May', bookings: 70, rides: 52 },
  { name: 'Jun', bookings: 80, rides: 65 },
]

const revenueData = [
  { name: 'W1', value: 4000 },
  { name: 'W2', value: 3200 },
  { name: 'W3', value: 5800 },
  { name: 'W4', value: 4500 },
]

const activityFeed = [
  { id: 1, type: 'cab', title: 'Cab #MH04-AB1234 assigned', subtitle: 'Driver: John Doe', time: '2 min ago', status: 'active' },
  { id: 2, type: 'booking', title: 'Booking #BK789 confirmed', subtitle: 'Lower Parel → Bandra', time: '5 min ago', status: 'confirmed' },
  { id: 3, type: 'driver', title: 'Driver Rajesh online', subtitle: 'Cab #MH02-CD4567', time: '8 min ago', status: 'online' },
  { id: 4, type: 'ride', title: 'Ride completed', subtitle: '₹450 earned', time: '12 min ago', status: 'completed' },
  { id: 5, type: 'payment', title: 'Payout processed', subtitle: '₹12,500 transferred', time: '1 hr ago', status: 'paid' },
]

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalCabs: 0,
    activeRides: 0,
    totalBookings: 0,
    totalRevenue: 0
  })

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setStats({
        totalCabs: 24,
        activeRides: 8,
        totalBookings: 156,
        totalRevenue: 24500
      })
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-gray-900"
    >
      <div className="container mx-auto px-6 py-12 space-y-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-black gradient-text mb-6 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 dark:from-slate-100 dark:to-white bg-clip-text text-transparent">
            Vendor Dashboard
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Monitor your fleet, track earnings and manage operations in real-time. 
            Everything you need to grow your cab business.
          </p>
        </motion.div>

        {/* Animated KPI Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <AnimatedKPI
            title="Total Cabs"
            value={stats.totalCabs}
            change={18}
            icon={Car}
            color="blue"
            isLoading={isLoading}
            animateIn
          />
          <AnimatedKPI
            title="Active Rides"
            value={stats.activeRides}
            change={32}
            icon={MapPin}
            color="green"
            isLoading={isLoading}
            animateIn
          />
          <AnimatedKPI
            title="Bookings"
            value={stats.totalBookings}
            change={12}
            icon={Users}
            color="orange"
            isLoading={isLoading}
            animateIn
          />
          <AnimatedKPI
            title="Revenue"
            value={stats.totalRevenue}
            change={28}
            icon={DollarSign}
            color="purple"
            isLoading={isLoading}
            animateIn
          />
        </motion.div>

        {/* Charts & Activity */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <ChartCard title="Bookings & Rides" data={chartData} />
          <ChartCard title="Revenue" data={revenueData} type="area" />
        </motion.div>

        {/* Real-time Activity Feed */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <motion.div 
            className="lg:col-span-2 glass-card p-8"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl shadow-glow animate-pulse-slow">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Real-time Activity</h3>
                  <p className="text-sm text-muted-foreground">Live updates from your fleet</p>
                </div>
              </div>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-glow-lg px-6">
                View All
              </Button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 pr-4">
              {activityFeed.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group flex items-center space-x-4 p-6 rounded-3xl hover:bg-white/50 dark:hover:bg-slate-800/50 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:shadow-glow hover:-translate-x-2"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className={`p-3 rounded-2xl shadow-lg animate-bounce-gentle ${getStatusColor(activity.status)}`}>
                    {getIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-lg group-hover:gradient-text transition-all">{activity.title}</p>
                    <p className="text-sm text-muted-foreground mt-1 truncate">{activity.subtitle}</p>
                  </div>
                  <div className="text-xs font-medium px-3 py-1 bg-white/20 dark:bg-slate-700/50 rounded-full backdrop-blur-sm">
                    {activity.time}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            className="glass-card p-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            whileHover={{ scale: 1.03 }}
          >
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">Quick Actions</h3>
              <p className="text-muted-foreground">Manage your fleet instantly</p>
            </div>
            
            <div className="space-y-4">
              <ActionButton icon="➕" label="Add New Cab" color="blue" />
              <ActionButton icon="📱" label="Assign Driver" color="green" />
              <ActionButton icon="⚙️" label="Fleet Settings" color="purple" />
              <ActionButton icon="📊" label="View Reports" color="orange" />
            </div>
          </motion.div>
        </motion.section>
      </div>
    </motion.div>
  )
}

function ActionButton({ icon, label, color }) {
  const colors = {
    blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    green: 'from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700',
    purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
    orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'group w-full p-6 rounded-3xl border-2 border-white/30 dark:border-slate-700/50 backdrop-blur-xl bg-gradient-to-r shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden relative',
        colors[color]
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity" />
      <div className="relative flex items-center space-x-4 z-10">
        <div className="text-2xl p-2 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg">
          {icon}
        </div>
        <span className="font-semibold text-lg">{label}</span>
      </div>
    </motion.button>
  )
}

function getIcon(type) {
  const icons = {
    cab: <Car className="w-6 h-6" />,
    booking: <MapPin className="w-6 h-6" />,
    driver: <Users className="w-6 h-6" />,
    ride: <Truck className="w-6 h-6" />,
    payment: <DollarSign className="w-6 h-6" />,
  }
  return icons[type] || <Activity className="w-6 h-6" />
}

function getStatusColor(status) {
  const colors = {
    active: 'bg-emerald-500/20 border-emerald-500/30 shadow-emerald-500/25',
    confirmed: 'bg-blue-500/20 border-blue-500/30 shadow-blue-500/25',
    online: 'bg-green-500/20 border-green-500/30 shadow-green-500/25',
    completed: 'bg-orange-500/20 border-orange-500/30 shadow-orange-500/25',
    paid: 'bg-purple-500/20 border-purple-500/30 shadow-purple-500/25',
  }
  return colors[status] || 'bg-slate-500/20 border-slate-500/30 shadow-slate-500/25'
}

export default Dashboard


