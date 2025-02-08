import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fetch from 'node-fetch';

dotenv.config();
const app = express();
const PORT = 3000;

app.use(cors()); // Allow requests from frontend
app.use(express.json());

app.get('/search', async (req, res) => {
    console.log("Search called");
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: "Query is required" });

    const headers = { "Authorization": process.env.PEXELS_API_KEY };
    const params = new URLSearchParams({ query, per_page: 10 });

    try {
        const response = await fetch(`https://api.pexels.com/v1/search?${params}`, { headers });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch images" });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));