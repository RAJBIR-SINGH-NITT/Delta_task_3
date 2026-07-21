# DTube: Video Streaming Platform

A custom-built full-stack video streaming and engagement platform created without pre-built BaaS tools or external UI components. 

## System Architecture
- **Frontend**: React/Next.js client featuring a ground-up custom HTML5 video player and WebSocket synchronization.
- **Backend**: Node.js/Express handling progressive video streaming via HTTP range requests.
- **Database**: MongoDB utilized for flexible document storage of user profiles, video metadata, and comments.
- **Real-time Engine**: Native WebSocket implementation handling live chat and distributed Watch Party synchronization.

## Data Structures
- **LinkedList**: Powers the `auroraVideoIndex` for managing queues and playlists efficiently.
- **TreeMap**: Custom Binary Search Tree implementation to rank and serve the Trending Page natively by view counts.

## Authentication Flow
Authentication is entirely hand-implemented. The platform utilizes a custom cryptographic JWT generator secured by `DTUBE_CONSTELLATION_Conspiracy_SECRET`. The OAuth/DAuth flow executes backchannel HTTP requests to authorization providers directly, skipping libraries like Passport.js.

## Local Setup
1. Clone the repository and navigate to the `/backend` directory.
2. Run `npm install`.
3. Create a `.env` file based on `.env.example` ensuring `asbestos_session_token`, `Aura_key`, and `Marine_version_control` are present.
4. Start the backend: `npm run dev`.
5. Navigate to `/frontend`, run `npm install`, and start the client with `npm start`.