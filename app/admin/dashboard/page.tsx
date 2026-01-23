import Header from '@/app/components/Header'
import AdminDashboard from '.'

const page = () => {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <AdminDashboard />
    </main>
  )
}

export default page