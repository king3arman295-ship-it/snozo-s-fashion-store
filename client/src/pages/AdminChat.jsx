import { useEffect, useState } from "react"
import axios from "axios"

const BASE = "http://localhost:5000/api/chat"

export default function AdminChat() {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState("")
  const [messages, setMessages] = useState([])
  const [text, setText] = useState("")

  // get all chats → extract unique users
  const fetchUsers = async () => {
    const res = await axios.get(BASE + "/all-users")
    setUsers(res.data)
  }

  const fetchChat = async (userId) => {
    const res = await axios.get(`${BASE}/${userId}`)
    setMessages(res.data)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const sendMessage = async () => {
    if (!text.trim()) return

    await axios.post(BASE, {
      sender: "admin",
      userId: selectedUser,
      message: text
    })

    setText("")
    fetchChat(selectedUser)
  }

  return (
    <div className="flex gap-5">

      {/* USERS */}
      <div className="w-1/4 bg-gray-900 p-3">
        <h2 className="text-white mb-2">Users</h2>

        {users.map((u) => (
          <div
            key={u}
            onClick={() => {
              setSelectedUser(u)
              fetchChat(u)
            }}
            className="text-white cursor-pointer p-2 bg-black mb-2"
          >
            {u}
          </div>
        ))}
      </div>

      {/* CHAT BOX */}
      <div className="flex-1 bg-gray-800 p-3">

        <div className="h-96 overflow-y-auto bg-black p-2 mb-2">
          {messages.map((m) => (
            <div
              key={m._id}
              className={`mb-2 ${
                m.sender === "admin"
                  ? "text-green-400"
                  : "text-blue-400"
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
          />

          <button
            onClick={sendMessage}
            className="bg-white text-black px-3"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  )
}