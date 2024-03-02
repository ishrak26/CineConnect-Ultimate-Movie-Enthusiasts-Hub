import { useEffect, useState } from 'react'
import useConversation from '../zustand/useConversation'
import toast from 'react-hot-toast'

const useGetMessages = () => {
  const [loading, setLoading] = useState(false)
  const { messages, setMessages, selectedConversation } = useConversation()

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `http://localhost:4000/v1/chat/${selectedConversation.userId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          }
        )
        const data = await res.json()
        if (data.error) throw new Error(data.error)
        setMessages(data)
      } catch (error) {
        toast.error(error.message)
      } finally {
        setLoading(false)
      }
    }

    if (selectedConversation?.userId) getMessages()
  }, [selectedConversation?.userId, setMessages])

  return { messages, loading }
}
export default useGetMessages
