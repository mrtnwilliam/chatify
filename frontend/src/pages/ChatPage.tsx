import ActiveTabSwitch from "../components/ActiveTabSwitch";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ChatContainer from "../components/ChatContainer";
import ChatsList from "../components/ChatsList";
import ContactsList from "../components/ContactsList";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
import ProfileHeader from "../components/ProfileHeader";
import { useChatStore } from "../store/useChatStore";

function ChatPage() {

  const { activeTab, selectedUser } = useChatStore();

  return (
    <div className="relative w-full md:max-w-6xl h-[calc(100vh-8rem)] overflow-hidden">
      <BorderAnimatedContainer>
        {/* LEFT SIDE */}
        <div className={`w-80 bg-slate-800/50 backdrop-blur-sm ${selectedUser ? "hidden md:flex md:flex-col" : "flex flex-col"}`}>
          <ProfileHeader />
          <ActiveTabSwitch />

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activeTab === "chats" ? <ChatsList /> : <ContactsList />}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className={`${!selectedUser ? "hidden md:flex md:flex-col" : "flex flex-col"} flex-1 bg-slate-900/50 backdrop-blur-sm overflow-hidden`}>
          {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
        </div>
      </BorderAnimatedContainer>
    </div>
  )
}

export default ChatPage