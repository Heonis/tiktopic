import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import TikAPI from 'tikapi';

const api = TikAPI("9TaHGfvrpNalxSaMi9Ebjn5NyMLpZ01gJUP1116DATpSpvub");
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'src/frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/frontend', 'index.html'));
});

app.get('/search-tiktoker', async (req, res) => {
  const username = req.query.username;
  try {
    console.log(`Searching for TikToker: ${username}`);
    const response = await api.public.check({ username });
    console.log('TikAPI response:', response);
    if (response.json && response.json.userInfo) {
      res.json(response.json.userInfo);
    } else {
      throw new Error('No userInfo in response');
    }
  } catch (error) {
    console.error('Error fetching TikToker data:', error);
    res.status(500).json({ error: 'Failed to fetch TikToker data' });
  }
});

app.get('/search-music', async (req, res) => {
    const musicId = req.query.musicId;
    try {
      console.log(`Searching for Music: ${musicId}`);
      const response = await api.public.musicInfo({ id: musicId });
      console.log('TikAPI response:', response);
      if (response.json && response.json.musicInfo) {
        res.json(response.json.musicInfo);
      } else {
        throw new Error('No music info in response');
      }
    } catch (error) {
      console.error('Error fetching music data:', error);
      res.status(500).json({ error: 'Failed to fetch music data' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
