import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SidebarLayout from "./layout/SidebarLayout";
import SubtaskCreator from "./pages/SubtaskCreator";
import StoryPoints from "./pages/StoryPoints";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <SidebarLayout>
        <Routes>
          <Route index element={<Navigate to="/create-subtask" />} />
          <Route path="/create-subtask" element={<SubtaskCreator />} />
          <Route path="/story-points" element={<StoryPoints />} />
        </Routes>
      </SidebarLayout>
      <Toaster position="top-right" />
    </BrowserRouter>
    
  );
}

export default App;
