# CafeSearch

This is a web application which finds nearby Cafes based on the user's current location and allows the user to save them, in a gamified display using swiping touch gestures (done using Hammer.js). 

Built using this tutorial on Codedex: "Build a Cafe Finder with JavaScript". Shifted the tutorial's Herokuapp proxy dependent architecture into a Google Maps JavaScript SDK-based architecture, which provides a better frontend performance.

## Tech Stack
* **Frontend:** HTML5, CSS3, JavaScript (ES6+)
* **APIs:** Google Maps JS SDK (Places (new) & Geometry Libraries)
* **Interactions:** Hammer.js (Touch Gestures)

## Setup

1. **Google Cloud Console:** Ensure Places (new) is enabled on your Google Maps Cloud API.

2. **Local Config:** Create a "config.js" file in the root directory, and add the following code to it (using your own API key):
```js 
const CONFIG = {
  API_KEY: "INSERT_YOUR_API_KEY_HERE"
);
```
