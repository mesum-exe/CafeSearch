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
