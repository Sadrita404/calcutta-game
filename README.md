# Calcutta-Guesser

A mobile-friendly web game in two parts. Game 1 (Calcutta-Guesser): look at a photo of a Kolkata landmark, pick the right name from 3 options, and earn 10 Rasogollas per correct answer (100 max). Game 2 (Calcutta-Quiz): 6 Kolkata questions + 4 food pictures, 100 more Rasogollas. Game 3 (Rasogolla Catcher): an arcade game - drag the bowl to catch 50 falling Rasogollas (+2 each, 100 max), dodge chillies and burnt sweets (3 hearts). Finish with a downloadable score picture out of 300.

## Run the game (frontend only - this is all you need to play)
Requires Node.js 18+ and Yarn (or npm).

    cd frontend
    yarn install        # or: npm install
    yarn dev            # or: npm run dev

Open http://localhost:3000

Build a static website you can upload to any host (Netlify, Vercel, GitHub Pages):

    yarn build          # output is in frontend/dist

## Where things are
- frontend/src/pages/Home.tsx      - the game screens (welcome, rounds, results)
- frontend/src/data/landmarks.ts   - the 10 landmarks, answer options and image paths
- frontend/src/data/quiz.ts        - the Calcutta-Quiz questions and food pictures
- frontend/src/components/         - QuizGame, RasogollaCatcher, FinalScore (score card + download), AnswerOptions
- frontend/src/data/catcher.ts     - Rasogolla Catcher settings (sweets per game, points, hearts)
- frontend/src/lib/catcherDraw.ts  - drawing of the bowl, chili and burnt sweet
- frontend/public/food/            - the 4 food photos
- frontend/public/landmarks/       - your landmark photos and the Rasogolla icon
- frontend/src/index.css           - colours, fonts and responsive layout

To change a photo, replace the file in frontend/public/landmarks/ with the same name.

## Optional backend
backend/ is a FastAPI + MongoDB server from the starter template. The game does not need it.
To run it: copy backend/.env.example to backend/.env, then
    pip install -r backend/requirements.txt
    cd backend && uvicorn server:app --port 8001
