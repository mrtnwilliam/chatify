// import { XIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const isOnline = !!selectedUser && onlineUsers.includes(selectedUser._id);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedUser(null);
    }

    window.addEventListener("keydown", handleEscKey)

    // cleanup function
    return () => window.removeEventListener("keydown", handleEscKey)
  },[setSelectedUser])

  return (
    <div className="p-2.5 flex justify-between items-center bg-slate-800/50 border-b border-slate-700/50 min-h-[64px] px-4 sm:px-6 w-full">
      <div className="flex items-center gap-3 overflow-hidden flex-1">
        <div className={`avatar ${isOnline ? "online" : "offline"}`}>
          <div className="size-10 rounded-full relative">
            <img
              src={selectedUser?.profilePic || "/avatar.png"}
              alt={selectedUser?.fullName}
            />
          </div>
        </div>
        <div className="min-w-0">
          <h3 className="text-slate-200 font-medium truncate">{selectedUser?.fullName}</h3>
          <p className="text-slate-400 text-sm">{isOnline ? "Online" : "Offline"}</p>
        </div>
      </div>

      <button onClick={() => setSelectedUser(null)} className="flex-shrink-0 ml-2 text-white text-xl">
X
        {/* <XIcon className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"/> */}
      </button>
    </div>
  );
}

export default ChatHeader;
