import Sidebar from "./components/Sidebar"
import Navbar from "./components/Navbar"
import Dashboard from "./pages/Dashboard"
import TicketTable from "./components/TicketTable"

export default function App() {
  return (
    <div className="flex h-screen overflow-hidden">
      
      <Sidebar />

    <div className="flex-1 flex flex-col bg-slate-100">

        <Navbar />

        <main className="flex-1 p-6 overflow-y-auto space-y-9">
          <Dashboard />
          <TicketTable />
        </main>

    </div>

    </div>
  )
}
