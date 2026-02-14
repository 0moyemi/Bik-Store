import Header from '@/app/components/Header'
import AdminDashboard from '.'

const page = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-[52px]">
        <AdminDashboard />
      </main>
    </>
  )
}

export default page