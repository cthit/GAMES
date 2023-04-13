# Game Access Membership and Exchange Service (GAMES)  
A service for finding and browsing games in different mediums and formats.


## Requirements
* Nodejs
* pnpm

## Installation
First you need to install Nodejs by downloading it from their website: https://nodejs.org/en/download/ or by using your package manager of choice.

Then you need to install pnpm by running ```npm install -g pnpm```

## Running frontend
From the root of the the project run ```cd frontend``` to enter the frontend directory. 
Then simply run ```pnpm install``` followed by ```pnpm run dev```
You can now access the frontend at http://localhost:3000

## Running backend
You need to have two active terminals for this
But first you need to create a .env file in the backend directory. Do this by copying the .env.example file and renaming it to .env

### Terminal no. 1
From the root of the the project run ```cd backend``` to enter the backend directory. 
Then simply run ```pnpm install``` followed by ```pnpm run compile```

### Terminal no. 2
From the root of the the project run ```cd backend``` to enter the backend directory.
Then simply run ```pnpm run watch```
