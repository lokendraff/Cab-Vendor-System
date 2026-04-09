import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import CabCard from '../components/Dashboard/CabCard'

const dummyCabs = [
  {
    id: 1,
    model: 'Toyota Innova Crysta',
    registration: 'MH04-AB1234',
    rate: 15,
    status: 'Available',
    location: 'Andheri, Mumbai'
  },
  {
    id: 2,
    model: 'Honda City',
    registration: 'MH04-CD5678',
    rate: 12,
    status: 'Active Ride',
    location: 'Bandra, Mumbai'
  },
  {
    id: 3,
    model: 'Swift Dzire',
    registration: 'MH04-EF9012',
    rate: 10,
    status: 'Maintenance',
    location: 'Garage'
  }
]

const Cabs = () => {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  const filteredCabs = dummyCabs.filter(cab => 
    cab.model.toLowerCase().includes(search.toLowerCase()) ||
    cab.registration.toLowerCase().includes(search.toLowerCase())
  )

  const tabs = [
    { id: 'all', label: 'All Cabs', count: 12 },
    { id: 'available', label: 'Available', count: 8 },
    { id: 'active', label: 'Active', count: 2 },
    { id: 'maintenance', label: 'Maintenance', count: 2 }
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
            My Cabs
          </h1>
          <p className="text-gray-600 mt-1">Manage your fleet (Total: 12 cabs)</p>
        </div>
        <Button className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 px-8">
          <Plus className="w-5 h-5 mr-2" />
          Add New Cab
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Fleet Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map(tab => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'outline'}
                size="sm"
                className="capitalize"
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label} <span className="ml-1 font-mono text-xs">({tab.count})</span>
              </Button>
            ))}
          </div>

          {/* Search */}
          <div className="flex gap-3 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by model or registration..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-11"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cabs Grid */}
      <Card>
        <CardHeader>
          <CardTitle>{filteredCabs.length} Cab{filteredCabs.length !== 1 ? 's' : ''} Found</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCabs.length === 0 ? (
            <div className="text-center py-20">
              <Car className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No cabs found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or filters.</p>
              <Button>Add Your First Cab</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCabs.map(cab => (
                <CabCard key={cab.id} cab={cab} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Cabs

