import fetch from 'node-fetch';

// Replace this with your actual API key
const PEXELS_API_KEY = "bjSeINMYEcow7WlfCPpye44FXQOmBaUxpSoHJKlaWWSpVzJFy37KmTNL";
const PEXELS_API_URL = "https://api.pexels.com/v1/search";

async function fetchPexelsImages(query, perPage = 10) {
    const headers = {
        "Authorization": PEXELS_API_KEY
    };
    const params = new URLSearchParams({
        query: query,
        per_page: perPage
    });

    try {
        const response = await fetch(`${PEXELS_API_URL}?${params.toString()}`, { headers });
        if (!response.ok) {
            console.error(`Error: ${response.status} - ${response.statusText}`);
            return null;
        }

        const data = await response.json();
        return data.photos;
    } catch (error) {
        console.error("Request failed:", error);
        return null;
    }
}

function printResults(photos) {
    if (photos && photos.length > 0) {
        photos.forEach((photo, index) => {
            console.log(`${index + 1}. Photographer: ${photo.photographer}`);
            console.log(`   URL: ${photo.url}`);
            console.log(`   Image: ${photo.src.medium}`);
            console.log("-".repeat(50));
        });
    } else {
        console.log("No results found.");
    }
}

(async () => {
    const readline = await import("node:readline/promises");
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const searchQuery = await rl.question("Enter search term: ");
    const photos = await fetchPexelsImages(searchQuery);
    printResults(photos);

    rl.close();
})();