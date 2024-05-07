import express from 'express';
import mongoose from 'mongoose';
import ChatMessage from "./chatMessageModel.js"; 

const app = express();
const PORT = process.env.PORT || 3002; 

mongoose.connect('mongodb://localhost:27017/chatdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Anslutningsfel:'));
db.once('open', () => {
  console.log('Ansluten till databasen');
});

app.use(express.json());

app.post('/messages', async (req, res) => {
  const { text, user } = req.body;
  try {
    const newMessage = new ChatMessage({ text, user });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Fel vid hantering av meddelandet:', error);
    res.status(500).json({ error: 'Ett fel uppstod vid hantering av meddelandet' });
  }
});

app.get('/messages', async (req, res) => {
  try {
    const messages = await ChatMessage.find();
    res.json(messages);
  } catch (error) {
    console.error('Fel vid hämtning av meddelanden:', error);
    res.status(500).json({ error: 'Ett fel uppstod vid hämtning av meddelanden' });
  }
});

app.listen(PORT, () => {
  console.log(`Chattservern lyssnar på port ${PORT}`);
});