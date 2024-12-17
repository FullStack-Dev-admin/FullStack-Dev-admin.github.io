<?php
// listings.php

// API endpoint and token
//Realtyna and Remine API endpoint and api token
$apiEndpoint = "https://api.pr0p.net/listings";
$apiToken = "YOUR_API_TOKEN_HERE"; // Replace with your actual token

// Initialize cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $apiEndpoint . "?limit=10"); // Add query parameters if needed
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $apiToken", // Add Authorization header
]);

// Execute cURL and get the response
$response = curl_exec($ch);

// Check for errors
if (curl_errno($ch)) {
    echo "Error fetching data: " . curl_error($ch);
    curl_close($ch);
    exit();
}

// Close cURL
curl_close($ch);

// Decode the JSON response
$data = json_decode($response, true);

// Check if data exists
$listings = $data['listings'] ?? [];

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MLS/IDX Property Listings</title>
    <style>
        /* Simple CSS for styling */
        .listing {
            border: 1px solid #ddd;
            padding: 10px;
            margin: 10px;
            max-width: 300px;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
            display: inline-block;
            vertical-align: top;
        }
        .listing img {
            width: 100%;
            height: auto;
        }
        h2 {
            font-size: 18px;
        }
    </style>
</head>
<body>
    <h1>MLS/IDX Property Listings</h1>
    <div>
        <?php if (!empty($listings)): ?>
            <?php foreach ($listings as $listing): ?>
                <div class="listing">
                    <h2><?php echo htmlspecialchars($listing['address'] ?? 'No Address'); ?></h2>
                    <?php if (!empty($listing['image_url'])): ?>
                        <img src="<?php echo htmlspecialchars($listing['image_url']); ?>" alt="Property Image">
                    <?php endif; ?>
                    <p>Price: <?php echo htmlspecialchars($listing['price'] ?? 'N/A'); ?></p>
                    <p>Beds: <?php echo htmlspecialchars($listing['bedrooms'] ?? '0'); ?> |
                        Baths: <?php echo htmlspecialchars($listing['bathrooms'] ?? '0'); ?></p>
                </div>
            <?php endforeach; ?>
        <?php else: ?>
            <p>No listings available at the moment.</p>
        <?php endif; ?>
    </div>
</body>
</html>
