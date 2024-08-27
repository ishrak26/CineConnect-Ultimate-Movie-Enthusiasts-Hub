// import useGetConversations from "../../hooks/useGetConversations";
import { getRandomEmoji } from '../../utils/emojis'
import Conversation from './Conversation'
// import { use } from 'react'
import { useEffect, useState } from 'react'

const Conversations = ({ user }) => {
  //   const { loading, conversations } = useGetConversations()

  const [conversations, setConversations] = useState([])

  useEffect(() => {
    const getConversions = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/chat/users`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      )

      const data = await response.json()
      // console.log(data)
      setConversations(data)
    }
    // console.log('user', user)
    getConversions()
  }, [])

  return (
    <div className="py-2 flex flex-col overflow-auto">
      {user && (
        <Conversation
          key={user.id}
          conversation={user}
          emoji={getRandomEmoji()}
        />
      )}

      {conversations.map((conversation, idx) =>
        conversation.userId !== user?.userId ? (
          <Conversation
            key={conversation.userId}
            conversation={conversation}
            emoji={getRandomEmoji()}
            lastIdx={idx === conversations.length - 1}
          />
        ) : null
      )}

      {/* {loading ? (
        <span className="loading loading-spinner mx-auto"></span>
      ) : null} */}
    </div>
  )
}
export default Conversations
