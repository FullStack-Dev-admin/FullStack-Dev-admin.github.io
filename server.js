import express from 'express';  // Use import instead of require
import fetch from 'node-fetch';  // Import node-fetch as an ES Module

const app = express();
const port = 3000;

// Middleware for parsing JSON bodies
app.use(express.json());

// Property lookup endpoint
app.post('/api/property-lookup', async (req, res) => {
    const { streetAddress, city, state, zip, aptAddress } = req.body;
    
    const apiUrl = `https://data.remine.com/api/prd/v2/locations/search?line1=${encodeURIComponent(streetAddress)}&line2=${encodeURIComponent(aptAddress)}&city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}&zip=${encodeURIComponent(zip)}`;
    
    const apiKey = '9efb502d-4a7b-482f-8fa6-7a573ecba5ee'; // Replace with your actual Remine API key

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        if (!response.ok) {
            // If response status is not OK, return an error message
            const errorText = await response.text();
            console.error('Error from API:', errorText);
            return res.status(response.status).json({ error: 'Failed to fetch property data', details: errorText });
        }

        // Try to parse the JSON response
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching property data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Serve static files (like HTML, JS) from the "public" directory
app.use(express.static('public'));

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
