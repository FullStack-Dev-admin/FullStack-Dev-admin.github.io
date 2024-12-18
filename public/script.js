document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('lookupForm').addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent form submission

        // Get values from the form
        const streetAddress = document.getElementById('streetAddress').value;
        const city = document.getElementById('city').value;
        const state = document.getElementById('state').value;
        const zip = document.getElementById('zip').value;
        const aptAddress = document.getElementById('aptAddress').value; // Optional

        console.log('Submitting search with:', { streetAddress, city, state, zip, aptAddress });

        try {
            const response = await fetch('/api/property-lookup', {
                method: 'POST',  // Ensure this is a POST request
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ streetAddress, city, state, zip, aptAddress }),
            });

            // Handle response
            if (response.ok) {
                const data = await response.json(); // Parse the JSON response
                renderTable(data); // Call function to render data as table
            } else {
                const errorData = await response.json();
                document.getElementById('result').innerText = `Error: ${errorData.error}`;
            }
        } catch (error) {
            console.error('Fetch error:', error);
            document.getElementById('result').innerText = `Error: ${error.message}`;
        }
    });
});

// Function to render the JSON response as an HTML table
function renderTable(data) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // Clear previous content

    if (!data || Object.keys(data).length === 0) {
        resultDiv.textContent = 'No data found.';
        return;
    }

    // Create a table element
    const table = document.createElement('table');
    table.setAttribute('border', '1');
    table.setAttribute('cellpadding', '5');
    table.setAttribute('style', 'width: 100%; text-align: left; border-collapse: collapse;');

    // Create the header row for values (this will just have one row)
    const headerRow = table.insertRow();
    headerRow.insertCell().textContent = 'Property'; // First column header (for the property name)
    headerRow.insertCell().textContent = 'Value'; // Second column header (for the property value)

    // Loop through the keys of the JSON data and add each key-value pair as a row
    Object.keys(data).forEach(key => {
        const row = table.insertRow();
        const tdKey = row.insertCell();
        tdKey.textContent = key.replace(/_/g, ' ').toUpperCase(); // Format key

        const tdValue = row.insertCell();
        const value = data[key];

        // If value is an object, handle it and display it in a cleaner format
        if (value && typeof value === 'object') {
            let valueString = '';
            
            // Check for nested objects and handle them
            for (const [nestedKey, nestedValue] of Object.entries(value)) {
                // If the nested value is an object, recursively handle it
                if (nestedValue && typeof nestedValue === 'object') {
                    valueString += `${nestedKey}:\n${handleNestedObject(nestedValue)}\n`;
                } else {
                    valueString += `${nestedKey}: ${nestedValue}\n`;
                }
            }

            tdValue.textContent = valueString.trim(); // Remove trailing newline
        } else {
            tdValue.textContent = value;
        }
    });

    // Append table to the result div
    resultDiv.appendChild(table);
}

// Helper function to handle deeply nested objects
function handleNestedObject(nestedObject) {
    let result = '';
    for (const [key, value] of Object.entries(nestedObject)) {
        if (value && typeof value === 'object') {
            result += `${key}: \n${handleNestedObject(value)}\n`; // Recursively handle nested objects
        } else {
            result += `${key}: ${value}\n`;
        }
    }
    return result;
}
