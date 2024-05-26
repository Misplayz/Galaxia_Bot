const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const spotify_client_id = process.env.spotifyClientId;
const spotify_client_secret = process.env.spotifyClientSecret;


async function getAccessToken() {
    try {
        if (!spotify_client_id || !spotify_client_secret) {
            throw new Error('Spotify client ID or secret is not set');
        }

        const base64EncodedCredentials = Buffer.from(`${spotify_client_id}:${spotify_client_secret}`).toString('base64');
        const response = await axios.post('https://accounts.spotify.com/api/token', 
        new URLSearchParams({
            grant_type: 'client_credentials'
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${base64EncodedCredentials}`
            }
        });

        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching Spotify Access Token:', error.response ? error.response.data : error.message);
        throw new Error('Error fetching Spotify Access Token');
    }
}

module.exports = getAccessToken;