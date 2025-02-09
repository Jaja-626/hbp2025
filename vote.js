
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
// // Example usage: Call this function with a parameter name and an HTML element ID
// fetchAndDisplayImage("exampleImage", "imageContainer");