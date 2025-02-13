
// This runs as soon as the HTML Loads
// document.addEventListener("DOMContentLoaded", function() {
//     console.log("DOM fully loaded and parsed");
//     // Your code here
//     fetchAndDisplayImage("rightData","rightImage");
//     fetchAndDisplayImage("leftData","leftImage");
// });

fetchAndDisplayImage("rightData","rightImage");
fetchAndDisplayImage("leftData","leftImage");

// Clear the counter
resetCounter("rightVotes")
resetCounter("leftVotes")

async function submitButtonPressed() {
    // Determine which image won by comparing the counters
    const rightVotes = getCounter("rightVotes");
    const leftVotes = getCounter("leftVotes");

    let winningImageId;
    if (rightVotes > leftVotes) {
        winningImageId = "rightImage";
    } else if (leftVotes > rightVotes) {
        winningImageId = "leftImage";
    } else {
        console.warn("[WARNING] No winner - it's a tie.");
        alert("It's a tie! No winner selected.");
        return; // Stop execution if there's a tie
    }

    // Get the winning image URL
    const winningImageElement = document.getElementById(winningImageId);
    if (!winningImageElement || !winningImageElement.src) {
        console.error("[ERROR] Winning image not found.");
        alert("Error: Winning image not found.");
        return;
    }

    const winningImageUrl = winningImageElement.src;

    // Send the winning image URL to the server
    try {
        const response = await fetch("http://localhost:3000/api/submitwinner", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ winningImageUrl })
        });

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        console.log(`[INFO] Winning image successfully submitted: ${winningImageUrl}`);
        // alert("Winning image submitted successfully!");

        // Redirect to next page
        location.href = 'results.html';
    } catch (error) {
        console.error("[ERROR] Failed to submit winning image:", error);
        alert("Error submitting winning image. Please try again.");
    }


}

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

// Function to get the current counter value
function getCounter(counterName) {
    let counters = JSON.parse(localStorage.getItem("counters")) || {};
    return counters[counterName] || 0; // Return the counter value or 0 if it doesn't exist
}

// Function to reset a specific counter or all counters
function resetCounter(counterName = null) {
    let counters = JSON.parse(localStorage.getItem("counters")) || {};

    if (counterName) {
        // Reset a specific counter
        counters[counterName] = 0;
        console.log(`[INFO] Counter '${counterName}' reset.`);
    } else {
        // Reset all counters
        counters = {};
        console.log("[INFO] All counters reset.");
    }

    // Save updated counters back to localStorage
    localStorage.setItem("counters", JSON.stringify(counters));

    // Update the UI
    document.getElementById("rightVoteCount").textContent = getCounter("rightVotes");
    document.getElementById("leftVoteCount").textContent = getCounter("leftVotes");

    // Hide the count text
    document.getElementById("rightVoteCount").style.display = "none";
    document.getElementById("leftVoteCount").style.display = "none";
}


// Event listeners for the buttons
document.addEventListener("DOMContentLoaded", function () {

    // Link the submit button
    document.getElementById("submitVoteButton").addEventListener("click", submitButtonPressed);

    // Link the vote buttons
    document.getElementById("rightVoteButton").addEventListener("click", function () {

        incrementCounter("rightVotes");

        // Show the text if it's hidden
        document.getElementById("rightVoteCount").style.display = "block";
        document.getElementById("rightVoteCount").textContent = getCounter("rightVotes") || 0;
    });

    document.getElementById("leftVoteButton").addEventListener("click", function () {

        incrementCounter("leftVotes");
        // Show the text if it's hidden
        document.getElementById("leftVoteCount").style.display = "block";
        document.getElementById("leftVoteCount").textContent = getCounter("leftVotes") || 0;
    });
});