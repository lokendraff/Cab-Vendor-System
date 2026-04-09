import { useState } from 'react'
import { Search, Calendar, Filter } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import BookingCard from '../components/Booking/BookingCard'

const dummyBookings = [
  {
    id: 'BK001',
    customer: 'Priya Sharma',
    pickup: 'Bandra West',
    dropoff: 'Andheri East',
    distance: '12.5 km',
    amount: 156,
    status: 'completed',
    time: '2 hours ago'
  },
  {
    id: 'BK002',
    customer: 'Rahul Patel',
    pickup: 'Lower Parel',
    dropoff: 'Navi Mumbai',
    distance: '25 km',
    amount: 325,
    status: 'pending',
    time: '45 mins ago'
  },
  {
    id: 'BK003',
    customer: 'Anita Desai',
    pickup: 'Malad',
    dropoff: 'BKC',
    distance: '18 km',
    amount: 234,
    status: 'cancelled',
    time: '1 day ago'
  }
]

const Bookings = () => {
  const [search, setSearch] = useState('')
  const [dateRange, setDateRange] = useState('today')

  const filteredBookings = dummyBookings.filter(booking => 
    booking.customer.toLowerCase().includes(search.toLowerCase()) ||
    booking.id.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Bookings
          </h1>
          <p className="text-gray-600 mt-1">All your recent bookings (Total: 127)</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Bookings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search customer or booking ID"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Date range"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="justify-center">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings ({filteredBookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map(booking => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
          {filteredBookings.length === 0 && (
            <div className="text-center py-20">
              <Calendar className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No bookings found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search filters.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Bookings

