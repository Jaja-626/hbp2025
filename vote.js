
// This runs as soon as the HTML Loads
// document.addEventListener("DOMContentLoaded", function() {
//     console.log("DOM fully loaded and parsed");
//     // Your code here
//     fetchAndDisplayImage("rightData","rightImage");
//     fetchAndDisplayImage("leftData","leftImage");
// });

fetchAndDisplayImage("rightData","rightImage");
fetchAndDisplayImage("leftData","leftImage");

async function fetchAndDisplayImage(parameterName, imageElementId) {
    try {
        const imageUrl = `http://localhost:3000/api/getimage/${parameterName}`;
        
        // Fetch the image URL from the API
        const response = await fetch(imageUrl);

        if (!response.ok) {
            throw new Error(`Image not found for parameter: ${parameterName}`);
        }

        // Extract the image URL from the JSON response
        const data = await response.json();
        if (!data.imageUrl) {
            throw new Error(`No image URL returned for parameter: ${parameterName}`);
        }

        // Find the image element
        const imageElement = document.getElementById(imageElementId);
        if (!imageElement) {
            console.error(`[ERROR] Element with ID '${imageElementId}' not found.`);
            return;
        }

        // Set the image source correctly
        imageElement.src = data.imageUrl;
        console.log(`[INFO] Displaying image for ${parameterName} at ${data.imageUrl}`);

    } catch (error) {
        console.error("[ERROR] Failed to fetch image:", error);
    }
}


// Function to increment a counter and store in localStorage
function incrementCounter(counterName) {
    let counters = JSON.parse(localStorage.getItem("counters")) || {};

    // Initialize the counter if it does not exist
    if (!counters[counterName]) {
        counters[counterName] = 0;
    }

    // Increment the counter
    counters[counterName]++;

    // Save updated counters back to localStorage
    localStorage.setItem("counters", JSON.stringify(counters));

    console.log(`[INFO] Counter '${counterName}' incremented to ${counters[counterName]}`);
}

// Event listeners for the buttons
document.addEventListener("DOMContentLoaded", function () {

    

    document.getElementById("rightVoteButton").addEventListener("click", function () {
        incrementCounter("rightVotes");
        document.getElementById("rightVoteCount").textContent = counters["rightVotes"] || 0;
    });

    document.getElementById("leftVoteButton").addEventListener("click", function () {
        incrementCounter("leftVotes");
        document.getElementById("leftVoteCount").textContent = counters["leftVotes"] || 0;
    });
});