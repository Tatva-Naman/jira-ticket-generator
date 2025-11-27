import { Story, SubTaskType } from "../../types";

interface Props {
  stories: Story[];
  updateStoryType: (id: number, type: SubTaskType) => void;
  removeStory: (id: number) => void;
}

export default function StoryList({ stories, updateStoryType, removeStory }: Props) {
  return (
    <>
      <h2 className="text-xl font-semibold">Story List</h2>
      <div className="space-y-4">
        {stories.map((s) => (
          <div
            key={s.id}
            className="bg-[#0F223A] p-4 rounded-md flex justify-between items-center"
          >
            <span>{s.text}</span>

            <div className="flex gap-3 text-sm">
              {Object.values(SubTaskType).map((type) => (
                <label key={type} className="flex gap-1">
                  <input
                    type="radio"
                    checked={s.type === type}
                    onChange={() => updateStoryType(s.id, type)}
                  />
                  {type}
                </label>
              ))}

              <button onClick={() => removeStory(s.id)} className="rounded-md">
                ❌
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
