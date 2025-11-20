import { useRef, useState } from "react";

import AddStory from "./components/AddStory";
import StoryList from "./components/StoryList";
import PreviewList from "./components/PreviewList";
import Popup from "./components/Popup";
import Loader from "./components/Loader";

import { Story, SubTaskType, PreviewItem } from "./types";

function App() {
  const [stories, setStories] = useState<Story[]>([]);
  const [previewSubtask, setPreviewSubtask] = useState<PreviewItem[]>([]);

  const [addErrorMessage, setAddErrorMessage] = useState("");
  const [previewErrorMessage, setPreviewErrorMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] =
    useState<"success" | "error" | "">("");

  const inputRef = useRef<HTMLInputElement>(null);

  const create_url = process.env.REACT_APP_CREATE_API_URL || "";
  const search_url = process.env.REACT_APP_SEARCH_API_URL || "";

  const addStory = () => {
    const value = inputRef.current?.value || "";

    setAddErrorMessage("");
    setPreviewErrorMessage("");

    if (stories.some((s) => s.text === value)) {
      setAddErrorMessage("User Story already exists!");
      return;
    }
    if (!value) {
      setAddErrorMessage("User Story is required*");
      return;
    }

    setStories([
      ...stories,
      { id: Date.now(), text: value, type: SubTaskType.Both },
    ]);

    inputRef.current!.value = "";
  };

  const previewSubtasks = async (event: any) => {
    event.preventDefault();
    setAddErrorMessage("");
    setPreviewErrorMessage("");
    setIsLoading(true);

    if (stories.length === 0) {
      setPreviewErrorMessage("No User Story to preview SubTasks!");
      setIsLoading(false);
      return;
    }

    const story_payload = stories.map((s) => ({
      subtask: s.text,
      type: s.type,
    }));

    try {
      const response = await fetch(search_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(story_payload),
      });

      const json = await response.json();

      if (!response.ok || json.status === "error") {
        setPreviewErrorMessage("Preview failed.");
        return;
      }

      setPreviewSubtask(json);
    } catch (err: any) {
      setPreviewErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStoryType = (id: number, type: SubTaskType) => {
    setAddErrorMessage("");
    setPreviewErrorMessage("");

    setStories((prev) =>
      prev.map((s) => (s.id === id ? { ...s, type } : s))
    );

    setPreviewSubtask([]);
  };

  const removeStory = (id: number) => {
    setAddErrorMessage("");
    setPreviewErrorMessage("");

    setStories((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      if (previewSubtask.length > 0) setPreviewSubtask([]);
      return updated;
    });
  };

  const generateSubtasks = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);

    const payload = previewSubtask
      .filter((s) => !s.exist)
      .map((s) => ({
        parent: { key: s.summary.match(/\(([^)]+)\)/)![1] },
        summary: s.summary,
      }));

    if (payload.length === 0) {
      setPopupMessage("All subtasks already exist. Nothing to create.");
      setPopupType("error");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(create_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await response.json();

      if (!response.ok || json.status === "error") {
        let formatted = "";

        if (json.created_tasks?.length) {
          formatted += "Created subtasks:\n\nID        LINK\n";
          json.created_tasks.forEach((task: any) => {
            formatted += `${task.id}   <a class="link" href="${task.link}" target="_blank">${task.link}</a>\n`;
          });
          formatted += "\n";
        }

        if (json.error_messages?.length) {
          formatted += "Error:\n";
          json.error_messages.forEach((e: string) => {
            formatted += `• ${e}\n`;
          });
        }

        setPopupMessage(formatted || "Unknown Error");
        setPopupType("error");
        return;
      }

      let formatted = "Created subtasks:\n\nID         LINK\n";
      json.created_tasks.forEach((task: any) => {
        formatted += `${task.id}   <a class="link" href="${task.link}" target="_blank">${task.link}</a>\n`;
      });

      setPopupMessage(formatted);
      setPopupType("success");
    } catch (err: any) {
      setPopupMessage(err.message);
      setPopupType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const closePopup = () => {
    setStories([]);
    setPreviewSubtask([]);
    setPopupType("");
    setPopupMessage("");
  };

  return (
    <div className="min-h-screen bg-[#0A1628] text-white p-10">
      <div className="max-w-4xl mx-auto bg-[#091422] p-6 rounded-xl shadow-lg space-y-6">

        <AddStory
          inputRef={inputRef}
          addStory={addStory}
          error={addErrorMessage}
        />

        <StoryList
          stories={stories}
          updateStoryType={updateStoryType}
          removeStory={removeStory}
        />

        <button
          onClick={previewSubtasks}
          className="w-full bg-[#0FB1D3] py-4 font-semibold rounded-md text-lg"
        >
          Preview
        </button>

        {previewErrorMessage && (
          <div style={{ color: "red" }}>{previewErrorMessage}</div>
        )}

        <PreviewList
          preview={previewSubtask}
          generateSubtasks={generateSubtasks}
        />

      </div>

      {isLoading && <Loader />}

      <Popup
        type={popupType}
        message={popupMessage}
        onClose={closePopup}
      />
    </div>
  );
}

export default App;
