// Store original text inputs globally
let state = 0;
let originalInputs = {};

async function handleSubmit() {
    // Get text box elements
    const leftInput = document.getElementById("leftInput");
    const rightInput = document.getElementById("rightInput");

    // Get text in elements
    const leftText = leftInput.value.trim();
    const rightText = rightInput.value.trim();

    if (!leftText || !rightText) {
        alert("Please enter text in both fields.");
        return;
    }

    try {
        // Fetch data for both inputs concurrently
        const [leftData, rightData] = await Promise.all([
            fetchData(leftText),
            fetchData(rightText)
        ]);

        // Replace text inputs with random images
        replaceInputWithImage(leftInput, leftData.photos, "leftResults");
        replaceInputWithImage(rightInput, rightData.photos, "rightResults");

    } catch (error) {
        console.error("Error fetching images:", error);
        alert("Failed to fetch images.");
    }
}

// Helper function to fetch data from the server
async function fetchData(query) {
    try {
        const response = await fetch(`http://localhost:3000/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.status}`);
        }
        if (response.status != 200) {
            alert('Server Error')
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
        return { photos: [] }; // Return an empty result set on failure
    }
}

// Function to replace text boxes with random images
function replaceInputWithImage(inputElement, photos, containerId) {
    if (!Array.isArray(photos) || photos.length === 0) {
        alert("No images found.");
        return;
    }

    // Pick a random photo
    const randomIndex = Math.floor(Math.random() * photos.length);
    const photo = photos[randomIndex];

    if (!photo || !photo.src || !photo.src.medium) {
        console.warn("Invalid photo object:", photo);
        return;
    }

    // Store the original input element before replacing
    originalInputs[inputElement.id] = inputElement.cloneNode(true);

    // Create an image element
    const imgElement = document.createElement("img");
    imgElement.src = photo.src.medium;
    imgElement.alt = photo.photographer || "Generated Image";
    imgElement.classList.add("photo");
    imgElement.dataset.inputId = inputElement.id; // Store the original ID

    // Replace input with the image
    inputElement.replaceWith(imgElement);
}

// Function to restore original input fields when clicking "Next"
function restoreInputs() {
    Object.keys(originalInputs).forEach(id => {
        const imageElement = document.querySelector(`img[data-input-id="${id}"]`);
        if (imageElement) {
            imageElement.replaceWith(originalInputs[id]); // Restore original input field
        }
    });

    // Clear stored inputs to allow re-submission
    originalInputs = {};
}