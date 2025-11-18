const { OpenAI } = require("openai");
require("dotenv").config(); // To load your API keys from a .env file

// Initialize OpenAI Client (only if API key is provided)
let client = null;
if (process.env.OPENAI_API_KEY) {
	client = new OpenAI({
		apiKey: process.env.OPENAI_API_KEY,
	});
} else {
	console.warn("⚠️  OPENAI_API_KEY not found. AI pricing will return mock data.");
}

// const generatePriceEstimate = async (req, res) => {
// 	const { location, type, size } = req.body;

// 	// Ensure all fields are provided
// 	if (!location || !type || !size) {
// 		return res
// 			.status(400)
// 			.json({ error: "Location, type, and size are required." });
// 	}

// 	try {
// 		// Call OpenAI's API with the given information
// 		const completion = await client.chat.completions.create({
// 			model: "gpt-4o-mini", // Using a valid model ID
// 			messages: [
// 				{
// 					role: "user",
// 					content: `For a ${type} billboard in ${location}, of size ${size}, estimate a fair price range for rental.`,
// 				},
// 			],
// 		});

// 		// Extract the response from OpenAI
// 		const price = completion.choices[0].message.content.trim();
// 		res.json({ price });
// 	} catch (error) {
// 		console.error("Error details from OpenAI:", error); // Log the error response from OpenAI
// 		res.status(500).json({ error: "Failed to generate price from AI." });
// 	}
// };


const NodeCache = require("node-cache"); // Import node-cache for caching

// Create OpenAI client


// Create cache instance
const priceCache = new NodeCache({ stdTTL: 3600, checkperiod: 120 }); // Cache TTL is 1 hour

// Function to generate the price estimate
const generatePriceEstimate = async (req, res) => {
	const { location, size, type, month } = req.body;

	// Ensure all fields are provided
	if (!location || !type || !size || !month) {
		return res
			.status(400)
			.json({ error: "Location, type, size, and month are required." });
	}

	// Construct a unique cache key based on the input parameters
	const cacheKey = `${location}-${size}-${type}-${month}`;

	// Check if the response for this combination is already cached
	const cachedResponse = priceCache.get(cacheKey);

	if (cachedResponse) {
		// Return the cached response if available
		return res.json({ price: cachedResponse });
	}

	// If OpenAI client is not initialized, return a mock price
	if (!client) {
		const mockPrice = `$${(Math.random() * 2000 + 1000).toFixed(2)} - $${(Math.random() * 4000 + 3000).toFixed(2)} per month`;
		priceCache.set(cacheKey, mockPrice);
		return res.json({ price: mockPrice, note: "Mock data - OpenAI API key not configured" });
	}

	try {
		// Send a request to OpenAI with low temperature for more consistent results
		const completion = await client.chat.completions.create({
			model: "gpt-4o-mini", // Ensure you're using the correct model
			temperature: 0.2, // Set low temperature for deterministic responses
			messages: [
				{
					role: "user",
					content: `
            For a ${type} billboard of size ${size} in the ${location} area, provide a monthly rental price range for ${month}. Only provide the price range and avoid any other text.
          `,
				},
			],
		});

		// Extract the response from OpenAI (price estimate)
		const price = completion.choices[0].message.content.trim();

		// Cache the result for future requests
		priceCache.set(cacheKey, price);

		// Return the price
		res.json({ price });
	} catch (error) {
		console.error("Error details from OpenAI:", error);
		res.status(500).json({ error: "Failed to generate price from AI." });
	}
};





module.exports = { generatePriceEstimate };
