/*
    1. Module Imports:
        - Imports necessary modules such as `express` for creating the server, `path` for handling file paths, and `TikAPI` for interacting with the TikTok API.
        - Initializes the TikAPI with the provided API key.
        - Sets up middleware to serve static files from the `src/frontend` directory.

    4. Route Definitions:
        - GET `/`: Serves the main `index.html` file for the web application.
        - GET `/search-tiktoker`: Handles requests to search for a TikTok user by username. Fetches user data from the TikAPI and returns it as a JSON response.
        - GET `/search-music`: Handles requests to search for TikTok music by music ID. Fetches music data from the TikAPI and returns it as a JSON response.
        - GET `/search-hashtag`: Handles requests to search for a TikTok hashtag by name. Fetches hashtag data from the TikAPI and returns it as a JSON response.

    5. Error Handling:
        - Catches and logs errors that occur during API requests and sends a 500 status code with an error message in the response.

    6. Server Initialization:
        - Starts the server on the specified port (default is 3000) and logs a message indicating that the server is running.
*/

// Importing required modules
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import TikAPI from 'tikapi';
import PouchDB from 'pouchdb';


// Initialize PouchDB and TikAPI
const db = new PouchDB('tiktok-users');
const api = TikAPI("9TaHGfvrpNalxSaMi9Ebjn5NyMLpZ01gJUP1116DATpSpvub");

// Creating an instance of an Express application
const app = express();
app.use(express.json());

// Getting the current file's name and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serving static files from the 'src/frontend' directory
app.use(express.static(path.join(__dirname, 'src/frontend')));

// Handling GET request for the root URL and sending 'index.html' as the response
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/frontend', 'index.html'));
});


// Handling GET request for '/search-tiktoker' endpoint
app.get('/search-tiktoker', async (req, res) => {
  const username = req.query.username; // Getting the username from query parameters
  try {
    console.log(`Searching for TikToker: ${username}`); // Logging the username
    const response = await api.public.check({ username }); // Fetching TikToker data from TikAPI
    console.log('TikAPI response:', response); // Logging the API response
    if (response.json && response.json.userInfo) {
      res.json(response.json.userInfo); // Sending the user information as the response
    } else {
      throw new Error('No userInfo in response'); // Throwing an error if no user information is found
    }
  } catch (error) {
    console.error('Error fetching TikToker data:', error); // Logging the error
    res.status(500).json({ error: 'Failed to fetch TikToker data' }); // Sending error response with status 500
  }
});

// Handling GET request for '/search-music' endpoint
app.get('/search-music', async (req, res) => {
  const musicId = req.query.musicId; // Getting the music ID from query parameters
  try {
    console.log(`Searching for Music: ${musicId}`); // Logging the music ID
    const response = await api.public.musicInfo({ id: musicId }); // Fetching music data from TikAPI
    console.log('TikAPI response:', response); // Logging the API response
    if (response.json && response.json.musicInfo) {
      res.json(response.json.musicInfo); // Sending the music information as the response
    } else {
      throw new Error('No music info in response'); // Throwing an error if no music information is found
    }
  } catch (error) {
    console.error('Error fetching music data:', error); // Logging the error
    res.status(500).json({ error: 'Failed to fetch music data' }); // Sending error response with status 500
  }
});

// Handling GET request for '/search-hashtag' endpoint
app.get('/search-hashtag', async (req, res) => {
  const hashtag = req.query.hashtag; // Getting the hashtag from query parameters
  try {
    console.log(`Searching for Hashtag: ${hashtag}`); // Logging the hashtag
    const response = await api.public.hashtag({ name: hashtag }); // Fetching hashtag data from TikAPI
    console.log('TikAPI response:', response.json); // Logging the API response
    if (response.json && response.json.challengeInfo) {
      res.json(response.json); // Sending the hashtag information as the response
    } else {
      throw new Error('No hashtag info in response'); // Throwing an error if no hashtag information is found
    }
  } catch (error) {
    console.error('Error fetching hashtag data:', error); // Logging the error
    res.status(500).json({ error: 'Failed to fetch hashtag data' }); // Sending error response with status 500
  }
});


// Create (POST): Add a new user profile
app.post('/tiktok-users', async (req, res) => {
  try {
    const userProfile = req.body;
    const response = await db.post(userProfile);
    console.log("Tiktok user created and stored in the server")
    res.status(201).json({ message: 'User profile created', response });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user profile' });
  }
});

// Read (GET): Retrieve all user profiles or a single user profile by ID
app.get('/tiktok-users', async (req, res) => {
  try {
    const result = await db.allDocs({ include_docs: true });
    res.json(result.rows.map(row => row.doc));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profiles' });
  }
});

// Update (PUT): Modify an existing user profile by ID
app.put('/tiktok-users/:id', async (req, res) => {
  try {
    const userProfile = await db.get(req.params.id);
    const updatedUserProfile = { ...userProfile, ...req.body };
    const response = await db.put(updatedUserProfile);
    console.log("Tiktok user modified and stored in the server")
    res.json({ message: 'User profile updated', response });
  } catch (error) {
    res.status(404).json({ error: 'User profile not found' });
  }
});

// Delete (DELETE): Remove a user profile by ID
app.delete('/tiktok-users/:id', async (req, res) => {
  try {
    const userProfile = await db.get(req.params.id);
    const response = await db.remove(userProfile);
    console.log("Tiktok user deleted and removed from the server")
    res.json({ message: 'User profile deleted', response });
  } catch (error) {
    res.status(404).json({ error: 'User profile not found' });
  }
});

// Starting the server on a specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // Logging the port number
});
