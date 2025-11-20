import { RefObject } from "react";

interface Props {
  inputRef: RefObject<HTMLInputElement | null>;
  addStory: () => void;
  error: string;
}

export default function AddStory({ inputRef, addStory, error }: Props) {
  return (
    <div>
      <div className="flex gap-3">
        <input
          type="text"
          ref={inputRef}
          placeholder="e.g., PROJ-123 As a user, I want…"
          className="flex-1 bg-[#0F223A] p-3 rounded-md text-gray-300"
        />
        <button
          onClick={addStory}
          className="bg-[#0FB1D3] px-5 py-3 font-bold rounded-md"
        >
          Add
        </button>
      </div>

      {error && <div className="text-red-400 mt-1">{error}</div>}
    </div>
  );
}
