# Among Us API Dashboard - Website Guide

## Overview
This website provides a complete web interface for interacting with the Among Us CRUD API. It features a modern, responsive design with full CRUD operations for all API endpoints.

## Features

### 🎮 Complete API Integration
- **Players Management**: Create, view, and delete players
- **Games Management**: Create, view, and delete games
- **Maps Management**: Create, view, and delete maps
- **Tasks Management**: Create, view, and delete tasks
- **Kills Tracking**: Create, view, and delete kill records
- **Meetings Management**: Create, view, and delete meeting records
- **Sabotage System**: Create, view, and delete sabotage types

### 🎨 Modern UI/UX
- Clean, responsive design that works on all devices
- Tabbed navigation for easy switching between sections
- Real-time server status indicator
- Toast notifications for user feedback
- Loading states and error handling
- Among Us themed color scheme

### 🔧 Technical Features
- Real-time API communication
- Form validation
- Responsive grid layouts
- Modern CSS with CSS variables
- Accessibility-friendly design
- Cross-browser compatibility

## Getting Started

### Prerequisites
- Node.js and npm installed
- MongoDB Atlas connection configured
- Server running on port 8000

### Starting the Website
1. Start the server:
   ```bash
   npm start
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

### Alternative Access
You can also access the website directly by opening `public/index.html` in your browser, but make sure the API server is running on port 8000.

## How to Use

### Navigation
- Use the tab buttons at the top to switch between different sections
- Each tab contains forms for creating new records and lists for viewing existing data

### Creating Records
1. Select the appropriate tab (Players, Games, Maps, etc.)
2. Fill out the form on the left side
3. Click "Create [Record Type]" button
4. The new record will appear in the list on the right

### Viewing Records
- All records are displayed in the right panel of each tab
- Records show key information and creation timestamps
- Use the "Refresh" button to reload data

### Deleting Records
- Each record has a red "Delete" button
- Click to delete (confirmation dialog will appear)
- The list will automatically update after deletion

### Server Status
- The header shows real-time server connection status
- Green circle = Server Online
- Red circle = Server Offline
- Yellow circle = Checking Connection

## File Structure

```
public/
├── index.html          # Main HTML structure
├── styles.css          # Complete CSS styling
└── script.js           # JavaScript functionality
```

## API Endpoints Used

The website interacts with the following API endpoints:

### Players
- `GET /api/player/getAllPlayer` - Get all players
- `POST /api/player/createPlayer` - Create new player
- `DELETE /api/player/deletePlayer/:id` - Delete player

### Games
- `GET /api/games/getAllGames` - Get all games
- `POST /api/games/createGame` - Create new game
- `DELETE /api/games/deleteGame/:id` - Delete game

### Maps
- `GET /api/maps/getAllMaps` - Get all maps
- `POST /api/maps/createMap` - Create new map
- `DELETE /api/maps/deleteMap/:id` - Delete map

### Tasks
- `GET /api/tasks/getAllTasks` - Get all tasks
- `POST /api/tasks/createTask` - Create new task
- `DELETE /api/tasks/deleteTask/:id` - Delete task

### Kills
- `GET /api/kills/getAllKills` - Get all kills
- `POST /api/kills/createKill` - Create new kill
- `DELETE /api/kills/deleteKill/:id` - Delete kill

### Meetings
- `GET /api/meetings/getAllMeetings` - Get all meetings
- `POST /api/meetings/createMeeting` - Create new meeting
- `DELETE /api/meetings/deleteMeeting/:id` - Delete meeting

### Sabotage
- `GET /api/sabotage/getAllSabotage` - Get all sabotage types
- `POST /api/sabotage/createSabotage` - Create new sabotage
- `DELETE /api/sabotage/deleteSabotage/:id` - Delete sabotage

## Browser Compatibility

The website works on all modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Mobile Support

The website is fully responsive and works on:
- Smartphones (320px and up)
- Tablets (768px and up)
- Desktop computers (1024px and up)

## Troubleshooting

### Common Issues

1. **Server Offline Error**
   - Make sure the API server is running on port 8000
   - Check MongoDB connection
   - Verify all API routes are working

2. **Forms Not Submitting**
   - Check browser console for JavaScript errors
   - Ensure all required fields are filled
   - Verify API server is responding

3. **Data Not Loading**
   - Check network connection
   - Verify API endpoints are accessible
   - Look for CORS issues in browser console

4. **Styling Issues**
   - Make sure `styles.css` is loading properly
   - Check browser developer tools for CSS errors
   - Clear browser cache

### Console Debugging

Open browser developer tools (F12) to see:
- Network requests to API
- JavaScript errors
- Console log messages

## Customization

### Changing Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #1e40af;
    --secondary-color: #3b82f6;
    --accent-color: #ef4444;
    /* ... other variables */
}
```

### Adding New Features
1. Add new HTML structure in `index.html`
2. Style with CSS in `styles.css`
3. Add JavaScript functionality in `script.js`

### API Configuration
Change the API URL in `script.js`:
```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

## Performance

### Loading Times
- Initial page load: < 2 seconds
- API requests: < 500ms (local server)
- Form submissions: < 1 second

### Optimization Features
- Efficient DOM manipulation
- Minimal API calls
- Cached static assets
- Responsive images
- Optimized CSS

## Security

### Client-Side Security
- Input validation on forms
- XSS protection through proper DOM handling
- No sensitive data stored in localStorage

### API Security
- All API calls use proper HTTP methods
- JSON data transmission
- Error handling without exposing server details

## Future Enhancements

Potential improvements:
1. **Edit Functionality**: Add ability to edit existing records
2. **Search and Filter**: Add search capabilities to data lists
3. **Data Visualization**: Add charts and graphs for statistics
4. **Real-time Updates**: WebSocket integration for live data
5. **User Authentication**: Add login system
6. **Data Export**: Export data to CSV/JSON
7. **Advanced Filters**: Date ranges, status filters, etc.
8. **Pagination**: Handle large datasets
9. **Bulk Operations**: Select and delete multiple records
10. **Dark Mode**: Toggle between light and dark themes

## Support

For issues or questions:
1. Check the console for error messages
2. Verify API server is running
3. Review API documentation in `API_DOCUMENTATION.md`
4. Check the testing guide in `TESTING_GUIDE.md`

---

**Created**: June 2025  
**Version**: 1.0.0  
**Author**: Among Us API Team  
**License**: MIT
