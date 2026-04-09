import { Camera, Edit3, Phone, Mail, MapPin, Building } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'

const Profile = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <Card className="overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-black mb-2">Vendor Dashboard</h1>
              <p className="text-blue-100 text-lg">Gold Member • Joined Aug 2023</p>
            </div>
            <Button size="lg" variant="secondary" className="border-2 border-white/30 backdrop-blur-sm text-white hover:bg-white/20">
              <Camera className="w-5 h-5 mr-2" />
              Update Photo
            </Button>
          </div>
        </div>
        
        <CardContent className="p-0">
          <div className="md:flex gap-8 p-8">
            {/* Profile Image */}
            <div className="text-center mb-8 md:mb-0 md:flex-shrink-0">
              <div className="w-32 h-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center shadow-2xl border-4 border-white relative">
                <Camera className="w-16 h-16 text-gray-500" />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Photo
              </Button>
            </div>

            {/* Profile Info */}
            <div className="space-y-6 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Business Name</label>
                  <div className="p-4 bg-gray-50 rounded-xl border-l-4 border-blue-500">
                    <p className="font-bold text-xl text-gray-900">Elite Cab Services</p>
                    <p className="text-sm text-gray-500 mt-1">Verified Partner</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Vendor Rating</label>
                  <div className="flex items-center p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl">
                    <div className="flex text-yellow-500 mr-3">
                      {'★'.repeat(4)}{'☆'}
                    </div>
                    <span className="font-bold text-2xl text-yellow-700">4.7</span>
                    <span className="text-sm text-gray-600 ml-2">(128 reviews)</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 border-t">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    Phone
                  </label>
                  <p className="font-semibold text-lg">+91 98765 43210</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </label>
                  <p className="font-semibold text-lg break-all">vendor@elitecabs.com</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Location
                  </label>
                  <p className="font-semibold text-lg">Andheri West, Mumbai</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">Emergency Contact</label>
              <Input placeholder="+91 98765 43210" />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">Fleet Capacity</label>
              <Input type="number" placeholder="25" />
            </div>
          </div>
          <div className="pt-6 border-t space-y-3">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl">
              Update Profile
            </Button>
            <Button variant="outline" className="w-full">Change Password</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Profile

