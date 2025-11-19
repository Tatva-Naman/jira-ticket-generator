import React, { useRef, useState } from "react";

enum SubTaskType {
  FE = "FE",
  BE = "BE",
  Both = "Both",
}

interface Story {
  id: number;
  text: string;
  type: SubTaskType;
}

function App() {
  const [stories, setStories] = useState<Story[]>([]);
  const [previewSubtask, setPreviewSubtasks] = useState<string[]>([]);
  const [responseMessage, setResponseMessage] = useState("");
  const [addErrorMessage, setAddErrorMessage] = useState("");
  const [previewErrorMessage, setPreviewErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error" | "">("");

  const inputRef = useRef<HTMLInputElement>(null);

  const url = process.env.REACT_APP_RUST_URL || "";

  //add story
  const addStory = () => {
    const value = inputRef.current?.value || "";

    setAddErrorMessage("");
    setPreviewErrorMessage("");
    setResponseMessage("");

    if (stories.filter((s) => s.text === value).length > 0) {
      setAddErrorMessage("User Story already exists!");
      return;
    } else if (value === "") {
      setAddErrorMessage("User Story required*");
      return;
    } else {
      setStories([
        ...stories,
        { id: Date.now(), text: value, type: SubTaskType.Both },
      ]);
      inputRef.current!.value = "";
    }
    inputRef.current!.value = "";
  };

  //generate preview
  const generatePreview = (storyList: Story[]) => {
    const list: string[] = [];

    storyList.forEach((s) => {
      if (s.type === SubTaskType.FE || s.type === SubTaskType.Both) {
        list.push(`(${s.text}) FE - Review Requirements`);
        list.push(`(${s.text}) FE - Development`);
        list.push(`(${s.text}) FE - Unit Testing`);
      }
      if (s.type === SubTaskType.BE || s.type === SubTaskType.Both) {
        list.push(`(${s.text}) BE - Review Requirements`);
        list.push(`(${s.text}) BE - Development`);
        list.push(`(${s.text}) BE - Unit Testing`);
      }
    });

    setPreviewSubtasks(list);
  };

  //preview
  const previewSubtasks = () => {
    setAddErrorMessage("");
    setPreviewErrorMessage("");
    setResponseMessage("");

    if (stories.length === 0) {
      setPreviewErrorMessage("No User Story to preview SubTasks!");
      return;
    }
    generatePreview(stories);
  };

  //update story
  const updateStoryType = (id: number, type: SubTaskType) => {
    setAddErrorMessage("");
    setPreviewErrorMessage("");
    setResponseMessage("");

    setStories(stories.map((s) => (s.id === id ? { ...s, type } : s)));
    setPreviewSubtasks([]);
  };

  //remove story
  const removeStory = (id: number) => {
    setAddErrorMessage("");
    setPreviewErrorMessage("");
    setResponseMessage("");

    setStories((prev) => {
      const updated = prev.filter((s) => s.id !== id);

      if (previewSubtask.length > 0) {
        generatePreview(updated);
      }

      return updated;
    });
  };

  //generate subtasks
  const generateSubtasks = async (event: any) => {
    event.preventDefault();
    setAddErrorMessage("");
    setResponseMessage("");
    setIsLoading(true);

    let payload = previewSubtask.map((subtask) => ({
      parent: {
        key: subtask.match(/\(([^)]+)\)/)![1],
      },
      summary: subtask,
    }));

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // if (!response.ok) {
      //   const errJson = await response.json();

      //   let parsedMessages = [];
      //   try {
      //     parsedMessages = JSON.parse(errJson.message);
      //   } catch {
      //     parsedMessages = [errJson.message];
      //   }

      //   const formatted = parsedMessages
      //     .map((msg: string) => `Error: ${msg}`)
      //     .join("\n");

      //   throw new Error(formatted);
      // }

      const json_data = await response.json();

      if (!response.ok || json_data.status === "error") {
        let formatted = "";
  
        if (json_data.created_tasks && json_data.created_tasks.length > 0) {
          formatted += "Some tasks were created:\n\nID        LINK\n";
  
          json_data.created_tasks.forEach((task: any) => {
            formatted += `${task.id}     ${task.link}\n`;
          });
  
          formatted += "\n"; 
        }
  
        if (json_data.error_messages && json_data.error_messages.length > 0) {
          formatted += "Errors:\n";
          json_data.error_messages.forEach((msg: string) => {
            formatted += `• ${msg}\n`;
          });
        }
  
        if (formatted.trim() === "") {
          formatted = "Unknown error occurred.";
        }
  
        setPopupMessage(formatted);
        setPopupType("error");
        return; 
      }

      let formatted = "Tasks created successfully!\n\nID         LINK\n";
      json_data.created_tasks.forEach((task: any) => {
        formatted += `${task.id}     ${task.link}\n`;
      });

      setPopupMessage(formatted);
      setPopupType("success");

    } catch (error: any) {
      setPopupMessage(error.message);
      setPopupType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1628] text-white p-10">
      <div className="max-w-4xl mx-auto bg-[#091422] p-6 rounded-xl shadow-lg space-y-6 ">
        <h2 className="text-xl font-semibold">Add User Story</h2>
        <div className="flex gap-3">
          <input
            type="text"
            ref={inputRef}
            placeholder="e.g., PROJ-123 As a user, I want…"
            className="flex-1 bg-[#0F223A] p-3 rounded-md outline text-gray-300"
          />
          <button
            onClick={addStory}
            className="bg-[#0FB1D3] px-5 py-3 font-bold rounded-md"
          >
            Add
          </button>
        </div>
        {addErrorMessage && <div style={{ color: "red" }}>{addErrorMessage}</div>}

        <h2 className="text-xl font-semibold">Story List</h2>
        <div className="space-y-4">
          {stories.map((s) => (
            <div
              key={s.id}
              className="bg-[#0F223A] p-4 rounded-md flex justify-between items-center"
            >
              <span>{s.text}</span>
              <div className="flex gap-3 item-center text-sm">
                <label className="flex gap-1 item-center">
                  <input
                    type="radio"
                    checked={s.type === SubTaskType.FE}
                    onChange={() => updateStoryType(s.id, SubTaskType.FE)}
                  />
                  FE
                </label>

                <label className="flex gap-1 item-center">
                  <input
                    type="radio"
                    checked={s.type === SubTaskType.BE}
                    onChange={() => updateStoryType(s.id, SubTaskType.BE)}
                  />
                  BE
                </label>

                <label className="flex gap-1 item-center">
                  <input
                    type="radio"
                    checked={s.type === SubTaskType.Both}
                    onChange={() => updateStoryType(s.id, SubTaskType.Both)}
                  />
                  Both
                </label>

                <button
                  onClick={() => removeStory(s.id)}
                  className="rounded-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="18"
                    height="18"
                    viewBox="0 0 64 64"
                    fill="white"
                  >
                    <path d="M 30 2 C 29 2 28.101563 2.5 27.5 3.300781 L 24.5 8 L 13 8 C 11.300781 8 10 9.300781 10 11 L 10 17 C 10 18.699219 11.300781 20 13 20 L 13.097656 20 L 16.597656 53.5 C 16.898438 56.101563 19 58 21.597656 58 L 46.402344 58 C 49 58 51.101563 56.101563 51.402344 53.5 L 54.902344 20 L 55 20 C 56.699219 20 58 18.699219 58 17 L 58 11 C 58 9.300781 56.699219 8 55 8 L 43.5 8 L 40.402344 3.300781 C 39.902344 2.5 38.902344 2 37.902344 2 Z M 30.097656 4 L 38 4 C 38.300781 4 38.601563 4.199219 38.800781 4.398438 L 41.097656 8 L 26.902344 8 L 29.199219 4.398438 C 29.398438 4.199219 29.699219 4 30.097656 4 Z M 13 10 L 55 10 C 55.601563 10 56 10.398438 56 11 L 56 17 C 56 17.601563 55.601563 18 55 18 L 13 18 C 12.398438 18 12 17.601563 12 17 L 12 11 C 12 10.398438 12.398438 10 13 10 Z M 16 12 C 15.398438 12 15 12.398438 15 13 L 15 15 C 15 15.601563 15.398438 16 16 16 C 16.601563 16 17 15.601563 17 15 L 17 13 C 17 12.398438 16.601563 12 16 12 Z M 21 12 C 20.398438 12 20 12.398438 20 13 L 20 15 C 20 15.601563 20.398438 16 21 16 C 21.601563 16 22 15.601563 22 15 L 22 13 C 22 12.398438 21.601563 12 21 12 Z M 26 12 C 25.398438 12 25 12.398438 25 13 L 25 15 C 25 15.601563 25.398438 16 26 16 C 26.601563 16 27 15.601563 27 15 L 27 13 C 27 12.398438 26.601563 12 26 12 Z M 31 12 C 30.398438 12 30 12.398438 30 13 L 30 15 C 30 15.601563 30.398438 16 31 16 C 31.601563 16 32 15.601563 32 15 L 32 13 C 32 12.398438 31.601563 12 31 12 Z M 37 12 C 36.398438 12 36 12.398438 36 13 L 36 15 C 36 15.601563 36.398438 16 37 16 C 37.601563 16 38 15.601563 38 15 L 38 13 C 38 12.398438 37.601563 12 37 12 Z M 42 12 C 41.398438 12 41 12.398438 41 13 L 41 15 C 41 15.601563 41.398438 16 42 16 C 42.601563 16 43 15.601563 43 15 L 43 13 C 43 12.398438 42.601563 12 42 12 Z M 47 12 C 46.398438 12 46 12.398438 46 13 L 46 15 C 46 15.601563 46.398438 16 47 16 C 47.601563 16 48 15.601563 48 15 L 48 13 C 48 12.398438 47.601563 12 47 12 Z M 52 12 C 51.398438 12 51 12.398438 51 13 L 51 15 C 51 15.601563 51.398438 16 52 16 C 52.601563 16 53 15.601563 53 15 L 53 13 C 53 12.398438 52.601563 12 52 12 Z M 15.097656 20 L 52.902344 20 L 49.402344 53.300781 C 49.199219 54.800781 48 56 46.402344 56 L 21.597656 56 C 20.097656 56 18.800781 54.800781 18.597656 53.300781 Z M 34 25 C 33.398438 25 33 25.398438 33 26 L 33 46 C 33 46.601563 33.398438 47 34 47 C 34.601563 47 35 46.601563 35 46 L 35 26 C 35 25.398438 34.601563 25 34 25 Z M 25 25.097656 C 24.398438 25.097656 24 25.597656 24.097656 26.097656 L 25.097656 46.097656 C 25 46.597656 25.5 47 26 47 C 26.601563 47 27 46.5 27 46 L 26 26 C 26 25.398438 25.5 25 25 25.097656 Z M 43.097656 25.097656 C 42.5 25.097656 42.097656 25.5 42.097656 26 L 41.097656 46 C 41 46.5 41.398438 47 42 47 C 42.601563 47 43 46.597656 43 46.097656 L 44 26.097656 C 44 25.5 43.597656 25.097656 43.097656 25.097656 Z M 23 52 C 22.398438 52 22 52.398438 22 53 C 22 53.601563 22.398438 54 23 54 L 37 54 C 37.601563 54 38 53.601563 38 53 C 38 52.398438 37.601563 52 37 52 Z M 41 52 C 40.398438 52 40 52.398438 40 53 C 40 53.601563 40.398438 54 41 54 L 45 54 C 45.601563 54 46 53.601563 46 53 C 46 52.398438 45.601563 52 45 52 Z"></path>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={previewSubtasks}
          className="w-full bg-[#0FB1D3] py-4 font-semibold rounded-md text-lg"
        >
          Preview
        </button>
        {previewErrorMessage && (
          <div style={{ color: "red" }}>{previewErrorMessage}</div>
        )}

        {previewSubtask.length > 0 && (
          <div>
            <div className="flex justify-between item-center">
              <h2 className="text-xl font-semibold">Subtasks</h2>
            </div>
            <div className="space-y-4 h-60 overflow-auto thin-scrollbar">
              {previewSubtask.map((g, id) => (
                <div
                  key={id}
                  className="bg-[#0F223A] p-3 rounded-md text-sm "
                >
                  {g}
                </div>
              ))}
            </div>
            <button
              onClick={generateSubtasks}
              className="w-full bg-[#0FB1D3] py-4 font-semibold rounded-md text-lg"
            >
              Generate
            </button>
            {responseMessage && (
              <div style={{ color: "green" }}>{responseMessage}</div>
            )}
          </div>
        )}
      </div>
      {isLoading && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-[#0FB1D3] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {popupType !== "" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#0F223A] p-6 rounded-lg w-auto space-y-4 border border-gray-700">

            <h2 className="text-xl font-semibold">
              {popupType === "success" ? "Success" : "Error"}
            </h2>

            <pre className="whitespace-pre-wrap text-sm">
              {popupMessage}
            </pre>

            <button
              onClick={() => {
                setStories([]);
                setPreviewSubtasks([]);
                setPopupType("");
                setPopupMessage("");
              }}
              className={`w-full py-2 rounded-md font-semibold ${popupType === "success" ? "bg-green-600" : "bg-red-600"}`}
            >
              OK
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;