import { useEffect, useState } from 'react'
import useConversation from '../zustand/useConversation'

const useListenMessages = () => {
  const [lastFetch, setLastFetch] = useState(Date.now())
  const { messages, setMessages, selectedConversation } = useConversation()

  const fetchMessages = async () => {
    try {
      // Assuming the API can filter messages newer than a certain timestamp
      const response = await fetch(
        `http://localhost:4000/v1/chat/new/${selectedConversation.userId}?afterTime=${lastFetch}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch messages')
      }

      const newMessages = await response.json()

      // Update the state only if there are new messages to prevent unnecessary re-renders
      if (newMessages.length > 0) {
        const sound = new Audio('/notification.mp3')
        sound.play() // Play notification sound for new messages
        setMessages((currentMessages) => [...currentMessages, ...newMessages])
        setLastFetch(Date.now()) // Update the last fetch timestamp to the current time
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  useEffect(() => {
    const intervalId = setInterval(fetchMessages, 5000) // Poll every 5 seconds

    return () => clearInterval(intervalId) // Clean up interval on component unmount
  }, [selectedConversation, lastFetch, setMessages])
}
export default useListenMessages
