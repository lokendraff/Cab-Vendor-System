import { TrendingUp, Activity } from 'lucide-react'
import { Skeleton } from '../ui/Skeleton'
import { cn } from '../../utils/cn'

const ChartCard = ({ title, data, isLoading = false, type = 'line' }) => {
  if (isLoading) {
    return (
      <div className="glass-card">
        <div className="flex items-center space-x-3 mb-6">
          <Skeleton className="h-12 w-12 rounded-2xl" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    )
  }

  const renderChart = () => {
    if (type === 'area') {
      return (
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#667eea" />
              <stop offset="100%" stopColor="#764ba2" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="hsl(var(--muted))" strokeDasharray="3 3" opacity={0.5} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tickMargin={10} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tickMargin={10} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
          <Tooltip contentStyle={{
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '1rem'
          }} />
          <Area type="monotone" dataKey="value" stroke="#667eea" strokeWidth={3} fillOpacity={1} fill="url(#revenueGradient)" />
        </AreaChart>
      )
    }

    return (
      <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="hsl(var(--muted))" strokeDasharray="3 3" opacity={0.5} />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tickMargin={10} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
        <YAxis axisLine={false} tickLine={false} tickMargin={10} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
        <Tooltip contentStyle={{
          background: 'hsl(var(--card))',
          border: '1px solid hsl(var(--border))',
          borderRadius: '1rem'
        }} />
        <Line type="monotone" dataKey="bookings" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2 }} activeDot={{ r: 6 }} />
        <Line type="monotone" dataKey="rides" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2 }} activeDot={{ r: 6 }} />
      </LineChart>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="glass-card"
      whileHover={{ y: -4 }}
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          {type === 'revenue' ? (
            <div className="p-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl shadow-glow">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          ) : (
            <div className="p-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl shadow-glow">
              <Activity className="w-6 h-6 text-white" />
            </div>
          )}
          <div>
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-sm text-muted-foreground">Last 30 days</p>
          </div>
        </div>
        <div className="text-3xl font-black gradient-text">↑24%</div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

export default ChartCard

