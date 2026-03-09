const apiKey = "STRING_OF_RANDOM_CHARACTERS_HERE"; // unique private api key from google cloud (places api)

const useProxy = true;
const proxy = "https://cors-anywhere.herokuapp.com"; // demo server

function getLocation() {
    const cache = JSON.parse(localStorage.getItem('cachedLocation') || '{}');
    const now = Date.now();

    // checking if location data has been cached
    // AND the data is less than 10 minutes old
    if (cache.timestamp && now - cache.timestamp < 10 * 60 * 1000) {
        useLocation(cache.lat, cache.lng); // in-built JS function
    }

    // if data is too old or is not cached, find location coordinates
    else {
        navigator.geolocation.getCurrentPosition(pos => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        // location is saved to local storage
        localStorage.setItem('cachedLocation', JSON.stringify({ lat, lng, timestamp: now })); 

        useLocation(lat, lng);
        }, () => alert("Location access denied or unavailable."));
    }
}

async function useLocation(lat, lng) {
    // reference the Google Places API using our API key and saved lat and long coords.
    const endpoint = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1500&type=cafe&key=${apiKey}`;
    const url = useProxy ? proxy + endpoint : endpoint; 

    try {
        const response = await fetch(url);  // call api to find nearby cafes and fetch their urls.
        const data = await response.json();
    
        if (data.results) {
            displayCards(data.results);     // if cafes are found, add them to the card display
        } 
        else {
            alert("No cafes found.");
        }
    } 
    catch (e) {
        console.error("Error fetching Places API:", e);
        alert("Error fetching cafes.");
    }
}

// Defining the card display

function displayCards(cafes) {
    const container = document.querySelector('.cards');
    container.innerHTML = ''; // create an empty card

    cafes.forEach((cafe, i) => {
        const wrapper = document.createElement('div'); // new div wraps around every card
        wrapper.className = 'swipe-wrapper';           // class for styling
        wrapper.style.zIndex = 200 - i;                // using z-index makes new cards appear below existing cards

        var newCards = document.querySelectorAll('.location-card:not(.removed)');
        var allCards = document.querySelectorAll('.location-card');
    });

    const card = document.createElement("div");
    card.className = "location-card";

    // adds location information inside each card
    const imgUrl = cafe.photos?.[0]?.photo_reference
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${cafe.photos[0].photo_reference}&key=${apiKey}`
    : "https://via.placeholder.com/250x150?text=No+Image";

    // name, location, photo, rating of every cafe
    const cafeData = { 
        name: cafe.name,
        place_id: cafe.place_id,
        photo: imgUrl,
        rating: cafe.rating || "N/A",
    };

    // display information
    card.innerHTML = `
        <img src="${imgUrl}" alt="${cafe.name}" />
        <h3>${cafe.name}</h3>
        <p>⭐️ Rating: ${cafe.rating || "N/A"}</p>
        <p><small>Swipe right to save 💖</small></p>
        `;

    wrapper.appendChild(card);
    container.appendChild(wrapper);

    // Using the Hammer lib to recognize touch gestures so cards flick and fade when swiped left or right.
    const hammertime = new Hammer(wrapper);
    hammertime.on("swipeleft", () => {
        wrapper.style.transform = "translateX(-150%) rotate(-15deg)";
        wrapper.style.opacity = 0;
        setTimeout(() => wrapper.remove(), 100);
    });
    hammertime.on("swiperight", () => {
        saveCafe(JSON.stringify(cafeData));
        wrapper.style.transform = "translateX(150%) rotate(15deg)";
        wrapper.style.opacity = 0;
        setTimeout(() => wrapper.remove(), 100);
    });
}

// Users swipe left to move to the next card, and swipe right to save the cafe. 
// This gamifies the experience, making it more engaging.

function saveCafe(cafeJSON) {
    // JSON parsing
    const cafe = JSON.parse(cafeJSON); // store string as an object 'cafe'
    let saved = JSON.parse(localStorage.getItem('savedCafes') || '[]'); // parse through cache and store the 'savedCafes' as an array 'saved'
    // For simplicity in this project, we use cache / local storage instead of a database for saving cafes.

    // make sure cafe being saved doesnt already exist in the saved array, using the 'place_id' in the 'cafe' object
    if (!saved.find((c) => c.place_id === cafe.place_id)) { 
        saved.push(cafe);
        localStorage.setItem("savedCafes", JSON.stringify(saved));
        alert(`${cafe.name} saved!`);
    }
    // alert the user otherwise
    else {
        alert(`${cafe.name} is already saved.`);
    }
}

// Use DOM manipulation to add info to the frontend (display cards) from the local storage (saved cafes)
function showSaved() {
    const container = document.querySelector('.cards');
    container.innerHTML = '';   // blank container
    const saved = JSON.parse(localStorage.getItem("savedCafes") || "[]");

    // if 'saved' is empty, add a paragraph informing the user
    if (saved.length === 0) {
        container.innerHTML = "<p>No saved cafes yet 😢</p>";
        return;
    }

    // create a card and add the current cafe's info
    saved.forEach(cafe => {
        const card = document.createElement('div');
        card.className = 'location-card';
        card.innerHTML = `
            <img src="${cafe.photo}" alt="${cafe.name}" />
            <h3>${cafe.name}</h3>
            <p>⭐️ Rating: ${cafe.rating}</p>
        `;
        
        container.appendChild(card);  // add the resulting card to its container
    });
}
        



