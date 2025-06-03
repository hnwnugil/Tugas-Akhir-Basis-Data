# Among Us CRUD API - Complete Testing Guide

## Server Status
✅ **Server is running successfully on port 8000**
✅ **Connected to MongoDB Atlas**
✅ **All validation middleware applied**
✅ **API tested and working**

## API Endpoints Overview

### Base URL: `http://localhost:8000`

### 1. Player Management (`/api/player`)
- `POST /api/player/create` - Create new player
- `GET /api/player/getAllPlayer` - Get all players
- `GET /api/player/getPlayer/:username` - Get player by username
- `PUT /api/player/updateNameEmail/:id` - Update player name/email
- `PUT /api/player/updateCosmetics/:id` - Update player cosmetics
- `DELETE /api/player/deletePlayer/:id` - Delete player

### 2. Game Management (`/api/games`)
- `GET /api/games` - Get all games
- `GET /api/games/:gameId` - Get game by ID
- `POST /api/games/create` - Create new game
- `PUT /api/games/:gameId/settings` - Edit game settings
- `GET /api/games/start/:gameId` - Start game
- `GET /api/games/check-win/:gameId` - Check win condition
- `GET /api/games/end/:gameId` - End game

### 3. Map Management (`/api/maps`)
- `GET /api/maps` - Get all maps
- `GET /api/maps/:mapId` - Get map by ID
- `POST /api/maps/create` - Create new map
- `PUT /api/maps/:mapId` - Update map
- `DELETE /api/maps/:mapId` - Delete map

### 4. Task Management (`/api/tasks`)
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:taskId` - Get task by ID
- `GET /api/tasks/map/:mapId` - Get tasks by map
- `POST /api/tasks/create` - Create new task
- `PUT /api/tasks/:taskId` - Update task
- `DELETE /api/tasks/:taskId` - Delete task

### 5. Player Tasks (`/api/playertasks`)
- `GET /api/playertasks` - Get all player tasks
- `GET /api/playertasks/game/:gameId` - Get tasks by game
- `GET /api/playertasks/game/:gameId/player/:playerId` - Get tasks by game and player
- `POST /api/playertasks/assign/:gameId` - Assign tasks to players in game
- `PUT /api/playertasks/status/:taskId` - Update task completion status

### 6. Kill System (`/api/kills`)
- `GET /api/kills` - Get all kills
- `GET /api/kills/game/:gameId` - Get kills by game
- `GET /api/kills/player/:playerId` - Get kills by player
- `POST /api/kills/create` - Record a kill

### 7. Meeting System (`/api/meetings`)
- `GET /api/meetings` - Get all meetings
- `GET /api/meetings/game/:gameId` - Get meetings by game
- `POST /api/meetings/start` - Start emergency meeting
- `PUT /api/meetings/end/:meetingId` - End meeting

### 8. Voting System (`/api/votes`)
- `GET /api/votes` - Get all votes
- `GET /api/votes/meeting/:meetingId` - Get votes by meeting
- `GET /api/votes/results/:meetingId` - Get vote results
- `POST /api/votes/cast` - Cast a vote
- `POST /api/votes/eject` - Eject player based on votes

### 9. Report System (`/api/reports`)
- `GET /api/reports` - Get all reports
- `GET /api/reports/game/:gameId` - Get reports by game
- `POST /api/reports/body` - Report a dead body
- `POST /api/reports/emergency` - Call emergency meeting

### 10. Sabotage System (`/api/sabotage`)
- `GET /api/sabotage` - Get all sabotage types
- `GET /api/sabotage/:id` - Get sabotage by ID
- `GET /api/sabotage/map/:mapId` - Get sabotages for a map
- `POST /api/sabotage` - Create new sabotage type
- `PUT /api/sabotage/:id` - Update sabotage
- `DELETE /api/sabotage/:id` - Delete sabotage
- `POST /api/sabotage/trigger` - Trigger sabotage in game
- `PUT /api/sabotage/resolve/:sabotageGameId` - Resolve active sabotage
- `GET /api/sabotage/game/:gameId/active` - Get active sabotages in game
- `GET /api/sabotage/game/:gameId` - Get all game sabotages

## Quick Test Commands (PowerShell)

### Test GET Endpoints
```powershell
# Get all players
Invoke-WebRequest -Uri "http://localhost:8000/api/player/getAllPlayer" -Method GET

# Get all games
Invoke-WebRequest -Uri "http://localhost:8000/api/games" -Method GET

# Get all maps
Invoke-WebRequest -Uri "http://localhost:8000/api/maps" -Method GET

# Get all tasks
Invoke-WebRequest -Uri "http://localhost:8000/api/tasks" -Method GET

# Get all sabotages
Invoke-WebRequest -Uri "http://localhost:8000/api/sabotage" -Method GET
```

### Test POST Endpoints
```powershell
# Create a player
$playerBody = @{
    username = "TestPlayer"
    email = "test@amongus.com"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8000/api/player/create" -Method POST -Body $playerBody -ContentType "application/json"

# Create a map
$mapBody = @{
    name = "Test Skeld"
    description = "A test version of The Skeld"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8000/api/maps/create" -Method POST -Body $mapBody -ContentType "application/json"
```

## Sample Test Data

### Create a Player
```json
POST /api/player/create
{
    "username": "RedCrew",
    "email": "red@amongus.com"
}
```

### Create a Map
```json
POST /api/maps/create
{
    "name": "The Skeld",
    "description": "Classic Among Us map with multiple rooms and vents"
}
```

### Create a Game
```json
POST /api/games/create
{
    "mapId": "MAP_ID_HERE",
    "hostId": "PLAYER_ID_HERE"
}
```

### Create a Task
```json
POST /api/tasks/create
{
    "name": "Fix Wiring",
    "mapId": "MAP_ID_HERE",
    "location": "Electrical",
    "type": "Common"
}
```

### Trigger a Sabotage
```json
POST /api/sabotage/trigger
{
    "gameId": "GAME_ID_HERE",
    "sabotageId": "SABOTAGE_ID_HERE",
    "triggeredBy": "IMPOSTOR_PLAYER_ID_HERE"
}
```

## Validation Features
✅ All endpoints have input validation
✅ MongoDB ObjectId validation
✅ Email format validation
✅ Username format validation (alphanumeric + underscore)
✅ Required field validation
✅ Data type validation

## Database Schema Complete
✅ Players with cosmetics
✅ Games with settings and status
✅ Maps with locations
✅ Tasks with types and locations
✅ Player-Task assignments
✅ Kill records
✅ Meeting records
✅ Voting system
✅ Report system
✅ Sabotage system with game integration
✅ Statistics tracking (available for future use)

## Project Status: COMPLETE ✅
The Among Us CRUD API is now fully functional and ready for use!
