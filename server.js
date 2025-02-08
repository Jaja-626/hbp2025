import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fetch from 'node-fetch';

dotenv.config();
const app = express();
const PORT = 3000;

app.use(cors()); // Allow requests from frontend
app.use(express.json());

console.log("Starting server...");

app.get('/search', async (req, res) => {
    console.log(`[DEBUG] Received /search request with query: ${req.query.q}`);

    const query = req.query.q;
    if (!query) {
        console.error("[ERROR] Missing query parameter");
        return res.status(400).json({ error: "Query is required" });
    }

    const headers = { "Authorization": process.env.PEXELS_API_KEY };
    const params = new URLSearchParams({ query, per_page: 10 });

    try {
        console.log(`[DEBUG] Fetching images from Pexels API: ${params.toString()}`);
        const response = await fetch(`https://api.pexels.com/v1/search?${params}`, { headers });

        console.log(`[DEBUG] Pexels API response status: ${response.status}`);
        if (!response.ok) {
            throw new Error(`API responded with status ${response.status}`);
        }

        const data = await response.json();
        console.log(`[DEBUG] Successfully fetched ${data.photos.length} images`);
        res.status(200).json(data);
    } catch (error) {
        console.error("[ERROR] Failed to fetch images:", error);
        res.status(500).json({ error: "Failed to fetch images" });
    }
});

app.listen(PORT, () => console.log(`[INFO] Server running on http://localhost:${PORT}`));