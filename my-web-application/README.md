# My Web Application
## Project Setup
To get started with the project, follow these steps:
1. **Clone the Repository:**
   ```sh
   git clone <repository-url>
   cd my-web-application

2. **Install server-side dependencies:**

   bash
   Copy code
   npm install

3. **Set up TikAPI key:**

   Replace YOUR_TIKAPI_KEY_HERE in server.js with your actual TikAPI key. There is one already provided in this example code, but in case another is needed, you can just request it for free on https://tikapi.io/

4. **Start the server:**

   bash
   Copy code
   npm start
   The server will start on port 3000 by default.

   Usage
   Navigate to the application:

   Open your browser and go to http://localhost:3000.

   Sign In:

   Fill out the sign-in form with your first name, last name, username, and profile picture to create a user profile.

   View Profiles:

   Navigate between different views (Home, User Stats, Music Stats, Hashtag Stats) using the navigation buttons.

   Search TikTok Data:

   Use the search functionality to fetch and display TikTok user, music, and hashtag statistics.

   API Endpoints
   The server exposes the following RESTful endpoints:

   POST /tiktok-users: Create a new user profile.
   GET /tiktok-users: Retrieve all user profiles.
   PUT /tiktok-users/
   : Update an existing user profile by ID.
   DELETE /tiktok-users/
   : Delete a user profile by ID.
   GET /search-tiktoker: Fetch TikTok user data by username.
   GET /search-music: Fetch TikTok music data by music ID.
   GET /search-hashtag: Fetch TikTok hashtag data by name.
   Client-side Functionality
   The client-side code in main.js interacts with the server-side endpoints to perform CRUD operations and fetch TikTok data. It handles:

   Creating a user profile: Submitting the sign-in form sends a POST request to /tiktok-users.
   Viewing user profiles: The user profile is displayed dynamically after sign-in.
   Updating a user profile: Not explicitly shown in the example but would involve sending a PUT request to /tiktok-users/:id.
   Deleting a user profile: Clicking the delete button sends a DELETE request to /tiktok-users/:id.
   Fetching TikTok data: Using search functionality to send GET requests to /search-tiktoker, /search-music, and /search-hashtag.
   Folder Structure
   src/frontend: Contains the client-side code including HTML, CSS, and JavaScript files.
   server.js: The main server-side file that sets up the Express server and routes.