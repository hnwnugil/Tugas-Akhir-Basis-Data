# Postman Collection for Among Us API

## Environment Variables
Set up these variables in Postman:
- `baseUrl`: `http://localhost:8000`
- `playerId`: (will be set from create player response)
- `gameId`: (will be set from create game response)
- `mapId`: (will be set from create map response)
- `taskId`: (will be set from create task response)

## Test Sequence

### 1. Create a Map (First)
```
POST {{baseUrl}}/api/maps
Content-Type: application/json

{
    "name": "The Skeld",
    "description": "The classic Among Us spaceship map with multiple rooms and ventilation systems"
}
```

### 2. Create Players
```
POST {{baseUrl}}/api/player
Content-Type: application/json

{
    "username": "RedCrew",
    "email": "red@amongus.com"
}
```

```
POST {{baseUrl}}/api/player
Content-Type: application/json

{
    "username": "BlueImp",
    "email": "blue@amongus.com"
}
```

### 3. Create Tasks
```
POST {{baseUrl}}/api/tasks
Content-Type: application/json

{
    "name": "Fix Wiring",
    "mapId": "{{mapId}}",
    "location": "Electrical",
    "type": "Common",
    "description": "Connect the colored wires correctly"
}
```

### 4. Create a Game
```
POST {{baseUrl}}/api/games
Content-Type: application/json

{
    "mapId": "{{mapId}}",
    "hostId": "{{playerId}}"
}
```

### 5. Create Sabotage Types
```
POST {{baseUrl}}/api/sabotage
Content-Type: application/json

{
    "name": "Lights Out",
    "mapId": "{{mapId}}",
    "type": "lights",
    "location": "Electrical",
    "description": "Turn off all lights making vision limited"
}
```

### 6. Test Game Actions

#### Record a Kill
```
POST {{baseUrl}}/api/kills
Content-Type: application/json

{
    "gameId": "{{gameId}}",
    "killerId": "IMPOSTOR_PLAYER_ID",
    "victimId": "CREWMATE_PLAYER_ID",
    "location": "Electrical"
}
```

#### Call Emergency Meeting
```
POST {{baseUrl}}/api/meetings
Content-Type: application/json

{
    "gameId": "{{gameId}}",
    "calledBy": "{{playerId}}",
    "reason": "emergency"
}
```

#### Cast a Vote
```
POST {{baseUrl}}/api/votes
Content-Type: application/json

{
    "meetingId": "MEETING_ID_FROM_ABOVE",
    "voterId": "{{playerId}}",
    "votedFor": "SUSPECTED_PLAYER_ID"
}
```

#### Report Dead Body
```
POST {{baseUrl}}/api/reports
Content-Type: application/json

{
    "gameId": "{{gameId}}",
    "reporterId": "{{playerId}}",
    "location": "Electrical",
    "description": "Found dead body in electrical"
}
```

#### Trigger Sabotage
```
POST {{baseUrl}}/api/sabotage/trigger
Content-Type: application/json

{
    "gameId": "{{gameId}}",
    "sabotageId": "SABOTAGE_ID_FROM_ABOVE",
    "triggeredBy": "IMPOSTOR_PLAYER_ID"
}
```

### 7. Get All Data Endpoints

```
GET {{baseUrl}}/api/player
GET {{baseUrl}}/api/games
GET {{baseUrl}}/api/maps
GET {{baseUrl}}/api/tasks
GET {{baseUrl}}/api/kills
GET {{baseUrl}}/api/meetings
GET {{baseUrl}}/api/votes
GET {{baseUrl}}/api/reports
GET {{baseUrl}}/api/sabotage
```

## Validation Test Cases

### Invalid Player Creation
```
POST {{baseUrl}}/api/player
Content-Type: application/json

{
    "username": "ab",
    "email": "invalid-email"
}
```
Expected: 400 Bad Request with validation errors

### Invalid Game Creation
```
POST {{baseUrl}}/api/games
Content-Type: application/json

{
    "mapId": "invalid-id",
    "hostId": "invalid-id"
}
```
Expected: 400 Bad Request with validation errors

### Invalid ObjectId
```
GET {{baseUrl}}/api/player/invalid-id
```
Expected: 400 Bad Request with ObjectId validation error

## Success Response Examples

### Player Created
```json
{
    "_id": "676d1234567890abcdef1234",
    "username": "RedCrew",
    "email": "red@amongus.com",
    "createdAt": "2024-12-26T10:00:00.000Z",
    "updatedAt": "2024-12-26T10:00:00.000Z"
}
```

### Game Created
```json
{
    "_id": "676d1234567890abcdef5678",
    "mapId": "676d1234567890abcdef1111",
    "hostId": "676d1234567890abcdef1234",
    "status": "waiting",
    "players": [],
    "impostors": [],
    "settings": {
        "maxPlayers": 10,
        "impostors": 2,
        "killCooldown": 20,
        "emergencyMeetings": 1,
        "taskBarUpdate": "always"
    },
    "createdAt": "2024-12-26T10:05:00.000Z"
}
```

## Error Response Examples

### Validation Error
```json
{
    "message": "Validation failed",
    "errors": [
        {
            "type": "field",
            "value": "ab",
            "msg": "Username must be between 3 and 20 characters",
            "path": "username",
            "location": "body"
        }
    ]
}
```

### Not Found Error
```json
{
    "message": "Player not found"
}
```

### Server Error
```json
{
    "message": "Internal Server Error",
    "error": "Database connection failed"
}
```
