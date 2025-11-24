import { PreviewItem } from "../../types";

interface Props {
  preview: PreviewItem[];
  generateSubtasks: (e: any) => void;
}

export default function PreviewList({ preview, generateSubtasks }: Props) {
  if (preview.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold">Subtasks</h2>

      <div className="space-y-4 h-60 overflow-auto thin-scrollbar my-4">
        {preview.map((item, idx) => (
          <div
            key={idx}
            className="bg-[#0F223A] p-3 rounded-md text-sm flex justify-between"
          >
            <span>{item.summary}</span>

            {item.exist ? (
              <span className="text-red-400">Exists</span>
            ) : (
              <span className="text-green-400">✔</span>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={generateSubtasks}
        className="w-full bg-[#0FB1D3] py-4 font-semibold rounded-md text-lg"
      >
        Generate
      </button>
    </div>
  );
}
