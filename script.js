// Store original text inputs globally
let state = 0;
let originalInputs = {};

async function handleSubmit() {
    console.log("[DEBUG] handleSubmit() triggered.");

    // Get text box elements
    const leftInput = document.getElementById("leftInput");
    const rightInput = document.getElementById("rightInput");

    // Get text in elements
    const leftText = leftInput.value.trim();
    const rightText = rightInput.value.trim();

    console.log(`[DEBUG] leftText: "${leftText}", rightText: "${rightText}"`);

    if (!leftText || !rightText) {
        console.warn("[WARNING] One or both text inputs are empty.");
        alert("Please enter text in both fields.");
        return;
    }

    try {
        console.log("[DEBUG] Sending text to server...");
        
        // Send both texts to the server
        await Promise.all([
            sendPictureTextToServer("leftData", leftText),
            sendPictureTextToServer("rightData", rightText)
        ]);

        console.log("[DEBUG] Data successfully sent to server. Proceeding to next page...");

    } catch (error) {
        console.error("[ERROR] Failed to send data to server:", error);
        alert("Failed to fetch images.");
        return;
    }

    // GO TO NEXT PAGE LINE OF CODE GOES HERE
    console.log("[DEBUG] Redirecting to vote.html...");
    window.location.href = "vote.html";
}


// Sends given data (parameter name and image name) to server.
async function sendPictureTextToServer(parameterName, imageName) {
    try {
        const response = await fetch("http://localhost:3000/api/submitphotos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ parameterName, imageName })
        });

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        console.log(`Successfully sent ${parameterName}: ${imageName} to server.`);
    } catch (error) {
        console.error(`Error sending ${parameterName}: ${imageName} to server:`, error);
    }
}


// Helper function to fetch data from the server
// async function fetchData(query) {
//     try {
//         const response = await fetch(`http://localhost:3000/search?q=${encodeURIComponent(query)}`);
//         if (!response.ok) {
//             throw new Error(`Error fetching data: ${response.status}`);
//         }
//         if (response.status != 200) {
//             alert('Server Error')
//         }
//         return await response.json();
//     } catch (error) {
//         console.error("Error fetching data:", error);
//         return { photos: [] }; // Return an empty result set on failure
//     }
// }

// // Function to replace text boxes with random images
// function replaceInputWithImage(inputElement, photos, containerId) {
//     if (!Array.isArray(photos) || photos.length === 0) {
//         alert("No images found.");
//         return;
//     }

//     // Pick a random photo
//     const randomIndex = Math.floor(Math.random() * photos.length);
//     const photo = photos[randomIndex];

//     if (!photo || !photo.src || !photo.src.medium) {
//         console.warn("Invalid photo object:", photo);
//         return;
//     }

//     // Store the original input element before replacing
//     originalInputs[inputElement.id] = inputElement.cloneNode(true);

//     // Create an image element
//     const imgElement = document.createElement("img");
//     imgElement.src = photo.src.medium;
//     imgElement.alt = photo.photographer || "Generated Image";
//     imgElement.classList.add("photo");
//     imgElement.dataset.inputId = inputElement.id; // Store the original ID

//     // Replace input with the image
//     inputElement.replaceWith(imgElement);
// }

// // Function to restore original input fields when clicking "Next"
// function restoreInputs() {
//     Object.keys(originalInputs).forEach(id => {
//         const imageElement = document.querySelector(`img[data-input-id="${id}"]`);
//         if (imageElement) {
//             imageElement.replaceWith(originalInputs[id]); // Restore original input field
//         }
//     });

//     // Clear stored inputs to allow re-submission
//     originalInputs = {};
// }