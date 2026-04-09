import { Car, MapPin, Users, DollarSign } from 'lucide-react'
import { Button } from '../ui/Button'

const CabCard = ({ cab }) => {
  return (
    <div className="card group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
            <Car className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-gray-900">{cab.model}</h3>
            <p className="text-sm text-gray-500">Reg: {cab.registration}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-2xl text-emerald-600">₹{cab.rate}/km</p>
          <p className="text-xs text-gray-500">{cab.status}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
        <div className="flex items-center space-x-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{cab.location}</span>
        </div>
        <div className="flex items-center justify-end space-x-2 text-gray-600">
          <Users className="w-4 h-4" />
          <span>4 Seats</span>
        </div>
      </div>
      
      <div className="flex gap-2 pt-4 border-t">
        <Button variant="outline" size="sm" className="flex-1">Edit</Button>
        <Button size="sm" className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">View Details</Button>
      </div>
    </div>
  )
}

export default CabCard

