import { Link, NavLink } from "react-router-dom";

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0A1628] text-white">

      <div className="w-64 bg-[#091422] p-6 space-y-6 border-r border-gray-700">
        <h1 className="text-xl font-bold mt-6">Utility Tool</h1>
        <nav className="space-y-3">
          <NavLink
            to="/create-subtask"
            className={({ isActive }: { isActive: boolean }) =>
              `block p-3 rounded-md ${
                isActive ? "bg-[#1332AF]" : "bg-[#0F223A] hover:bg-[#13325A]"
              }`
            }
          >
            📝 Create Subtasks
          </NavLink>

          <NavLink
            to="/story-points"
            className={({ isActive }: { isActive: boolean }) =>
              `block p-3 rounded-md ${
                isActive ? "bg-[#1332AF]" : "bg-[#0F223A] hover:bg-[#13325A]"
              }`
            }
          >
            📊 Update Story Points
          </NavLink>
        </nav>
      </div>

      <div className="flex-1 p-10">{children}</div>
    </div>
  );
}
// className={({ isActive }) =>
//   `block p-3 rounded-md ${
//     isActive ? "bg-[#13325A]" : "bg-[#0F223A] hover:bg-[#13325A]"
//   }`
// }