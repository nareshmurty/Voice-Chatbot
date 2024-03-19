import "./App.css"
import { Container } from "@mui/material"
import ChatHeader from "./Components/ChatHeader"
import { useState } from "react"
import ChatMessages from "./Components/ChatMessages"
import MessageInput from "./Components/MessageInput"
import { useTheme } from "@emotion/react"
import ThinkingBubble from "./Components/ThinkingBubble"
import axios from "axios"

import AudioControl from "./Components/AudioControl"
import ResponseFormatToggle from "./Components/ResponseFormatToggle"

function App() {
  const [isAudioResponse, setIsAudioResponse] = useState(false)
  const theme = useTheme()

  const mockMessages = [
    {
      role: "assistant",
      content: "Hello, how can I help you today?",
      text: "Hello, how can I help you today?",
    },
  ]
  const [messages, setMessages] = useState(mockMessages)
  const [message, setMessage] = useState("")
  const filterMessageObjects = (list) => {
    return list.map(({ role, content }) => ({ role, content }))
  }
  const handleSendMessage = async () => {
    if (message.trim() !== "") {
      // Send the message to the chat

      // Add the new message to the chat area
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", content: message, text: message, audio: null },
      ])

      // Clear the input field
      setMessage("")

      // Add thinking bubble
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: (
            <ThinkingBubble theme={theme} sx={{ marginBottom: "-5px" }} />
          ),
          text: <ThinkingBubble theme={theme} sx={{ marginBottom: "-5px" }} />,
          key: "thinking",
        },
      ])

      // Create backend chat input
      let messageObjects = filterMessageObjects(messages)
      messageObjects.push({ role: "user", content: message })

      // Create endpoint for just getting the completion
      try {
        // Send the text message to the backend
        const response = await axios.post("api", "/get-answer", {
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            text: message,
            messages: messageObjects,
            isAudioResponse,
          },
        })

        // Remove the thinking bubble
        setMessages((prevMessages) => {
          return prevMessages.filter((message) => message.key !== "thinking")
        })
      } catch (error) {
        console.error("Error sending text message:", error)
        alert(error)
      }
    }
  }

  return (
    <Container maxWidth="sm" sx={{ pt: 2 }}>
      <ChatHeader />
      <ChatMessages messages={messages} />
      <AudioControl
        isAudioResponse={isAudioResponse}
        filterMessageObjects={filterMessageObjects}
        messages={messages}
        setMessages={setMessages}
      />
      <MessageInput
        message={message}
        setMessage={setMessage}
        isAudioResponse={isAudioResponse}
        handleSendMessage={handleSendMessage}
      />

      <ResponseFormatToggle
        isAudioResponse={isAudioResponse}
        setIsAudioResponse={setIsAudioResponse}
      />
    </Container>
  )
}

export default App
