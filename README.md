https://github.com/user-attachments/assets/b653ddc2-82e7-4966-aaad-1ad045ba57b9

# Project Setup

## Installation

### Client
1. Copy `.env.example` → `.env`
2. `cd client`
3. `npm install`
4. `npm run dev`

### Server
1. Copy `.env.example` → `.env`
2. `cd server`
3. `npm install`
4. `npx prisma migrate dev`
5. `npx prisma generate`
6. `npm run dev`

## Project Features
1. Users can log in using their name.
2. Users can add multiple jobs, each containing multiple tasks with name and time.
3. Users can choose the number of CPU cores to run tasks in parallel per job.
