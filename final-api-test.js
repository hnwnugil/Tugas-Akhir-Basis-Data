// Final Comprehensive API Test Suite for Among Us API
import http from 'http';
import { URL } from 'url';

const BASE_URL = 'http://localhost:8000';
let testResults = {
    passed: 0,
    failed: 0,
    total: 0,
    details: []
};

// Helper function to make HTTP requests
function makeRequest(endpoint, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(endpoint, BASE_URL);
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Among-Us-API-Test/1.0'
            }
        };

        if (data && (method === 'POST' || method === 'PUT')) {
            const postData = JSON.stringify(data);
            options.headers['Content-Length'] = Buffer.byteLength(postData);
        }

        const req = http.request(options, (res) => {
            let responseData = '';
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                try {
                    const parsedData = responseData ? JSON.parse(responseData) : {};
                    resolve({
                        status: res.statusCode,
                        data: parsedData,
                        headers: res.headers
                    });
                } catch (error) {
                    resolve({
                        status: res.statusCode,
                        data: responseData,
                        headers: res.headers
                    });
                }
            });
        });        req.on('error', (error) => {
            console.log(`Request error for ${endpoint}:`, error.message);
            reject(error);
        });

        req.on('timeout', () => {
            console.log(`Request timeout for ${endpoint}`);
            req.destroy();
            reject(new Error('Request timeout'));
        });

        // Set a timeout for the request
        req.setTimeout(10000);

        if (data && (method === 'POST' || method === 'PUT')) {
            req.write(JSON.stringify(data));
        }
        
        req.end();
    });
}

// Test logging function
function logTest(testName, passed, message, response = null) {
    testResults.total++;
    if (passed) {
        testResults.passed++;
        console.log(`✅ ${testName}: PASSED - ${message}`);
    } else {
        testResults.failed++;
        console.log(`❌ ${testName}: FAILED - ${message}`);
        if (response) {
            console.log(`   Status: ${response.status}, Data:`, response.data);
        }
    }
    testResults.details.push({
        name: testName,
        passed,
        message,
        response: response ? { status: response.status, data: response.data } : null
    });
}

// Wait function for delays
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Test functions
async function testGetAllPlayers() {
    try {
        const response = await makeRequest('/api/player/getAllPlayer');
        const passed = response.status === 200 && Array.isArray(response.data);
        logTest('GET All Players', passed, 
            passed ? `Found ${response.data.length} players` : 'Failed to get players', 
            response);
        return response.data || [];
    } catch (error) {
        logTest('GET All Players', false, `Error: ${error.message}`);
        return [];
    }
}

async function testCreatePlayer() {
    try {
        const playerData = {
            username: `Test${Date.now().toString().slice(-8)}`, // Shorter username
            email: `test${Date.now()}@example.com`
        };
        
        const response = await makeRequest('/api/player/create', 'POST', playerData);
        const passed = response.status === 201 || response.status === 200;
        logTest('POST Create Player', passed, 
            passed ? `Created player: ${playerData.username}` : 'Failed to create player',
            response);
        return passed ? response.data : null;
    } catch (error) {
        logTest('POST Create Player', false, `Error: ${error.message}`);
        return null;
    }
}

async function testUpdatePlayerCosmetics(playerId) {
    if (!playerId) {
        logTest('PUT Update Cosmetics', false, 'No player ID provided');
        return;
    }
    
    try {        const cosmeticsData = {
            cosmetics: {
                color: 'blue',
                hat: 'chef_hat'
            }
        };
        
        const response = await makeRequest(`/api/player/updateCosmetics/${playerId}`, 'PUT', cosmeticsData);
        const passed = response.status === 200;
        logTest('PUT Update Cosmetics', passed, 
            passed ? 'Updated player cosmetics' : 'Failed to update cosmetics',
            response);
    } catch (error) {
        logTest('PUT Update Cosmetics', false, `Error: ${error.message}`);
    }
}

async function testUpdatePlayerNameEmail(playerId) {
    if (!playerId) {
        logTest('PUT Update Name/Email', false, 'No player ID provided');
        return;
    }
    
    try {        const updateData = {
            username: `Upd${Date.now().toString().slice(-8)}`, // Shorter username
            email: `updated${Date.now()}@example.com`
        };
        
        const response = await makeRequest(`/api/player/updateNameEmail/${playerId}`, 'PUT', updateData);
        const passed = response.status === 200;
        logTest('PUT Update Name/Email', passed, 
            passed ? 'Updated player name and email' : 'Failed to update name/email',
            response);
    } catch (error) {
        logTest('PUT Update Name/Email', false, `Error: ${error.message}`);
    }
}

async function testGetMaps() {
    try {
        const response = await makeRequest('/api/maps');
        const passed = response.status === 200;
        logTest('GET Maps', passed, 
            passed ? `Found maps data` : 'Failed to get maps',
            response);
        return response.data || [];
    } catch (error) {
        logTest('GET Maps', false, `Error: ${error.message}`);
        return [];
    }
}

async function testCreateMap() {
    try {
        const mapData = {
            name: `TestMap_${Date.now()}`,
            description: 'Test map for API testing',
            rooms: ['Cafeteria', 'Admin', 'Electrical', 'Medbay']
        };
        
        const response = await makeRequest('/api/maps/create', 'POST', mapData);
        const passed = response.status === 201 || response.status === 200;
        logTest('POST Create Map', passed, 
            passed ? `Created map: ${mapData.name}` : 'Failed to create map',
            response);
        return passed ? response.data : null;
    } catch (error) {
        logTest('POST Create Map', false, `Error: ${error.message}`);
        return null;
    }
}

async function testGetTasks() {
    try {
        const response = await makeRequest('/api/tasks');
        const passed = response.status === 200;
        logTest('GET Tasks', passed, 
            passed ? 'Retrieved tasks data' : 'Failed to get tasks',
            response);
        return response.data || [];
    } catch (error) {
        logTest('GET Tasks', false, `Error: ${error.message}`);
        return [];
    }
}

async function testCreateTask(mapId) {
    try {
        const taskData = {
            mapId: mapId || '507f1f77bcf86cd799439011', // For validation
            maps: mapId || '507f1f77bcf86cd799439011', // For controller
            taskKey: `TEST_TASK_${Date.now()}`,
            name: `TestTask_${Date.now()}`,
            type: 'short', // valid type: short, long, or medium
            location: 'Cafeteria'
        };
        
        const response = await makeRequest('/api/tasks/create', 'POST', taskData);
        const passed = response.status === 201 || response.status === 200;
        logTest('POST Create Task', passed, 
            passed ? `Created task: ${taskData.name}` : 'Failed to create task',
            response);
        return passed ? response.data : null;
    } catch (error) {
        logTest('POST Create Task', false, `Error: ${error.message}`);
        return null;
    }
}

async function testGetGames() {
    try {
        const response = await makeRequest('/api/games');
        const passed = response.status === 200;
        logTest('GET Games', passed, 
            passed ? 'Retrieved games data' : 'Failed to get games',
            response);
        return response.data || [];
    } catch (error) {
        logTest('GET Games', false, `Error: ${error.message}`);
        return [];
    }
}

async function testCreateGame(mapId) {
    try {
        // First, get a valid player ID to use as hostId and playerIds
        const playersResponse = await makeRequest('/api/player/getAllPlayer');
        let hostId = '507f1f77bcf86cd799439011'; // fallback
        let playerIds = ['507f1f77bcf86cd799439011']; // fallback
        
        if (playersResponse.status === 200 && playersResponse.data.length > 0) {
            hostId = playersResponse.data[0]._id || playersResponse.data[0].id;
            playerIds = [hostId];
            if (playersResponse.data.length > 1) {
                playerIds.push(playersResponse.data[1]._id || playersResponse.data[1].id);
            }
        }        const gameData = {
            mapId: mapId || '507f1f77bcf86cd799439011', // For validation
            maps: mapId || '507f1f77bcf86cd799439011', // For controller
            hostId: hostId,
            playerIds: playerIds
        };
        
        const response = await makeRequest('/api/games/create', 'POST', gameData);
        const passed = response.status === 201 || response.status === 200;
        logTest('POST Create Game', passed, 
            passed ? `Created game successfully` : 'Failed to create game',
            response);
        return passed ? response.data : null;
    } catch (error) {
        logTest('POST Create Game', false, `Error: ${error.message}`);
        return null;
    }
}

async function testGetSabotage() {
    try {
        const response = await makeRequest('/api/sabotage');
        const passed = response.status === 200;
        logTest('GET Sabotage', passed, 
            passed ? 'Retrieved sabotage data' : 'Failed to get sabotage',
            response);
        return response.data || [];
    } catch (error) {
        logTest('GET Sabotage', false, `Error: ${error.message}`);
        return [];
    }
}

async function testCreateSabotage(mapId) {
    try {
        // Get a valid map ID from the available maps
        const mapsResponse = await makeRequest('/api/maps');
        let validMapId = mapId;
        
        if (mapsResponse.status === 200 && mapsResponse.data.length > 0) {
            // Use the first available map
            validMapId = mapsResponse.data[0]._id || mapsResponse.data[0].id || mapId;
        }        const sabotageData = {
            name: `TestSabotage_${Date.now()}`,
            mapId: validMapId || '507f1f77bcf86cd799439011', // For validation
            maps: validMapId || '507f1f77bcf86cd799439011', // For controller
            type: 'lights', // Add required fields
            location: 'Electrical'
        };
        
        const response = await makeRequest('/api/sabotage', 'POST', sabotageData);
        const passed = response.status === 201 || response.status === 200;
        logTest('POST Create Sabotage', passed, 
            passed ? `Created sabotage: ${sabotageData.name}` : `Failed to create sabotage (mapId: ${validMapId})`,
            response);
        return passed ? response.data : null;
    } catch (error) {
        logTest('POST Create Sabotage', false, `Error: ${error.message}`);
        return null;
    }
}

async function testOtherEndpoints() {
    const endpoints = [
        { path: '/api/playertasks', name: 'GET Player Tasks' },
        { path: '/api/kills', name: 'GET Kills' },
        { path: '/api/meetings', name: 'GET Meetings' },
        { path: '/api/reports', name: 'GET Reports' },
        { path: '/api/votes', name: 'GET Votes' }
    ];

    for (const endpoint of endpoints) {
        try {
            const response = await makeRequest(endpoint.path);
            const passed = response.status === 200;
            logTest(endpoint.name, passed, 
                passed ? 'Retrieved data successfully' : 'Failed to retrieve data',
                response);
            await wait(100); // Small delay between requests
        } catch (error) {
            logTest(endpoint.name, false, `Error: ${error.message}`);
        }
    }
}

// Main test runner
async function runAllTests() {
    console.log('🚀 Starting Comprehensive Among Us API Test Suite');
    console.log('=' .repeat(60));
    
    const startTime = Date.now();
    
    // Test 1: Basic connectivity and player operations
    console.log('\n📋 Testing Player Management...');
    const players = await testGetAllPlayers();
    await wait(500);
    
    const newPlayer = await testCreatePlayer();
    await wait(500);
    
    if (newPlayer && newPlayer.id) {
        await testUpdatePlayerCosmetics(newPlayer.id);
        await wait(500);
        await testUpdatePlayerNameEmail(newPlayer.id);
        await wait(500);
    }
    
    // Test 2: Maps
    console.log('\n🗺️  Testing Maps...');
    const maps = await testGetMaps();
    await wait(500);
    
    const newMap = await testCreateMap();
    await wait(500);
      // Test 3: Tasks
    console.log('\n📝 Testing Tasks...');
    const tasks = await testGetTasks();
    await wait(500);
      // Use real map ID if available
    let actualMapId = null;
    if (newMap?.id) {
        actualMapId = newMap.id;
    } else if (newMap?._id) {
        actualMapId = newMap._id;
    } else if (maps.length > 0 && (maps[0].id || maps[0]._id)) {
        actualMapId = maps[0].id || maps[0]._id;
    }
    
    await testCreateTask(actualMapId);
    await wait(500);
      // Test 4: Games
    console.log('\n🎮 Testing Games...');
    const games = await testGetGames();
    await wait(500);
    
    await testCreateGame(actualMapId);
    await wait(500);
    
    // Test 5: Sabotage
    console.log('\n💥 Testing Sabotage...');
    const sabotage = await testGetSabotage();
    await wait(500);
    
    await testCreateSabotage(actualMapId);
    await wait(500);
    
    // Test 6: Other endpoints
    console.log('\n🔍 Testing Other Endpoints...');
    await testOtherEndpoints();
    
    // Results summary
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    console.log('\n' + '=' .repeat(60));
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('=' .repeat(60));
    console.log(`⏱️  Total time: ${duration.toFixed(2)} seconds`);
    console.log(`✅ Passed: ${testResults.passed}`);
    console.log(`❌ Failed: ${testResults.failed}`);
    console.log(`📈 Total: ${testResults.total}`);
    console.log(`📊 Success rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);
    
    if (testResults.failed > 0) {
        console.log('\n❌ Failed Tests:');
        testResults.details
            .filter(test => !test.passed)
            .forEach(test => {
                console.log(`   • ${test.name}: ${test.message}`);
            });
    }
    
    console.log('\n🏁 Test suite completed!');
    
    // Return results for potential further processing
    return testResults;
}

// Run the tests
runAllTests().catch(error => {
    console.error('💥 Test suite crashed:', error);
    process.exit(1);
});
