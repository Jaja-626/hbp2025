// import dotenv from 'dotenv';

// dotenv.config();
// console.log(process.env) // remove this after you've confirmed it is working

// const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
// const PEXELS_API_URL = "https://api.pexels.com/v1/search";

async function searchPhotos() {
    const query = document.getElementById("searchQuery").value.trim();
    if (!query) {
        alert("Please enter a search term.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/search?q=${query}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        displayResults(data.photos);
    } catch (error) {
        console.error("Error fetching images:", error);
        alert("Failed to fetch images.");
    }
}

function displayResults(photos) {
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = "";

    if (photos.length === 0) {
        resultsContainer.innerHTML = "<p>No images found.</p>";
        return;
    }

    photos.forEach(photo => {
        const imgElement = document.createElement("img");
        imgElement.src = photo.src.medium;
        imgElement.alt = photo.photographer;
        imgElement.classList.add("photo");

        const photoLink = document.createElement("a");
        photoLink.href = photo.url;
        photoLink.target = "_blank";
        photoLink.appendChild(imgElement);

        resultsContainer.appendChild(photoLink);
    });
}