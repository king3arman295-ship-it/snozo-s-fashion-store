import { useEffect, useState } from "react"
import axios from "axios"

const BASE = "http://localhost:5000/api/chat"

export default function UserChatBox({ userId }) {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState("")

  const fetchChat = async () => {
    const res = await axios.get(`${BASE}/${userId}`)
    setMessages(res.data)
  }

  useEffect(() => {
    fetchChat()
  }, [])

  const sendMessage = async () => {
    if (!text.trim()) return

    await axios.post(BASE, {
      sender: "user",
      userId,
      message: text
    })

    setText("")
    fetchChat()
  }

  return (
    <div className="bg-gray-900 p-4 rounded text-white w-96">

      <h2 className="text-xl mb-2">Chat with Admin</h2>

      <div className="h-64 overflow-y-auto bg-black p-2 mb-2">
        {messages.map((m) => (
          <div
            key={m._id}
            className={`mb-2 ${
              m.sender === "admin" ? "text-green-400" : "text-blue-400"
            }`}
          >
            <b>{m.sender}:</b> {m.message}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 p-2 text-black"
          placeholder="Type message..."
        />

        <button
          onClick={sendMessage}
          className="bg-white text-black px-3"
        >
          Send
        </button>
      </div>
    </div>
  )
}