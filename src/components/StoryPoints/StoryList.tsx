import { Story } from "../../types";

interface Props {
  stories: Story[];
  removeStory: (id: number) => void;
  updateStoryPoint: (id: number, points: number) => void;
}

export default function StoryList({  stories, removeStory, updateStoryPoint }: Props) {

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

            <div className="flex  gap-3 text-sm">
              <input
                min="1"
                type="number"
                placeholder="Story Points"
                className="flex-1 bg-[#000000] p-3 rounded-md text-gray-300"
                onChange={(e) => updateStoryPoint(s.id, Number(e.target.value))}
              />

              <button onClick={() => removeStory(s.id)} className="rounded-md">
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
