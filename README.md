# LingoLeap

![LingoLeap App Screenshot](readme_images/Screenshot%202025-09-20%20045206.png)

LingoLeap is a language learning app that helps you master new languages through flashcards, quizzes, and a little friendly competition.

## Features

- **Decks:** Create and manage decks of flashcards for different topics.
- **Quizzes:** Test your knowledge with interactive quizzes.
- **Leaderboard:** Compete with other users and climb the leaderboard.
- **Spaced Repetition:** LingoLeap uses a spaced repetition system to help you learn more efficiently.

## Tech Stack

- **Frontend:** React, React Router, Axios, Bootstrap
- **Backend:** Node.js, Express, SQLite, bcrypt, JWT

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/stanmouDev/lingoleap-app.git
   ```
2. Install NPM packages for the client
   ```sh
   cd client
   npm install
   ```
3. Install NPM packages for the server
   ```sh
   cd ../server
   npm install
   ```
4. Start the client
   ```sh
   cd ../client
   npm start
   ```
5. Start the server
   ```sh
   cd ../server
   node server.js
   ```

## How to Use LingoLeap

1.  **Register & Login:** Start by creating a new account or logging in if you already have one.
2.  **Create a Deck:** From the dashboard, create a new "deck." A deck is like a folder for a set of flashcards, e.g., "Spanish Food Vocabulary" or "Japanese Phrases."
3.  **Add Cards:** Click on a deck to open it, and then add new cards. Each card has a "front" (for the word/phrase you're learning) and a "back" (for the definition or translation).
4.  **Start a Quiz:** Once your deck has cards, you can start a quiz. LingoLeap will show you the front of a card and you'll have to recall the back.
5.  **Review Your Answers:** After you reveal the answer, rate how well you knew it. This rating tells the spaced repetition system when to show you the card again. Cards you know well will appear less often, while cards you struggle with will appear more frequently.
6.  **Track Your Progress:** Check the leaderboard to see how you rank against other learners based on the experience points you earn from studying