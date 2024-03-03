// import { useSocketContext } from "../../context/SocketContext";
import useConversation from '../../zustand/useConversation'

const Conversation = ({ conversation, lastIdx, emoji }) => {
  const { selectedConversation, setSelectedConversation } = useConversation()

  const isSelected = selectedConversation?.userId === conversation.userId
  // const { onlineUsers } = useSocketContext();
  // const onlineUsers = []
  // const isOnline = onlineUsers.includes(conversation.userId)
  const isOnline = false

  return (
    <>
      <div
        className={`flex gap-2 items-center hover:bg-primary-700 rounded p-2 py-1 cursor-pointer
				${isSelected ? 'bg-primary-600' : 'bg-gray-800'}
			`}
        onClick={() => setSelectedConversation(conversation)}
      >
        <div className={`avatar ${isOnline ? 'online' : ''}`}>
          <div className="w-12 rounded-full">
            <img src={conversation.imageUrl} alt="user avatar" />
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <div className="flex gap-3 justify-between">
            <div className="flex flex-col">
              <div className="text-xl text-white-100 font-medium my-2">
                {conversation.fullname}
              </div>
              <div>
                <p className="text-base text-white-75">
                  {conversation.username}
                </p>
              </div>
            </div>
            <span className="text-xl">{emoji}</span>
          </div>
        </div>
      </div>

      {!lastIdx && <div className="divider my-0 py-0 h-1" />}
    </>
  )
}
export default Conversation
