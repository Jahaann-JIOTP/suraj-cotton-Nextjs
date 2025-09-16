import { toast } from "react-toastify";
import config from "../../config";
import Image from 'next/image';

const DeleteModal = ({ isOpen, onClose, onDelete, alarmData, type }) => {
  const handleDelete = async () => {
    try {
      let url;
      let requestBody;

      // Determine the URL and request body based on type
      if (String(type) === "1") {
        url = `${config.BASE_URL}/alarms/delete-types-alarms`;
        requestBody = { typeId: alarmData._id }; // For type 1: _id
      } else if (String(type) === "2") {
        url = `${config.BASE_URL}/alarms/delete-alarm-config`;
        requestBody = { alarmConfigId: alarmData._id }; // For type 2: alarmConfigId
      } else {
        throw new Error("Unsupported delete type");
      }

      // Check if _id is available in alarmData
      if (!alarmData?._id) throw new Error("Missing alarm _id");

      // Send the DELETE request to the backend
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

     // Handle response error
if (!response.ok) {
  let errorMessage = "Failed to delete alarm";

  try {
    const errorData = await response.json();

    if (errorData.message && errorData.alarms) {
      // Case 1: AlarmType delete (type 1)
      errorMessage = `${errorData.message} Related alarms: ${errorData.alarms.join(", ")}`;
    } else if (errorData.message) {
      // Case 2: AlarmConfig delete (type 2)
      errorMessage = errorData.message;
    }
  } catch {
    // fallback if response is plain text
    const text = await response.text();
    errorMessage = text || errorMessage;
  }
toast.error(errorMessage, {
  autoClose: false,     // stay until user closes
  closeOnClick: true,   // allow user to click to close
  closeButton: true,    // show close (x) button
  draggable: true,      // optional, allow drag to dismiss
  style: { zIndex: 9999 },
});

  throw new Error(errorMessage);
}


      // Successful deletion message
      const data = await response.json();
      toast.success(data.message || "Alarm deleted successfully", {
        // position: "top-center",
        style: {
          position: "fixed",
          // top: "50%",
          // left: "50%",
          // transform: "translate(-50%, -50%)",
          zIndex: 9999,
        },
      });

      // Notify parent and close modal
      onDelete(); // Refresh data
      onClose();  // Close the modal
    } catch (err) {
      console.error("Error deleting alarm:", err);
      // Optionally, handle the error here, e.g., display toast or alert
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.45)] backdrop-blur-[1px] flex items-center justify-center p-4 z-50">
          <div className="bg-white border-t-4 border-t-[#1d5999] rounded-lg shadow-lg w-[40vh] text-center dark:bg-gray-700">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 mt-5 bg-red-100 rounded-full flex items-center justify-center">
                <Image src="/delete_icon.png" alt="Delete Icon" width={15} height={15} />
              </div>
            </div>
            <h2 className="text-lg font-semibold text-[black] mb-2 dark:text-white !font-[Poppins]">
              Warning!
            </h2>
            <p className="text-sm text-[black] dark:text-white mb-6 px-[20px] !font-[Poppins]">
              Are you sure you want to delete
              <br />
              this alarm level? This action
              <br /> cannot be undone.
            </p>
            <div className="flex border-t border-gray-300">
              <button
                onClick={onClose}
                className="w-1/2 py-2 text-blue-600 dark:text-white cursor-pointer dark:hover:bg-gray-600 font-medium hover:rounded-bl-lg hover:bg-gray-100 focus:outline-none !font-[Poppins]"
              >
                Cancel
              </button>
              <div className="w-px bg-gray-300" />
              <button
                onClick={handleDelete}
                className="w-1/2 py-2 text-red-600 cursor-pointer dark:hover:bg-gray-600 font-medium hover:rounded-br-lg hover:bg-gray-100 focus:outline-none !font-[Poppins]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteModal;
