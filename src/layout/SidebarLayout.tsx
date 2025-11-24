import { Link } from "react-router-dom";

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0A1628] text-white">

      <div className="w-64 bg-[#091422] p-6 space-y-6 border-r border-gray-700">
        <h1 className="text-xl font-bold">Utility Tool</h1>

        <nav className="space-y-3">
          <Link
            to="/create-subtask"
            className="block p-3 rounded-md bg-[#0F223A] hover:bg-[#13325A]"
          >
            📝 Create Subtasks
          </Link>

          <Link
            to="/story-points"
            className="block p-3 rounded-md bg-[#0F223A] hover:bg-[#13325A]"
          >
            📊 Update Story Points
          </Link>
        </nav>
      </div>

      <div className="flex-1 p-10">{children}</div>
    </div>
  );
}
