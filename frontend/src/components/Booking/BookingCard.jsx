import { Clock, MapPin, User, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '../ui/Button'

const BookingCard = ({ booking }) => {
  const statusColor = booking.status === 'completed' ? 'from-green-500 to-emerald-600' : 
                     booking.status === 'cancelled' ? 'from-red-500 to-rose-600' : 
                     'from-yellow-500 to-amber-600'

  return (
    <div className="card p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-xl bg-gradient-to-r ${statusColor} shadow-lg`}>
            {booking.status === 'completed' && <CheckCircle className="w-6 h-6 text-white" />}
            {booking.status === 'cancelled' && <XCircle className="w-6 h-6 text-white" />}
            {booking.status === 'pending' && <Clock className="w-6 h-6 text-white" />}
          </div>
          <div>
            <h3 className="font-bold text-lg">{booking.customer}</h3>
            <p className="text-sm text-gray-500">ID: #{booking.id}</p>
          </div>
        </div>
        <div className="text-right">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            booking.status === 'completed' ? 'bg-green-100 text-green-800' :
            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {booking.status.toUpperCase()}
          </span>
        </div>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center space-x-3 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{booking.pickup} → {booking.dropoff}</span>
        </div>
        <div className="flex items-center space-x-3 text-sm text-gray-600">
          <User className="w-4 h-4" />
          <span>Distance: {booking.distance} km</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="text-2xl font-bold text-gray-900">₹{booking.amount}</div>
        <Button variant="outline" size="sm">
          {booking.status === 'completed' ? 'Invoice' : 'View Details'}
        </Button>
      </div>
    </div>
  )
}

export default BookingCard

