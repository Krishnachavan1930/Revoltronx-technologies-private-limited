import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const GOOGLE_SEARCH_API_KEY = process.env.GOOGLE_SEARCH_API_KEY;
const GOOGLE_SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID;

interface YouTubeResult {
  type: 'youtube';
  title: string;
  link: string;
  views: number;
  likes: number;
}

interface WebResult {
  type: 'web';
  title: string;
  link: string;
  snippet: string;
}

type SearchResult = YouTubeResult | WebResult;

async function searchYouTube(query: string): Promise<YouTubeResult[]> {
  const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
    params: {
      part: 'snippet',
      q: query,
      type: 'video',
      key: YOUTUBE_API_KEY,
    },
  });

  return response.data.items.map((item: any) => ({
    type: 'youtube',
    title: item.snippet.title,
    link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    views: 0, // You would need to make an additional API call to get view count
    likes: 0, // Same for likes
  }));
}

async function searchGoogle(query: string): Promise<WebResult[]> {
  const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
    params: {
      q: query,
      key: GOOGLE_SEARCH_API_KEY,
      cx: GOOGLE_SEARCH_ENGINE_ID,
    },
  });

  return response.data.items.map((item: any) => ({
    type: 'web',
    title: item.title,
    link: item.link,
    snippet: item.snippet,
  }));
}

app.post('/search', async (req, res) => {
  try {
    const { query } = req.body;
    const youtubeResults = await searchYouTube(query);
    const webResults = await searchGoogle(query);
    
    const allResults: SearchResult[] = [...youtubeResults, ...webResults];
    
    // Simple ranking based on result order (you'd want a more sophisticated ranking in a real app)
    const rankedResults = allResults.sort((a, b) => {
      if (a.type === 'youtube' && b.type !== 'youtube') return -1;
      if (a.type !== 'youtube' && b.type === 'youtube') return 1;
      return 0;
    });
    
    res.json(rankedResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while searching' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));