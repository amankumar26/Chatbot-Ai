const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // Ensure node-fetch is installed: npm install node-fetch@2
require('dotenv').config(); // To manage environment variables

const app = express();
const PORT = process.env.PORT || 5500;

app.use(bodyParser.json());
app.use(express.static('public'));

const knowledgeBase = {
    "hello": "Hi there! How can I assist you today?",
    "how are you": "I'm an AI chatbot, so I don't have feelings, but I'm here to help you!"
};

app.post('/api/getResponse', async (req, res) => {
    const userInput = req.body.message.toLowerCase();
    try {
        const aiResponse = await getAIResponse(userInput);
        res.json({ reply: aiResponse });
    } catch (error) {
        console.error("Error getting response:", error);
        res.status(500).json({ reply: "Sat Saheb ji, Muje maaf karyein ga yeh jankari abhi me nhi bata sakta hu, toh mein apki aur kis prakar se seva kar sakta hu?" });
    }
});

async function getAIResponse(userInput) {
    if (knowledgeBase[userInput]) {
        return knowledgeBase[userInput];
    } else {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo-1106', // Use the appropriate model
                messages: [{ role: 'user', content: userInput }],
                max_tokens: 150,
                n: 1,
                stop: null,
                temperature: 0.9,
            })
        });

        const data = await response.json();
        return data.choices[0].message.content.trim();
    }
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
