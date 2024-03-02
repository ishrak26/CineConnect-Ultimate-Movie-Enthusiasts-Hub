// import useGetConversations from "../../hooks/useGetConversations";
import { getRandomEmoji } from '../../utils/emojis'
import Conversation from './Conversation'
import { useEffect, useState } from 'react'

const Conversations = () => {
  //   const { loading, conversations } = useGetConversations()

  const [conversations, setConversations] = useState([])

  useEffect(() => {
    const getConversions = async () => {
      const response = await fetch(`http://localhost:4000/v1/chat/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      const data = await response.json()
      console.log(data)
      setConversations(data)
    }

    getConversions()
  }, [])

  return (
    <div className="py-2 flex flex-col overflow-auto">
      {conversations.map((conversation, idx) => (
        <Conversation
          key={conversation.userId}
          conversation={conversation}
          emoji={getRandomEmoji()}
          lastIdx={idx === conversations.length - 1}
        />
      ))}

      {/* {loading ? (
        <span className="loading loading-spinner mx-auto"></span>
      ) : null} */}
    </div>
  )
}
export default Conversations
