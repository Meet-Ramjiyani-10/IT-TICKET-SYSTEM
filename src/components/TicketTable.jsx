export default function TicketTable() {
    return (
        <div className="bg-white p-7 rounded-xl shadow-sm border border-slate-200">
  
  <h3 className="text-lg font-semibold mb-4">
    Recent Tickets
  </h3>

  <table className="w-full text-sm">
    <thead className="border-b text-left text-slate-500">
      <tr>
        <th className="pb-3">ID</th>
        <th className="pb-3">Title</th>
        <th className="pb-3">Priority</th>
        <th className="pb-3">SLA Risk</th>
        <th className="pb-3">Status</th>
      </tr>
    </thead>

    <tbody className="divide-y">

      <tr className="hover:bg-slate-50 transition">
        <td className="py-3">#1023</td>
        <td className="py-3">Server not responding</td>

        <td className="py-3">
          <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-600">
            Critical
          </span>
        </td>

        <td className="py-3 text-red-500 font-semibold">
          82%
        </td>

        <td className="py-3">
          Open
        </td>
      </tr>

      <tr className="hover:bg-slate-50 transition">
        <td className="py-3">#1024</td>
        <td className="py-3">VPN connectivity issue</td>

        <td className="py-3">
          <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-600">
            Medium
          </span>
        </td>

        <td className="py-3 text-orange-500 font-semibold">
          45%
        </td>

        <td className="py-3">
          In Progress
        </td>
      </tr>

    </tbody>
  </table>

</div>

    )
}