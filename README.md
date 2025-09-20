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
