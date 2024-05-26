const axios = require('axios');
const getAccessToken = require('./spotify_access');

async function searchSong(songInput) {
    try {
        const spotify_access_token = await getAccessToken();
        
        if (!songInput) {
            throw new Error('No search query');
        }

        const searchQuery = `q=${encodeURIComponent(songInput)}&type=track`;

        const response = await axios.get(`https://api.spotify.com/v1/search?${searchQuery}`, {
            headers: {
                'Authorization': `Bearer ${spotify_access_token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error searching song:', error.response?.data || error.message);
        throw new Error('Error searching song');
    }
}

module.exports = searchSong;
