

// Fetches the winning image URL and name from the server and updates the UI
fetchAndDisplayWinnerImage();

async function fetchAndDisplayWinnerImage() {
    try {
        const imageUrl = "http://localhost:3000/api/getwinningimageurl";

        // Fetch the winning image data from the API
        const response = await fetch(imageUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch winning image. Server responded with status: ${response.status}`);
        }

        // Extract the JSON response
        const data = await response.json();
        console.log("[DEBUG] Fetching winning image data from localStorage and API...");

        if (!data.winningImageUrl) {
            console.error("[ERROR] No winning image URL returned from the server.");
            throw new Error(`No winning image URL returned.`);
        }

        console.log(`[INFO] Winning Image URL retrieved: ${data.winningImageUrl}`);
        console.log(`[INFO] Winning Image Name retrieved from server: ${data.imageName}`);

        // Get stored data from localStorage
        let storedData = JSON.parse(localStorage.getItem("imageData")) || {};
        console.log("[DEBUG] Retrieved stored data from localStorage:", storedData);

        let winningImageName = data.imageName || "Unknown Winner"; // Use the server's provided name
        console.log(`[INFO] Final winning image name determined: ${winningImageName}`);

        // Update the image element
        const imageElement = document.getElementById("winnerImage");
        if (!imageElement) {
            console.error("[ERROR] Element with ID 'winnerImage' not found in DOM.");
            return;
        }
        imageElement.src = data.winningImageUrl;
        console.log(`[INFO] Displaying winning image at ${data.winningImageUrl}`);

        // Update the H2 text with the winning image name
        const textElement = document.getElementById("winnerText");
        if (textElement) {
            textElement.textContent = winningImageName || "Unknown Winner";
            console.log(`[INFO] Updated winner text: ${winningImageName}`);
        } else {
            console.error("[ERROR] Element with ID 'winnerText' not found in DOM.");
        }

    } catch (error) {
        console.error("[ERROR] Failed to fetch winning image:", error);
    }
}

// Add event listener to restart button
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("restartButton").addEventListener("click", function () {
        window.location.href = "index.html"; // Redirect to index.html
    });
});