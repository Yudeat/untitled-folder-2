

let isTyping = false;

let selectedAirport = null;

const outputDiv = document.getElementById('game-output');
const inputContainer = document.getElementById('game-input-container');

// --- Rare Birds & Basic Bird ---
const RARE_BIRDS = [
    { name: 'Saker Falcon', score_bonus: 500, money_bonus: 300, description: "A large, powerful falcon known for its long-distance migrations and scarcity in Northern Europe." },
    { name: 'Great Snipe', score_bonus: 300, money_bonus: 150, description: "A secretive migratory wader, difficult to spot, famed for its elaborate, Lek-based courtship displays." },
    { name: 'White-tailed Eagle', score_bonus: 750, money_bonus: 500, description: "The largest eagle in Northern Europe, often found near coasts and lakes, a symbol of wild, untamed nature." },
    { name: 'Golden Eagle', score_bonus: 700, money_bonus: 450, description: "A majestic predator of cliffs and mountains, rarely seen close to humans." },
    { name: 'Peregrine Falcon', score_bonus: 650, money_bonus: 400, description: "Famed for its incredible diving speed, a top aerial predator." },
    { name: 'Osprey', score_bonus: 400, money_bonus: 250, description: "A fish-eating raptor, found near lakes and rivers, striking in flight." },
    { name: 'European Honey Buzzard', score_bonus: 350, money_bonus: 200, description: "A migratory bird, feeding mostly on wasp larvae, elusive and rare." },
    { name: 'Black Stork', score_bonus: 500, money_bonus: 300, description: "A shy wader, black plumage with red beak and legs, seen in secluded wetlands." },
    { name: 'Red Kite', score_bonus: 300, money_bonus: 180, description: "Graceful scavenger with reddish-brown plumage and forked tail." },
    { name: 'Northern Goshawk', score_bonus: 550, money_bonus: 320, description: "A fierce woodland hunter, rarely spotted by casual birdwatchers." },
    { name: 'Eurasian Griffon Vulture', score_bonus: 600, money_bonus: 350, description: "A massive vulture, soaring on thermal currents, often in groups." },
    { name: 'White Stork', score_bonus: 250, money_bonus: 120, description: "Migratory stork, often nesting near human settlements." },
    { name: 'Red-footed Falcon', score_bonus: 450, money_bonus: 280, description: "A small, fast falcon with striking red legs, rare in Northern Europe." },
    { name: 'Rough-legged Buzzard', score_bonus: 400, money_bonus: 230, description: "A hawk of open fields, with feathered legs adapted to cold climates." },
    { name: 'Eurasian Eagle-Owl', score_bonus: 700, money_bonus: 400, description: "Huge nocturnal predator, silent in flight and highly elusive." },
    { name: 'Bearded Vulture', score_bonus: 650, money_bonus: 380, description: "A scavenger with dramatic appearance, feeding mostly on bones." },
    { name: 'Lesser Spotted Eagle', score_bonus: 480, money_bonus: 280, description: "A rare migratory eagle of European forests." },
    { name: 'Northern Lapwing', score_bonus: 320, money_bonus: 150, description: "A wader with striking crest and dramatic flight displays." },
    { name: 'Black-winged Stilt', score_bonus: 300, money_bonus: 140, description: "A tall, delicate wader with long red legs, found in wetlands." },
    { name: 'European Roller', score_bonus: 350, money_bonus: 200, description: "A colorful bird with striking blue wings, migratory and rare." },
    { name: 'Common Crane', score_bonus: 400, money_bonus: 220, description: "A tall, elegant migratory bird with loud calls, seen in wetlands." },
    { name: 'White-backed Woodpecker', score_bonus: 450, money_bonus: 250, description: "Rare woodland woodpecker, feeding on insect larvae in dead trees." },
    { name: 'Black Woodpecker', score_bonus: 500, money_bonus: 280, description: "Largest European woodpecker, elusive in deep forests." },
    { name: 'Golden Pheasant', score_bonus: 350, money_bonus: 180, description: "Strikingly colorful pheasant, rarely seen in wild." },
    { name: 'Common Kingfisher', score_bonus: 300, money_bonus: 150, description: "Tiny, fast bird, brilliant blue plumage, hunts along rivers." },
    { name: 'Eurasian Hoopoe', score_bonus: 280, money_bonus: 130, description: "Distinctive crown and calls, rare in Northern Europe." },
    { name: 'Barred Warbler', score_bonus: 250, money_bonus: 120, description: "Small, secretive passerine with barred plumage." },
    { name: 'Grey-headed Woodpecker', score_bonus: 300, money_bonus: 140, description: "Uncommon forest bird, striking green body and grey head." },
    { name: 'White-backed Vulture', score_bonus: 600, money_bonus: 350, description: "Large scavenger, soaring silently over plains." },
    { name: 'Black-crowned Night Heron', score_bonus: 400, money_bonus: 220, description: "Nocturnal heron, often near wetlands, stealthy and rare." }
];

const BASIC_BIRD_DATA = [
    { name: 'Eurasian Eagle-Owl (Basic)', score: 50, money: 10, description: "A large nocturnal predator often found near airfields." },
    { name: 'Barn Swallow', score: 20, money: 5, description: "Common migratory bird, often seen near farms." },
    { name: 'House Sparrow', score: 10, money: 2, description: "Tiny bird, ubiquitous near human settlements." },
    { name: 'Common Pheasant', score: 25, money: 8, description: "Ground bird, common in fields." },
    { name: 'Woodpigeon', score: 15, money: 4, description: "Common pigeon in Europe, found in towns and farmland." },
    { name: 'Common Blackbird', score: 18, money: 6, description: "Widespread forest and garden bird, singing at dawn." },
    { name: 'European Robin', score: 20, money: 5, description: "Small red-breasted bird, common in gardens." },
    { name: 'Eurasian Blue Tit', score: 15, money: 4, description: "Tiny blue and yellow bird, very active and easy to spot." },
    { name: 'Great Tit', score: 18, money: 5, description: "Common forest and garden bird, bold and curious." },
    { name: 'Chaffinch', score: 20, money: 6, description: "Colorful finch, common in woodlands and parks." },
    { name: 'European Goldfinch', score: 25, money: 7, description: "Brightly colored finch, often feeding on thistles." },
    { name: 'Eurasian Nuthatch', score: 22, money: 6, description: "Small forest bird, climbs tree trunks headfirst." },
    { name: 'Common Swift', score: 20, money: 5, description: "Fast-flying aerial insectivore, rarely perched." },
    { name: 'Eurasian Wren', score: 15, money: 3, description: "Tiny secretive bird, with loud song for its size." },
    { name: 'European Greenfinch', score: 18, money: 4, description: "Green and yellow finch, common in towns and gardens." },
    { name: 'Eurasian Treecreeper', score: 20, money: 5, description: "Climbs trees searching for insects." },
    { name: 'Common Starling', score: 15, money: 4, description: "Medium bird, often in flocks near human settlements." },
    { name: 'Common Magpie', score: 22, money: 6, description: "Black-and-white bird, intelligent and curious." },
    { name: 'Eurasian Jay', score: 25, money: 8, description: "Colorful crow-like bird, secretive in forests." },
    { name: 'Common Woodcock', score: 20, money: 6, description: "Wader found in forests, feeds at night." },
    { name: 'Northern Lapwing (Basic)', score: 18, money: 5, description: "Common wader, known for its display flight." },
    { name: 'Eurasian Oystercatcher', score: 20, money: 6, description: "Shorebird with striking black and white plumage." },
    { name: 'Common Kestrel', score: 25, money: 8, description: "Small falcon, hunting rodents and insects." },
    { name: 'Eurasian Skylark', score: 22, money: 6, description: "Famous for its singing flight in open fields." },
    { name: 'Common Redstart', score: 18, money: 5, description: "Migratory bird, striking orange tail and chest." },
    { name: 'Tree Sparrow', score: 15, money: 4, description: "Small bird, often in woodland edges and farmland." },
    { name: 'Eurasian Reed Warbler', score: 20, money: 5, description: "Lives near reed beds, insectivorous and secretive." },
    { name: 'Common Snipe', score: 18, money: 5, description: "Wetland bird, camouflaged and difficult to spot." },
    { name: 'Common Redpoll', score: 15, money: 4, description: "Small finch with red markings on head." }
];


// --- Airports Data ---
const ALL_AIRPORTS = [
    { index: 1, ident: 'EFET', name: 'Eura Airport', iso_country: 'FI', lon: 22.00, lat: 60.00 },
    { index: 2, ident: 'EFSA', name: 'Satakunta Air', iso_country: 'FI', lon: 23.00, lat: 61.00 },
    { index: 3, ident: 'ESTA', name: 'Stockholm Arlanda', iso_country: 'SE', lon: 17.92, lat: 59.65 },
    { index: 4, ident: 'ESDF', name: 'Skavsta Airport', iso_country: 'SE', lon: 16.90, lat: 58.78 },
    { index: 5, ident: 'EFHK', name: 'Helsinki Vantaa', iso_country: 'FI', lon: 24.96, lat: 60.32 },
    { index: 6, ident: 'EDDM', name: 'Munich Airport', iso_country: 'DE', lon: 11.78, lat: 48.35 },
    { index: 7, ident: 'ESSB', name: 'Stockholm-Bromma', iso_country: 'SE', lon: 17.94, lat: 59.35 },
    { index: 8, ident: 'ESOW', name: 'Örebro Airport', iso_country: 'SE', lon: 15.03, lat: 59.22 },
    { index: 9, ident: 'ESMS', name: 'Malmö Airport', iso_country: 'SE', lon: 13.37, lat: 55.54 },
    { index: 10, ident: 'EKCH', name: 'Copenhagen Airport', iso_country: 'DK', lon: 12.65, lat: 55.62 },
    { index: 11, ident: 'EETN', name: 'Tallinn Airport', iso_country: 'EE', lon: 24.83, lat: 59.41 },
    { index: 12, ident: 'EFMA', name: 'Helsinki-Malmi', iso_country: 'FI', lon: 25.04, lat: 60.25 },
    { index: 13, ident: 'EFTU', name: 'Turku Airport', iso_country: 'FI', lon: 22.27, lat: 60.51 },
    { index: 14, ident: 'EFTP', name: 'Tampere-Pirkkala', iso_country: 'FI', lon: 23.60, lat: 61.49 },
    { index: 15, ident: 'EDDS', name: 'Stuttgart Airport', iso_country: 'DE', lon: 9.22, lat: 48.69 },
    { index: 16, ident: 'EDDN', name: 'Nuremberg Airport', iso_country: 'DE', lon: 11.07, lat: 49.49 },
    { index: 17, ident: 'EDJA', name: 'Memmingen Airport', iso_country: 'DE', lon: 10.23, lat: 48.05 },
    { index: 18, ident: 'LSZH', name: 'Zurich Airport', iso_country: 'CH', lon: 8.54, lat: 47.46 },
    { index: 19, ident: 'LOWW', name: 'Vienna Airport', iso_country: 'AT', lon: 16.57, lat: 48.11 },
    { index: 20, ident: 'LKPR', name: 'Prague Václav Havel', iso_country: 'CZ', lon: 14.26, lat: 50.10 },
    { index: 21, ident: 'EIDW', name: 'Dublin Airport', iso_country: 'IE', lon: -6.24, lat: 53.42 },
];

// --- Shop & Equipment ---
const RANGE_RATE = 2; 
const EQUIPMENT_LIST = [
    { id: 1, name: 'Wing Extension Tier 1', cost: 25, range_boost: 50, description: "Permanently increases flight range by 50 km." },
    { id: 2, name: 'Engine Refit Tier 2', cost: 50, range_boost: 100, description: "Permanently increases flight range by 100 km." },
];


function typeMessage(message, delay = 25) {
    return new Promise(resolve => {
        isTyping = true;
        const p = document.createElement('p');
        outputDiv.appendChild(p);
        outputDiv.scrollTop = outputDiv.scrollHeight;

        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        p.appendChild(cursor);

        let i = 0;
        function typeChar() {
            if (i < message.length) {
                p.textContent = message.substring(0, i + 1);
                p.appendChild(cursor);
                outputDiv.scrollTop = outputDiv.scrollHeight;
                i++;
                setTimeout(typeChar, delay);
            } else {
                isTyping = false;
                cursor.remove();
                resolve();
            }
        }
        typeChar();
    });
}

async function appendMessage(message, className = '') {
    if (className.includes('table')) {
        outputDiv.innerHTML += `<div class="${className}">${message}</div>`;
        outputDiv.scrollTop = outputDiv.scrollHeight;
    } else {
        await typeMessage(message);
    }
}

function clearInput() { inputContainer.innerHTML = ''; }
function clearOutput() { outputDiv.innerHTML = ''; }

function updatePlayerResources() {
    document.getElementById('history-item').title = `Travel History: ${gameState.history.length || 0} flights`;
    document.getElementById('airports-item').title = `Score: ${gameState.score || 'N/A'}`;
    document.getElementById('you-item').title = `Range: ${gameState.player_range || 'N/A'} km`;
    document.getElementById('achievement-item').title = `Score: ${gameState.score || 'N/A'}`;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}


async function simulateStartGame(playerName) {
    const finalName = playerName || "Hunter1";
    const randomAirport = ALL_AIRPORTS[Math.floor(Math.random() * ALL_AIRPORTS.length)];

    gameState = {
        screen_name: finalName,
        money: 100,
        player_range: 100,
        score: 0,
        location: randomAirport.ident,
        lon: randomAirport.lon,
        lat: randomAirport.lat,
        threshold: 5000,
        history: [],
    };

    gameState.history.push({
        destination: randomAirport.name,
        ident: randomAirport.ident,
        country: randomAirport.iso_country,
        date: new Date().toLocaleTimeString(),
        birds_hunted: [],
        score_change: 0,
        money_change: 0,
        travel_distance: 0
    });

    clearOutput();
    await appendMessage("Connection established.");
    await appendMessage(`Welcome, ${finalName}!`);
    await appendMessage(`Starting airport: ${randomAirport.name} (${randomAirport.ident}), ${randomAirport.iso_country}.`);
    await appendMessage(`Money: ${gameState.money.toFixed(2)} €, Max Range: ${gameState.player_range} km.`);
    await appendMessage(`Goal: Reach ${gameState.threshold} Score!`);
    await appendMessage(`\nClick sidebar icons to perform actions.`);
    updatePlayerResources();
}

function startGame(forcedName = "") {
    const storedName = forcedName || localStorage.getItem("playerName");
    const startScreen = document.getElementById('startScreen');
    if (startScreen) startScreen.classList.remove('active');
    simulateStartGame(storedName || "Guest");
}

window.onload = function () {
    const storedName = localStorage.getItem("playerName");
    startGame(storedName || "Guest");
};


async function handleAction(action) {
    if (isTyping) return;
    if (action !== '2' && document.getElementById('mapContainer').style.display === 'block') {
        exitMap(false);
    }

    switch(action) {
        case '0': await showResources(); break;
        case '1': clearInput(); clearOutput(); await showShopMenu(); break;
        case '2': clearInput(); clearOutput(); await showDestinationSelection(); break;
        case '3': clearInput(); clearOutput(); await showHistory(); break;
        default: await appendMessage("Invalid action choice.");
    }
}


async function showShopMenu() {
    await appendMessage("🛒 Welcome to the Equipment Shop!\nAvailable items:");

    // List equipment items
    EQUIPMENT_LIST.forEach(eq => {
        appendMessage(`${eq.id}. ${eq.name} - ${eq.cost} € - ${eq.description}`);
    });

    appendMessage(`R<number>. Buy <number> packs of 2 km range for 1 € each (e.g., R5 for 10 km).`);
    appendMessage("\nEnter item number to purchase, 'R' option to buy range, or 0 to exit.");

    inputContainer.innerHTML = `
        <input type="text" id="shopInput" placeholder="Item number or R" />
        <button onclick="buyItem()">Buy</button>
    `;
}

function buyItem() {
    const input = document.getElementById('shopInput').value.trim().toUpperCase();

    // Exit option
    if (input === '0') {
        appendMessage("Exited shop.");
        clearInput();
        return;
    }

    // Quick range purchase option (e.g., R5)
    if (input.startsWith('R')) {
        const packs = parseInt(input.slice(1));
        if (isNaN(packs) || packs <= 0) {
            appendMessage("Invalid number of range packs.");
            return;
        }
        const cost = packs * 1; 
        if (gameState.money < cost) {
            appendMessage("Not enough money to buy that many range packs.");
            return;
        }
        gameState.money -= cost;
        gameState.player_range += packs * 2; 
        appendMessage(`Purchased ${packs * 2} km range. New range: ${gameState.player_range} km. Money left: ${gameState.money.toFixed(2)} €.`);
        updatePlayerResources();
        return;
    }

    // Equipment purchase
    const choice = parseInt(input);
    const item = EQUIPMENT_LIST.find(eq => eq.id === choice);

    if (!item) {
        appendMessage("Invalid selection.");
        return;
    }
    if (gameState.money < item.cost) {
        appendMessage("Not enough money.");
        return;
    }

    gameState.money -= item.cost;
    gameState.player_range += item.range_boost;
    appendMessage(`Purchased ${item.name}. New range: ${gameState.player_range} km. Money left: ${gameState.money.toFixed(2)} €.`);
    updatePlayerResources();
}



let map;
let airportMarkers = [];

// Game state
let gameState = {
    lat: 0,
    lon: 0,
    location: '',
    score: 0,
    money: 0,
    history: []
};

// Show the map for destination selection
async function showDestinationSelection() {
    document.getElementById('mapContainer').style.display = 'block';
    if (!map) initializeMap();
    await appendMessage("Select a destination airport on the map.");
}

// Initialize the map and pick a random starting airport
function initializeMap() {
    map = L.map('mapContainer').setView([60, 15], 3);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Pick random starting airport
    const startIndex = Math.floor(Math.random() * ALL_AIRPORTS.length);
    const startAirport = ALL_AIRPORTS[startIndex];
    gameState.lat = startAirport.lat;
    gameState.lon = startAirport.lon;
    gameState.location = startAirport.ident;

    updateMapMarkers();
    appendMessage(` Starting at ${startAirport.name} (${startAirport.ident})`);
}

// Update all markers (red = current airport, blue = others)
function updateMapMarkers() {
    // Clear existing markers
    airportMarkers.forEach(marker => map.removeLayer(marker));
    airportMarkers = [];

    ALL_AIRPORTS.forEach(airport => {
        const isCurrent = airport.ident === gameState.location;
        const markerIcon = L.icon({
            iconUrl: isCurrent
                ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png'
                : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            shadowSize: [41, 41]
        });

        const marker = L.marker([airport.lat, airport.lon], { icon: markerIcon }).addTo(map);
        marker.bindPopup(`${airport.name} (${airport.ident})`);
        marker.on('click', () => selectAirport(airport)); 
        airportMarkers.push(marker);
    });
}

// Handle airport selection
function selectAirport(airport) {
    const distance = getDistance(gameState, airport);
    flyToAirport(airport, distance);
}

// Simple distance calculation
function getDistance(from, to) {
    const dx = from.lat - to.lat;
    const dy = from.lon - to.lon;
    return Math.sqrt(dx * dx + dy * dy).toFixed(2);
}

// Fly to airport and handle bird hunting
async function flyToAirport(airport, distance) {
    gameState.lat = airport.lat;
    gameState.lon = airport.lon;
    gameState.location = airport.ident;

    updateMapMarkers(); 

    let birdsFound = [];

    if (Math.random() < 0.7) {
        birdsFound.push(BASIC_BIRD_DATA[Math.floor(Math.random() * BASIC_BIRD_DATA.length)]);
    } else {
        birdsFound.push(RARE_BIRDS[Math.floor(Math.random() * RARE_BIRDS.length)]);
    }

    let scoreChange = 0, moneyChange = 0;
    birdsFound.forEach(bird => {
        scoreChange += bird.score || bird.score_bonus || 0;
        moneyChange += bird.money || bird.money_bonus || 0;
    });

    gameState.score += scoreChange;
    gameState.money += moneyChange;
    gameState.player_range-= distance;

    gameState.history.push({
        destination: airport.name,
        ident: airport.ident,
        country: airport.iso_country,
        date: new Date().toLocaleTimeString(),
        birds_hunted: birdsFound.map(b => b.name),
        score_change: scoreChange,
        money_change: moneyChange,
        travel_distance: distance
    });

    await appendMessage(` Flew to ${airport.name}.`);
    appendMessage('Distance travelled: ' + distance + ' km');
    appendMessage(`Bird encountered: ${birdsFound[0].name}`);
    appendMessage(`${birdsFound[0].description}`)
    appendMessage(`Score +${scoreChange}, Money +${moneyChange.toFixed(2)} €`);
    appendMessage(`Range remaining: ${gameState.player_range} km`);
    updatePlayerResources();
}





async function showHistory() {
    clearOutput();
    appendMessage("📜 Travel History:");
    gameState.history.forEach((h, i) => {
        appendMessage(`${i + 1}. ${h.date} - ${h.destination} - Birds: ${h.birds_hunted.join(', ') || 'None'} - Score: +${h.score_change} - Money: +${h.money_change.toFixed(2)} €`);
    });
}


async function showResources() {
    clearOutput();
    await appendMessage(`💰 Money: ${gameState.money.toFixed(2)} €`);
    await appendMessage(`📏 Max Range: ${gameState.player_range} km`);
    await appendMessage(`🏆 Score: ${gameState.score}`);
    await appendMessage(`📍 Current Airport: ${gameState.location}`);
}


function exitMap(force = true) {
    document.getElementById('mapContainer').style.display = 'none';
    selectedAirport = null;
    if (force) appendMessage("Exited map.");
}


document.querySelectorAll('#game-input-container button').forEach(button => {
    button.addEventListener('click', () => {
        const action = button.dataset.action;
        handleAction(action);
    });
});
