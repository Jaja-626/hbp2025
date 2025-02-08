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

// Endpoint to retrieve stored image
app.get('/api/getimage/:parameterName', (req, res) => {
    const { parameterName } = req.params;
    const imagePath = path.join(IMAGE_DIR, `${parameterName}.jpg`);

    if (!fs.existsSync(imagePath)) {
        console.error(`[ERROR] Image not found: ${imagePath}`);
        return res.status(404).json({ error: "Image not found" });
    }

    console.log(`[INFO] Serving image: ${imagePath}`);
    res.sendFile(imagePath);
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
        console.log(`[DEBUG] Found image: ${imageUrl}`);

        // Download and save the image locally
        const imagePath = path.join(IMAGE_DIR, `${parameterName}.jpg`);
        const imageResponse = await fetch(imageUrl);
        const imageBuffer = await imageResponse.buffer();

        fs.writeFileSync(imagePath, imageBuffer);
        console.log(`[INFO] Image saved at ${imagePath}`);

        res.status(200).json({ message: "Image successfully stored", path: imagePath });

    } catch (error) {
        console.error("[ERROR] Failed to fetch or save image:", error);
        res.status(500).json({ error: "Failed to fetch or save image" });
    }
});


app.listen(PORT, () => console.log(`[INFO] Server running on http://localhost:${PORT}`));