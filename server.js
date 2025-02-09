import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'node:path';

dotenv.config();
const app = express();
const PORT = 3000;

app.use(cors()); // Allow requests from frontend
app.use(express.json());

console.log("Starting server...");

// Ensure images directory exists
const IMAGE_DIR = path.join(process.cwd(), 'images');
if (!fs.existsSync(IMAGE_DIR)) {
    fs.mkdirSync(IMAGE_DIR);
}

// Endpoint to retrieve stored image URL
app.get('/api/getimage/:parameterName', (req, res) => {
    const urlStoragePath = path.join(IMAGE_DIR, 'image_urls.json');

    // Check if the JSON file storing URLs exists
    if (!fs.existsSync(urlStoragePath)) {
        console.error("[ERROR] No stored image URLs found");
        return res.status(404).json({ error: "No stored image URLs found" });
    }

    // Read the stored image URLs from the JSON file
    const storedUrls = JSON.parse(fs.readFileSync(urlStoragePath));

    // Retrieve the image URL based on the parameter name
    const imageUrl = storedUrls[req.params.parameterName];

    if (!imageUrl) {
        console.error(`[ERROR] Image URL not found for: ${req.params.parameterName}`);
        return res.status(404).json({ error: "Image URL not found" });
    }

    console.log(`[INFO] Returning stored image URL for ${req.params.parameterName}: ${imageUrl}`);

    // Return the stored URL instead of serving a file
    res.status(200).json({ imageUrl });
});

// app.get('/search', async (req, res) => {
//     console.log(`[DEBUG] Received /search request with query: ${req.query.q}`);

//     const query = req.query.q;
//     if (!query) {
//         console.error("[ERROR] Missing query parameter");
//         return res.status(400).json({ error: "Query is required" });
//     }

//     const headers = { "Authorization": process.env.PEXELS_API_KEY };
//     const params = new URLSearchParams({ query, per_page: 10 });

//     try {
//         console.log(`[DEBUG] Fetching images from Pexels API: ${params.toString()}`);
//         const response = await fetch(`https://api.pexels.com/v1/search?${params}`, { headers });

//         console.log(`[DEBUG] Pexels API response status: ${response.status}`);
//         if (!response.ok) {
//             throw new Error(`API responded with status ${response.status}`);
//         }

//         const data = await response.json();
//         console.log(`[DEBUG] Successfully fetched ${data.photos.length} images`);
//         res.status(200).json(data);
//     } catch (error) {
//         console.error("[ERROR] Failed to fetch images:", error);
//         res.status(500).json({ error: "Failed to fetch images" });
//     }
// });

// Endpoint to handle photo submission
app.post('/api/submitphotos', async (req, res) => {
    const { parameterName, imageName } = req.body;

    if (!parameterName || !imageName) {
        console.error("[ERROR] Missing parameters");
        return res.status(400).json({ error: "parameterName and imageName are required" });
    }

    console.log(`[DEBUG] Received /api/submitphotos request for ${parameterName} with imageName: ${imageName}`);

    try {
        // Call Pexels API to get an image
        const headers = { "Authorization": process.env.PEXELS_API_KEY };
        const params = new URLSearchParams({ query: imageName, per_page: 1 });

        console.log(`[DEBUG] Fetching image from Pexels API with query: ${params.toString()}`);
        const response = await fetch(`https://api.pexels.com/v1/search?${params}`, { headers });

        if (!response.ok) {
            throw new Error(`Pexels API responded with status ${response.status}`);
        }

        const data = await response.json();
        if (!data.photos.length) {
            throw new Error(`No images found for "${imageName}"`);
        }

        // Get the first image URL
        const imageUrl = data.photos[0].src.original;
        console.log(`[DEBUG] Found image URL: ${imageUrl}`);

        // Save the URL to a JSON file instead of downloading the image
        const urlStoragePath = path.join(IMAGE_DIR, 'image_urls.json');

        // Load existing URLs if the file exists
        let storedUrls = {};
        if (fs.existsSync(urlStoragePath)) {
            const fileData = fs.readFileSync(urlStoragePath);
            storedUrls = JSON.parse(fileData);
        }

        // Store the new URL with the parameter name as the key
        storedUrls[parameterName] = imageUrl;
        fs.writeFileSync(urlStoragePath, JSON.stringify(storedUrls, null, 4));

        console.log(`[INFO] Stored image URL for ${parameterName}`);

        res.status(200).json({ message: "Image URL successfully stored", imageUrl });

    } catch (error) {
        console.error("[ERROR] Failed to fetch or store image URL:", error);
        res.status(500).json({ error: "Failed to fetch or store image URL" });
    }
});


app.listen(PORT, () => console.log(`[INFO] Server running on http://localhost:${PORT}`));