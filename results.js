

// Fetches the winning image URL from the server and displays it in the 'winnerImage' element.
fetchAndDisplayWinnerImage();

async function fetchAndDisplayWinnerImage() {
    try {
        const imageUrl = "http://localhost:3000/api/getwinningimageurl";

        // Fetch the winning image URL from the API
        const response = await fetch(imageUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch winning image. Server responded with status: ${response.status}`);
        }

        // Extract the image URL from the JSON response
        const data = await response.json();
        if (!data.winningImageUrl) {
            throw new Error(`No winning image URL returned.`);
        }

        // Find the image element
        const imageElement = document.getElementById("winnerImage");
        if (!imageElement) {
            console.error(`[ERROR] Element with ID 'winnerImage' not found.`);
            return;
        }

        // Set the image source correctly
        imageElement.src = data.winningImageUrl;
        console.log(`[INFO] Displaying winning image at ${data.winningImageUrl}`);

    } catch (error) {
        console.error("[ERROR] Failed to fetch winning image:", error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("restartButton").addEventListener("click", function () {
        window.location.href = "index.html"; // Redirect to index.html
    });
});