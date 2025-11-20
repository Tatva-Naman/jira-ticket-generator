interface Props {
    type: "success" | "error" | "";
    message: string;
    onClose: () => void;
  }
  
  export default function Popup({ type, message, onClose }: Props) {
    if (!type) return null;
  
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-[#0F223A] p-6 rounded-lg w-auto space-y-4 border border-gray-700">
          <h2 className="text-xl font-semibold">
            {type === "success" ? "Success" : "Summary"}
          </h2>
  
          <div className="max-h-80 overflow-auto pr-3 thin-scrollbar">
            <div
              className="whitespace-pre-wrap text-sm"
              dangerouslySetInnerHTML={{ __html: message }}
            />
          </div>
  
          <button
            onClick={onClose}
            className={`w-full py-2 rounded-md font-semibold ${
              type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            OK
          </button>
        </div>
      </div>
    );
  }
  