const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');

router.get('/history/:room', async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.room }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error("Error fetching history:", err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

router.post('/join', async (req, res) => {
  const { userId, room } = req.body; 
  
  if (!userId || !room) {
    return res.status(400).json({ msg: "Missing userId or room data" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (!user.joinedRooms.find(r => r.id === room.id)) {
      user.joinedRooms.push(room);
      await user.save();
    }
    res.json(user.joinedRooms);
  } catch (err) {
    console.error("Error joining room:", err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

router.get('/rooms/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (!user.joinedRooms || user.joinedRooms.length === 0) {
        return res.json([{ id: "General", name: "📢 General Announcements" }]);
    }
    res.json(user.joinedRooms);
  } catch (err) {
    console.error("Error fetching rooms:", err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

router.post('/leave', async (req, res) => {
    const { userId, roomId } = req.body;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }
      if (user.joinedRooms) {
        user.joinedRooms = user.joinedRooms.filter(r => r.id !== roomId);
        await user.save();
      }
      res.json(user.joinedRooms);
    } catch (err) {
      console.error("Error leaving room:", err);
      res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;