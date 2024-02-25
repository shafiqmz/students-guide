import axios from 'axios';

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function fetchPlaylistsForKeyword(keyword, totalResults) {
  try {
    const params = {
      part: 'snippet',
      order: 'rating',
      q: keyword,
      type: 'playlist',
      key: process.env.YOUTUBE_API_KEY,
      maxResults: totalResults || 20,
      chart: "mostPopular",
      safeSearch: "strict",
      relevanceLanguage: "en", 
    };

    const headers = {
      Accept: 'application/json',
    };

    const response = await axios.get('https://youtube.googleapis.com/youtube/v3/search', {
      params: params,
      headers: headers,
    });

    return response.data.items;
  } catch (error) {
    console.error(`Error fetching playlists:`, error);
    return [];
  }
}

export default async function fetchPlaylistsForInterests(interests) {
  const playlists = [];

  for (const keyword of interests) {
    const keywordPlaylists = await fetchPlaylistsForKeyword(keyword, 5);
    playlists.push(...keywordPlaylists);
  }

  shuffleArray(playlists);

  return playlists;
}
