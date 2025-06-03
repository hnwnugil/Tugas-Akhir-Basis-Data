# Sample Data Seeding Script

This document provides sample data for testing the Among Us API. You can use these JSON objects to populate your database with maps, tasks, and sabotages.

## 1. Maps

### The Skeld
```bash
POST /api/maps
{
    "name": "The Skeld",
    "description": "The classic Among Us spaceship map",
    "rooms": [
        "Cafeteria", "Weapons", "O2", "Navigation", "Shields", 
        "Communications", "Storage", "Admin", "Electrical", 
        "Lower Engine", "Upper Engine", "Security", "Reactor", "MedBay"
    ]
}
```

### MIRA HQ
```bash
POST /api/maps
{
    "name": "MIRA HQ",
    "description": "High-tech headquarters in the sky",
    "rooms": [
        "Cafeteria", "Balcony", "Storage", "Communications", 
        "Locker Room", "Decontamination", "Laboratory", 
        "Reactor", "Launchpad", "MedBay", "Admin", "Office"
    ]
}
```

### Polus
```bash
POST /api/maps
{
    "name": "Polus",
    "description": "Research outpost on a distant planet",
    "rooms": [
        "Dropship", "Office", "Electrical", "O2", "Communications", 
        "Weapons", "Boiler Room", "Laboratory", "Specimen Room", 
        "Admin", "Storage", "Security"
    ]
}
```

## 2. Tasks (for The Skeld - replace mapId with actual map ID)

### Electrical Tasks
```bash
POST /api/tasks
{
    "mapId": "MAP_ID_HERE",
    "name": "Fix Wiring",
    "description": "Connect the colored wires in the correct order",
    "location": "Electrical",
    "type": "short",
    "isCommon": true
}
```

```bash
POST /api/tasks
{
    "mapId": "MAP_ID_HERE",
    "name": "Calibrate Distributor",
    "description": "Spin the distributor until the indicator is centered",
    "location": "Electrical",
    "type": "short",
    "isCommon": false
}
```

### Engine Tasks
```bash
POST /api/tasks
{
    "mapId": "MAP_ID_HERE",
    "name": "Align Engine Output",
    "description": "Drag the engine output into the center",
    "location": "Upper Engine",
    "type": "short",
    "isCommon": false
}
```

```bash
POST /api/tasks
{
    "mapId": "MAP_ID_HERE",
    "name": "Align Engine Output",
    "description": "Drag the engine output into the center",
    "location": "Lower Engine",
    "type": "short",
    "isCommon": false
}
```

### Navigation Tasks
```bash
POST /api/tasks
{
    "mapId": "MAP_ID_HERE",
    "name": "Chart Course",
    "description": "Plot the ship's navigation course",
    "location": "Navigation",
    "type": "short",
    "isCommon": false
}
```

### Weapons Tasks
```bash
POST /api/tasks
{
    "mapId": "MAP_ID_HERE",
    "name": "Clear Asteroids",
    "description": "Shoot the asteroids to clear the path",
    "location": "Weapons",
    "type": "long",
    "isCommon": false
}
```

### Medical Tasks
```bash
POST /api/tasks
{
    "mapId": "MAP_ID_HERE",
    "name": "Submit Scan",
    "description": "Stand in the medical scanner",
    "location": "MedBay",
    "type": "long",
    "isCommon": false
}
```

### Reactor Tasks
```bash
POST /api/tasks
{
    "mapId": "MAP_ID_HERE",
    "name": "Start Reactor",
    "description": "Press the buttons in the correct sequence",
    "location": "Reactor",
    "type": "long",
    "isCommon": false
}
```

### Admin Tasks
```bash
POST /api/tasks
{
    "mapId": "MAP_ID_HERE",
    "name": "Swipe Card",
    "description": "Swipe your ID card at the correct speed",
    "location": "Admin",
    "type": "common",
    "isCommon": true
}
```

### Storage Tasks
```bash
POST /api/tasks
{
    "mapId": "MAP_ID_HERE",
    "name": "Empty Garbage",
    "description": "Pull the lever to empty the garbage chute",
    "location": "Storage",
    "type": "short",
    "isCommon": false
}
```

## 3. Sabotages (for The Skeld - replace mapId with actual map ID)

### Critical Sabotages
```bash
POST /api/sabotage
{
    "maps": "MAP_ID_HERE",
    "name": "Reactor Meltdown",
    "type": "critical",
    "location": "Reactor"
}
```

```bash
POST /api/sabotage
{
    "maps": "MAP_ID_HERE",
    "name": "O2 Depletion",
    "type": "critical", 
    "location": "O2"
}
```

### Light Sabotages
```bash
POST /api/sabotage
{
    "maps": "MAP_ID_HERE",
    "name": "Lights Out",
    "type": "lights",
    "location": "Electrical"
}
```

### Communications Sabotages
```bash
POST /api/sabotage
{
    "maps": "MAP_ID_HERE",
    "name": "Communications Disrupted",
    "type": "communications",
    "location": "Communications"
}
```

### Door Sabotages
```bash
POST /api/sabotage
{
    "maps": "MAP_ID_HERE",
    "name": "Lock Cafeteria Doors",
    "type": "doors",
    "location": "Cafeteria"
}
```

```bash
POST /api/sabotage
{
    "maps": "MAP_ID_HERE",
    "name": "Lock Electrical Doors",
    "type": "doors",
    "location": "Electrical"
}
```

```bash
POST /api/sabotage
{
    "maps": "MAP_ID_HERE",
    "name": "Lock Storage Doors",
    "type": "doors",
    "location": "Storage"
}
```

## 4. Sample Players

```bash
POST /api/player
{
    "playerName": "RedCrew",
    "email": "red@amongus.test"
}
```

```bash
POST /api/player
{
    "playerName": "BlueCrew", 
    "email": "blue@amongus.test"
}
```

```bash
POST /api/player
{
    "playerName": "GreenCrew",
    "email": "green@amongus.test"
}
```

```bash
POST /api/player
{
    "playerName": "YellowCrew",
    "email": "yellow@amongus.test"
}
```

```bash
POST /api/player
{
    "playerName": "PinkCrew",
    "email": "pink@amongus.test"
}
```

```bash
POST /api/player
{
    "playerName": "OrangeCrew",
    "email": "orange@amongus.test"
}
```

## 5. Sample Game Creation

After creating maps and players, you can create a game:

```bash
POST /api/games
{
    "mapId": "MAP_ID_HERE",
    "hostId": "HOST_PLAYER_ID_HERE",
    "maxPlayers": 6,
    "impostorCount": 2,
    "emergencyMeetings": 1,
    "emergencyCooldown": 15,
    "discussionTime": 15,
    "votingTime": 120,
    "playerSpeed": 1.0,
    "crewmateVision": 1.0,
    "impostorVision": 1.5,
    "killCooldown": 45,
    "killDistance": 1.0,
    "taskBarUpdates": "always",
    "visualTasks": true,
    "commonTasks": 1,
    "longTasks": 1,
    "shortTasks": 2
}
```

## 6. Game Flow Testing

1. Create a game (status: 'waiting')
2. Add players to game using PUT `/api/games/:gameId/players`
3. Start the game using PUT `/api/games/:gameId/start`
4. Test various gameplay actions:
   - Complete tasks
   - Perform kills
   - Trigger sabotages
   - Report bodies
   - Call emergency meetings
   - Vote on players
   - Check win conditions

## Notes

- Replace all `MAP_ID_HERE` with actual MongoDB ObjectIds after creating maps
- Replace `HOST_PLAYER_ID_HERE` with actual player ObjectIds
- The API will automatically assign tasks when games start
- Win conditions are checked automatically after kills, votes, and task completions
- Sabotages add strategic depth to impostor gameplay
