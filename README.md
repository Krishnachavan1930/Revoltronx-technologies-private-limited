Set up a new Node.js project and install necessary dependencies:
npm init -y
npm install express axios cors react react-dom

Set up the project:
mkdir search-function
cd search-function
npm init -y

Install backend dependencies:
npm install express axios cors dotenv @types/express @types/cors typescript ts-node

Install frontend dependencies and set up Next.js:
npx create-next-app@latest frontend
cd frontend
npm install axios

Create a `.env` file in the root directory and add your API keys:
YOUTUBE_API_KEY=your_youtube_api_key
GOOGLE_SEARCH_API_KEY=your_google_search_api_key
GOOGLE_SEARCH_ENGINE_ID=your_google_search_engine_id

Create a `tsconfig.json` file in the root directory:
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["server.ts"],
  "exclude": ["node_modules"]
}

Install `concurrently` to run both servers simultaneously:
npm install concurrently

Run the project:
npm run dev

