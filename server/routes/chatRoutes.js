const express = require("express")
const router = express.Router()
const Chat = require("../models/Chat")

// Get all messages for a user
router.get("/:userId", async (req, res) => {
  const messages = await Chat.find({ userId: req.params.userId }).sort({ createdAt: 1 })
  res.json(messages)
})

// Send message
router.post("/", async (req, res) => {
  const { sender, userId, message } = req.body

  const msg = new Chat({
    sender,
    userId,
    message
  })

  await msg.save()
  res.json(msg)
})

module.exports = router