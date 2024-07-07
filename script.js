document.addEventListener('DOMContentLoaded', (event) => {
    var userInput = document.getElementById('userInput');

    userInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    });
});

async function sendMessage() {
    var userInput = document.getElementById('userInput').value;
    if (userInput.trim() !== "") {
        displayMessage(userInput, 'user');
        try {
            var aiResponse = await fetchAIResponse(userInput);
            displayMessage(aiResponse, 'bot');
        } catch (error) {
            console.error("Error getting AI response:", error);
            displayMessage("Sat Saheb ji, Muje maaf karyein ga yeh jankari abhi me nhi bata sakta hu, toh mein apki aur kis prakar se seva kar sakta hu ?", 'bot');
        }
        document.getElementById('userInput').value = '';
    }
}

function displayMessage(message, sender) {
    var chatBox = document.getElementById('chatBox');
    var messageElement = document.createElement('div');
    messageElement.classList.add('chat-message');
    messageElement.classList.add(sender === 'user' ? 'text-right' : 'text-left');
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function fetchAIResponse(userInput) {
    try {
        let response = await fetch('/api/getResponse', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userInput })
        });
        let data = await response.json();
        return data.reply;
    } catch (error) {
        console.error("Error fetching AI response:", error);
        throw error;
    }
}
