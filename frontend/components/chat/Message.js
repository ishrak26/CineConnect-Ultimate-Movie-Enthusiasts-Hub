import { extractTime } from '../../utils/extractTime'
import useConversation from '../../zustand/useConversation'

const Message = ({ message, user }) => {
  // const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation()
  const fromMe = message.senderId === user.user.id
  const formattedTime = extractTime(message.createdAt)
  const chatClassName = fromMe ? 'chat-end' : 'chat-start'
  const profilePic = fromMe
    ? user.user.image_url
    : selectedConversation?.imageUrl
  const bubbleBgColor = fromMe ? 'bg-primary-600' : 'bg-gray-600'

  const shakeClass = message.shouldShake ? 'shake' : ''

  console.log(user)

  return (
    <div className={`flex items-end ${fromMe ? 'flex-row-reverse' : ''} gap-2`}>
      <div className="w-10 h-10 rounded-full overflow-hidden">
        <img
          alt="Chat avatar"
          src={profilePic}
          className="w-full h-full object-cover"
        />
      </div>
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg p-3 my-1 rounded-lg ${
          fromMe ? 'bg-primary-600' : 'bg-gray-700'
        } ${fromMe ? 'text-black-100' : 'text-white'} ${shakeClass}`}
      >
        {message.content}
      </div>
      <div className="text-xs opacity-50">{formattedTime}</div>
    </div>
  )
}

export default Message
