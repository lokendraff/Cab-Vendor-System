import { Outlet } from 'react-router-dom'
import LoginForm from '../components/Auth/LoginForm'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-2xl">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            CabVendor
          </CardTitle>
          <p className="text-gray-600">Manage your cab fleet with ease</p>
        </CardHeader>
        <CardContent>
          <Outlet />
        </CardContent>
      </Card>
    </div>
  )
}

export default AuthLayout

