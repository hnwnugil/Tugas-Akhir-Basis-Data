# Among Us API Documentation

## Base URL
```
http://localhost:8000/api
```

## Player Management Endpoints

### 1. Create Player
**Endpoint:** `POST /player/create`

**Description:** Creates a new player with automatic cosmetics and statistics generation.

**Request Body:**
```json
{
  "username": "string (required, unique)",
  "email": "string (required, unique, email format)"
}
```

**Response (201 Created):**
```json
{
  "_id": "ObjectId",
  "username": "playerName",
  "email": "player@email.com",
  "level": 1,
  "cosmetics": {
    "_id": "ObjectId",
    "player": "ObjectId",
    "color": "Red",
    "hat": "",
    "skin": "",
    "pet": ""
  },
  "stats": {
    "_id": "ObjectId",
    "player": "ObjectId",
    "gamesStarted": 0,
    "gamesFinished": 0,
    "gamesWon": 0,
    "impostorWins": 0,
    "crewmateWins": 0,
    "timesImpostor": 0,
    "timesCrewmate": 0,
    "impostorKills": 0,
    "bodiesReported": 0,
    "emergenciesCalled": 0,
    "tasksCompleted": 0,
    "allTasksCompleted": 0,
    "sabotagesFixed": 0,
    "crewmateStreak": 0
  },
  "createdAt": "ISO Date"
}
```

### 2. Get All Players
**Endpoint:** `GET /player/getAllPlayer`

**Description:** Retrieves all players with populated cosmetics and statistics.

**Response (200 OK):**
```json
[
  {
    "_id": "ObjectId",
    "username": "playerName",
    "email": "player@email.com",
    "level": 1,
    "cosmetics": { /* Cosmetics object */ },
    "stats": { /* Statistics object */ },
    "createdAt": "ISO Date"
  }
]
```

### 3. Get Player by Username
**Endpoint:** `GET /player/getPlayer/:username`

**Description:** Retrieves a specific player by their username.

**Parameters:**
- `username` (string): The player's username

**Response (200 OK):**
```json
{
  "_id": "ObjectId",
  "username": "playerName",
  "email": "player@email.com",
  "level": 1,
  "cosmetics": { /* Cosmetics object */ },
  "stats": { /* Statistics object */ },
  "createdAt": "ISO Date"
}
```

### 4. Update Player Name/Email
**Endpoint:** `PUT /player/updateNameEmail/:id`

**Description:** Updates a player's username and/or email with validation.

**Parameters:**
- `id` (string): The player's ObjectId

**Request Body:**
```json
{
  "username": "string (optional, but if provided, email is required)",
  "email": "string (optional, but if provided, username is required)"
}
```

**Response (200 OK):**
```json
{
  "_id": "ObjectId",
  "username": "newPlayerName",
  "email": "newPlayer@email.com",
  "level": 1,
  "cosmetics": { /* Cosmetics object */ },
  "stats": { /* Statistics object */ },
  "createdAt": "ISO Date"
}
```

### 5. Delete Player
**Endpoint:** `DELETE /player/deletePlayer/:id`

**Description:** Deletes a player and their associated cosmetics and statistics.

**Parameters:**
- `id` (string): The player's ObjectId

**Response (200 OK):**
```json
{
  "message": "Player deleted successfully"
}
```

### 6. Update Player Cosmetics
**Endpoint:** `PUT /player/updateCosmetics/:id`

**Description:** Updates a player's cosmetic appearance.

**Parameters:**
- `id` (string): The player's ObjectId

**Request Body:**
```json
{
  "color": "string (required, valid Among Us color)",
  "hat": "string (optional)",
  "skin": "string (optional)",
  "pet": "string (optional)"
}
```

**Valid Colors:**
`["Red", "Blue", "Green", "Pink", "Orange", "Yellow", "Black", "White", "Purple", "Brown", "Cyan", "Lime", "Maroon", "Rose", "Banana"]`

**Response (200 OK):**
```json
{
  "_id": "ObjectId",
  "player": "ObjectId",
  "color": "Blue",
  "hat": "TopHat",
  "skin": "Astronaut",
  "pet": "Doggo"
}
```

## Game Management Endpoints

### 1. Create Game
**Endpoint:** `POST /games/create`

**Description:** Creates a new game with specified map, host, and players.

**Request Body:**
```json
{
  "maps": "ObjectId (required, valid map ID)",
  "hostId": "ObjectId (required, valid player ID)",
  "playerIds": ["ObjectId"] (required, array of valid player IDs)
}
```

**Response (201 Created):**
```json
{
  "_id": "ObjectId",
  "maps": "ObjectId",
  "hostId": "ObjectId",
  "playerIds": ["ObjectId"],
  "impostorIds": [],
  "settings": {
    "maxPlayers": 10,
    "impostors": 2,
    "killCooldown": 20,
    "emergencyMeetings": 1,
    "discussionTime": 30,
    "votingTime": 60,
    "playerSpeed": 1.0,
    "crewmateVision": 1.0,
    "impostorVision": 1.5,
    "killDistance": "Medium",
    "visualTasks": true,
    "confirmEjects": true,
    "commonTasks": 2,
    "longTasks": 1,
    "shortTasks": 3
  },
  "status": "waiting",
  "startedAt": null,
  "endedAt": null,
  "winner": null
}
```

### 2. Get All Games
**Endpoint:** `GET /games/`

**Description:** Retrieves all games with populated data.

**Response (200 OK):**
```json
[
  {
    "_id": "ObjectId",
    "maps": { /* Map object */ },
    "hostId": { /* Player object */ },
    "playerIds": [{ /* Player objects */ }],
    "impostorIds": [{ /* Player objects */ }],
    "settings": { /* Settings object */ },
    "status": "waiting",
    "startedAt": null,
    "endedAt": null,
    "winner": null
  }
]
```

### 3. Get Game by ID
**Endpoint:** `GET /games/:gameId`

**Description:** Retrieves a specific game by its ID.

**Parameters:**
- `gameId` (string): The game's ObjectId

**Response (200 OK):**
```json
{
  "_id": "ObjectId",
  "maps": { /* Map object */ },
  "hostId": { /* Player object */ },
  "playerIds": [{ /* Player objects */ }],
  "impostorIds": [{ /* Player objects */ }],
  "settings": { /* Settings object */ },
  "status": "waiting",
  "startedAt": null,
  "endedAt": null,
  "winner": null
}
```

### 4. Edit Game Settings
**Endpoint:** `PUT /games/:gameId/settings`

**Description:** Updates game settings before the game starts.

**Parameters:**
- `gameId` (string): The game's ObjectId

**Request Body (all fields optional):**
```json
{
  "maxPlayers": "number (1-15)",
  "impostors": "number (1-3)",
  "killCooldown": "number (10-60)",
  "emergencyMeetings": "number (0-9)",
  "discussionTime": "number (0-120)",
  "votingTime": "number (15-300)",
  "playerSpeed": "number (0.5-3.0)",
  "crewmateVision": "number (0.25-5.0)",
  "impostorVision": "number (0.25-5.0)",
  "killDistance": "string ('Short'|'Medium'|'Long')",
  "visualTasks": "boolean",
  "confirmEjects": "boolean",
  "commonTasks": "number (0-2)",
  "longTasks": "number (0-3)",
  "shortTasks": "number (0-5)"
}
```

**Response (200 OK):**
```json
{
  "_id": "ObjectId",
  "maps": "ObjectId",
  "hostId": "ObjectId",
  "playerIds": ["ObjectId"],
  "settings": { /* Updated settings */ },
  "status": "waiting"
}
```

### 5. Start Game
**Endpoint:** `GET /games/start/:gameId`

**Description:** Starts a game, assigns impostors randomly, and changes status to 'playing'.

**Parameters:**
- `gameId` (string): The game's ObjectId

**Response (200 OK):**
```json
{
  "_id": "ObjectId",
  "maps": "ObjectId",
  "hostId": "ObjectId",
  "playerIds": ["ObjectId"], // Crewmates only
  "impostorIds": ["ObjectId"], // Randomly selected impostors
  "settings": { /* Settings */ },
  "status": "playing",
  "startedAt": "ISO Date",
  "endedAt": null,
  "winner": null
}
```

### 6. End Game
**Endpoint:** `GET /games/end/:gameId`

**Description:** Ends a game and merges all players back together.

**Parameters:**
- `gameId` (string): The game's ObjectId

**Response (200 OK):**
```json
{
  "_id": "ObjectId",
  "maps": "ObjectId",
  "hostId": "ObjectId",
  "playerIds": ["ObjectId"], // All players merged back
  "impostorIds": [], // Cleared
  "settings": { /* Settings */ },
  "status": "finished",
  "startedAt": "ISO Date",
  "endedAt": "ISO Date",
  "winner": null
}
```

## Sabotage Management Endpoints

### 1. Create Sabotage Type
**Endpoint:** `POST /sabotage`

**Description:** Creates a new sabotage type available for a specific map.

**Request Body:**
```json
{
  "maps": "ObjectId (required) - Map ID",
  "name": "string (required) - Sabotage name",
  "type": "string (required) - Sabotage type (critical, lights, communications, doors)",
  "location": "string (required) - Room/location where sabotage occurs"
}
```

**Response (201 Created):**
```json
{
  "_id": "ObjectId",
  "maps": "ObjectId",
  "name": "Reactor Meltdown",
  "type": "critical",
  "location": "Reactor",
  "createdAt": "ISO Date",
  "updatedAt": "ISO Date"
}
```

### 2. Get All Sabotages
**Endpoint:** `GET /sabotage`

**Response (200 OK):**
```json
{
  "count": 5,
  "data": [
    {
      "_id": "ObjectId",
      "maps": {
        "_id": "ObjectId",
        "name": "The Skeld"
      },
      "name": "Reactor Meltdown",
      "type": "critical",
      "location": "Reactor"
    }
  ]
}
```

### 3. Get Sabotages by Map
**Endpoint:** `GET /sabotage/map/:mapId`

**Parameters:**
- `mapId` (required): Map ObjectId

**Response (200 OK):**
```json
{
  "count": 2,
  "data": [
    {
      "_id": "ObjectId",
      "maps": {
        "_id": "ObjectId",
        "name": "The Skeld"
      },
      "name": "Reactor Meltdown",
      "type": "critical",
      "location": "Reactor"
    }
  ]
}
```

### 4. Get Sabotage by ID
**Endpoint:** `GET /sabotage/:id`

**Parameters:**
- `id` (required): Sabotage ObjectId

### 5. Update Sabotage
**Endpoint:** `PUT /sabotage/:id`

**Parameters:**
- `id` (required): Sabotage ObjectId

**Request Body:** Same as create sabotage (all fields optional)

### 6. Delete Sabotage
**Endpoint:** `DELETE /sabotage/:id`

**Parameters:**
- `id` (required): Sabotage ObjectId

**Response (200 OK):**
```json
{
  "message": "Sabotage deleted successfully"
}
```

## Game Sabotage Endpoints

### 7. Trigger Sabotage
**Endpoint:** `POST /sabotage/trigger`

**Description:** Allows an impostor to trigger a sabotage during gameplay.

**Request Body:**
```json
{
  "gameId": "ObjectId (required) - Game ID",
  "impostorId": "ObjectId (required) - Impostor player ID",
  "sabotageId": "ObjectId (required) - Sabotage type ID"
}
```

**Response (201 Created):**
```json
{
  "message": "Sabotage triggered successfully",
  "sabotage": {
    "_id": "ObjectId",
    "gameId": {
      "_id": "ObjectId",
      "status": "playing"
    },
    "impostorId": {
      "_id": "ObjectId",
      "username": "RedImpostor"
    },
    "sabotageId": {
      "_id": "ObjectId",
      "name": "Reactor Meltdown",
      "type": "critical",
      "location": "Reactor"
    },
    "status": "active",
    "triggeredAt": "ISO Date",
    "resolvedAt": null
  }
}
```

### 8. Resolve Sabotage
**Endpoint:** `PUT /sabotage/resolve/:sabotageGameId`

**Description:** Allows a crewmate to resolve an active sabotage.

**Parameters:**
- `sabotageGameId` (required): SabotageGame ObjectId

**Request Body:**
```json
{
  "resolverId": "ObjectId (required) - Crewmate player ID"
}
```

**Response (200 OK):**
```json
{
  "message": "Sabotage resolved successfully",
  "sabotage": {
    "_id": "ObjectId",
    "gameId": { /* Game object */ },
    "impostorId": { /* Player object */ },
    "sabotageId": { /* Sabotage object */ },
    "status": "resolved",
    "triggeredAt": "ISO Date",
    "resolvedAt": "ISO Date"
  }
}
```

### 9. Get Active Sabotages
**Endpoint:** `GET /sabotage/game/:gameId/active`

**Description:** Gets all currently active sabotages in a game.

**Parameters:**
- `gameId` (required): Game ObjectId

**Response (200 OK):**
```json
{
  "count": 1,
  "data": [
    {
      "_id": "ObjectId",
      "gameId": { /* Game object */ },
      "impostorId": { /* Player object */ },
      "sabotageId": { /* Sabotage object */ },
      "status": "active",
      "triggeredAt": "ISO Date",
      "resolvedAt": null
    }
  ]
}
```

### 10. Get Game Sabotage History
**Endpoint:** `GET /sabotage/game/:gameId`

**Description:** Gets all sabotages (active and resolved) for a game.

**Parameters:**
- `gameId` (required): Game ObjectId

**Response (200 OK):**
```json
{
  "count": 3,
  "data": [
    {
      "_id": "ObjectId",
      "gameId": { /* Game object */ },
      "impostorId": { /* Player object */ },
      "sabotageId": { /* Sabotage object */ },
      "status": "resolved",
      "triggeredAt": "ISO Date",
      "resolvedAt": "ISO Date"
    }
  ]
}
```

## Error Responses

### Common Error Codes:
- **400 Bad Request**: Missing required fields or invalid data
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

### Error Response Format:
```json
{
  "message": "Error description",
  "error": "Detailed error message (in development)"
}
```

## Game Status Flow
1. **waiting** - Game created, players can join, settings can be modified
2. **playing** - Game started, impostors assigned, gameplay in progress
3. **voting** - Meeting in progress, players voting (future implementation)
4. **finished** - Game ended

## Notes
- All ObjectId fields should be valid MongoDB ObjectIds
- Dates are returned in ISO 8601 format
- The API uses JSON for all request and response bodies
- Default port is 8000 (configurable via environment variables)
- MongoDB connection required for all operations
