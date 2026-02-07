export default function Navbar() {
  return (
    <div className="bg-white border-b px-6 py-4 flex justify-between items-center">

      <h2 className="text-lg font-semibold">
        Dashboard
      </h2>

      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-600">
          Admin
        </span>

        <div className="w-8 h-8 bg-slate-300 rounded-full"></div>
      </div>

    </div>
  )
}
