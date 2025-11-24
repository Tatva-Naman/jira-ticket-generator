import { useRef, useState } from "react";

import AddStory from "../components/StoryPoints/AddStory";
import Popup from "../components/Popup";
import Loader from "../components/Loader";

import { Story, SubTaskType } from "../types";
import StoryList from "../components/StoryPoints/StoryList";

export default function SubtaskCreator() {

    const [stories, setStories] = useState<Story[]>([]);

    const [addErrorMessage, setAddErrorMessage] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const [popupMessage, setPopupMessage] = useState("");
    const [popupType, setPopupType] =
        useState<"success" | "error" | "">("");

    const inputRef = useRef<HTMLInputElement>(null);

    const update_url = process.env.REACT_APP_UPDATE_API_URL || "";

    const addStory = () => {
        const value = inputRef.current?.value || "";

        setAddErrorMessage("");

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

    const updateStoryPoint = async (event: any) => {
        event.preventDefault();
        setAddErrorMessage("");
        setIsLoading(true);

        if (stories.length === 0) {
            setIsLoading(false);
            return;
        }

        const payload = stories.map(s => ({
            story_name: s.text,
            story_points: s.story_point ?? 0
        }));

        if(payload.some(p => p.story_points === 0)) {
            setPopupMessage("Please assign story points to all stories before updating.");
            setPopupType("error");
            setIsLoading(false);
            return;
        }

        console.log("Final Payload:", payload);

        try {
            const response = await fetch(update_url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const json_response = await response.json();

            let formatted = "";

            const updated = json_response.updated_stories || [];
            const failed = json_response.failed_stories || [];
    
            if (updated.length > 0 && failed.length === 0) {
                formatted += `Stories updated successfully:\n\n`;
                formatted += updated.map((s: string) => `• ${s}`).join("\n");
                setPopupType("success");
            }
            else if (updated.length > 0 && failed.length > 0) {
                formatted += `Stories updated successfully:\n\n`;
                formatted += updated.map((s: string) => `• ${s}`).join("\n");
    
                formatted += `\n\nError updating stories:\n\n`;
                formatted += failed.map((s: string) => `• ${s}`).join("\n");
    
                setPopupType("error");
            }
            else if (updated.length === 0 && failed.length > 0) {
                formatted += `Error updating stories:\n\n`;
                formatted += failed.map((s: string) => `• ${s}`).join("\n");
    
                setPopupType("error");
            }

            setPopupMessage(formatted);

        } catch (error) {
            setPopupMessage("An error occurred while updating story points.");
            setPopupType("error");
        } finally {
            setIsLoading(false);
        }
    };

    const removeStory = (id: number) => {
        setAddErrorMessage("");

        setStories((prev) => {
            const updated = prev.filter((s) => s.id !== id);
            return updated;
        });
    };

    const closePopup = () => {
        setStories([]);
        setPopupType("");
        setPopupMessage("");
    };

    const updateStoryPointValue = (id: number, points: number) => {

        setStories(prev =>
            prev.map(s =>
                s.id === id ? { ...s, story_point: points } : s
            )
        );
    };


    return (
        <div className="min-h-screen bg-[#0A1628] text-white p-10">
            <div className="max-w-4xl mx-auto bg-[#091422] p-6 rounded-xl shadow-lg space-y-6">

                <AddStory
                    inputRef={inputRef}
                    addStory={addStory}
                    error={addErrorMessage}
                />

                {stories.length > 0 && (
                    <>
                        <StoryList
                            stories={stories}
                            removeStory={removeStory}
                            updateStoryPoint={updateStoryPointValue}
                        />
                        <button
                            onClick={updateStoryPoint}
                            className="w-full bg-[#0FB1D3] py-4 font-semibold rounded-md text-lg"
                        >
                            Update
                        </button>
                    </>
                )}

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