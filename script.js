// Extended dummy chats
const dummyChats = [
    {
        id: 1,
        name: "John Doe",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        lastMessage: "Hey, how's the project going? 📁",
        timestamp: "10:30 AM",
        unread: 2,
        messages: [
            { text: "Hey, how's the project going? 📁", sent: false, time: "10:30 AM" },
            { text: "Almost done! Just finishing up the documentation 📝", sent: true, time: "10:31 AM" }
        ]
    },
    {
        id: 2,
        name: "Jane Smith",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        lastMessage: "Let's meet for coffee! ☕",
        timestamp: "9:45 AM",
        unread: 0,
        messages: [
            { text: "Let's meet for coffee! ☕", sent: false, time: "9:45 AM" },
            { text: "Sure! 3 PM at our usual place? 👌", sent: true, time: "9:46 AM" }
        ]
    },
    {
        id: 3,
        name: "Marketing Team",
        avatar: "https://randomuser.me/api/portraits/lego/3.jpg",
        lastMessage: "New campaign draft attached 📎",
        timestamp: "Yesterday",
        unread: 3,
        messages: [
            { text: "New campaign draft attached 📎", sent: false, time: "Yesterday" },
            { text: "Looks great! Let's add more social media elements 📱", sent: true, time: "Yesterday" }
        ]
    }
];

// Initialize local storage
if (!localStorage.getItem('chats')) {
    localStorage.setItem('chats', JSON.stringify(dummyChats));
}

let currentChatId = null;

function loadChats() {
    const chats = JSON.parse(localStorage.getItem('chats'));
    const chatList = document.getElementById('chatList');
    chatList.innerHTML = '';

    chats.forEach(chat => {
        const chatItem = document.createElement('div');
        chatItem.className = 'chat-item';
        chatItem.innerHTML = `
            <img src="${chat.avatar}" alt="${chat.name}">
            <div>
                <h3>${chat.name}</h3>
                <p>${chat.lastMessage}</p>
                <small>${chat.timestamp}</small>
                ${chat.unread > 0 ? `<span class="unread">${chat.unread}</span>` : ''}
            </div>
        `;
        chatItem.addEventListener('click', () => showChat(chat.id));
        chatList.appendChild(chatItem);
    });
}

function showChat(chatId) {
    currentChatId = chatId;
    const chats = JSON.parse(localStorage.getItem('chats'));
    const chat = chats.find(c => c.id === chatId);
    
    document.getElementById('chatHeader').innerHTML = `
        <h2>${chat.name}</h2>
        <p>Last seen ${chat.timestamp}</p>
    `;

    const messagesContainer = document.getElementById('messagesContainer');
    messagesContainer.innerHTML = '';
    
    chat.messages.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.sent ? 'sent' : 'received'}`;
        messageDiv.innerHTML = `
            <p>${message.text}</p>
            <small>${message.time}</small>
        `;
        messagesContainer.appendChild(messageDiv);
    });
}

function sendMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    if (!text || !currentChatId) return;

    const chats = JSON.parse(localStorage.getItem('chats'));
    const chatIndex = chats.findIndex(c => c.id === currentChatId);
    
    const newMessage = {
        text,
        sent: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    chats[chatIndex].messages.push(newMessage);
    chats[chatIndex].lastMessage = text;
    chats[chatIndex].timestamp = newMessage.time;
    
    localStorage.setItem('chats', JSON.stringify(chats));
    input.value = '';
    showChat(currentChatId);
    loadChats();
}

function changeTheme(theme) {
    switch(theme) {
        case 'dark':
            document.documentElement.style.setProperty('--primary-color', '#2ecc71');
            document.documentElement.style.setProperty('--background-color', '#34495e');
            document.documentElement.style.setProperty('--text-color', '#ecf0f1');
            document.documentElement.style.setProperty('--message-bg', '#2c3e50');
            document.documentElement.style.setProperty('--header-bg', '#2c3e50');
            break;
        case 'blue':
            document.documentElement.style.setProperty('--primary-color', '#3498db');
            document.documentElement.style.setProperty('--background-color', '#ecf5ff');
            document.documentElement.style.setProperty('--message-bg', '#d4e3ff');
            document.documentElement.style.setProperty('--header-bg', '#d4e3ff');
            break;
        case 'professional':
            document.documentElement.style.setProperty('--primary-color', '#2c3e50');
            document.documentElement.style.setProperty('--background-color', '#f8f9fa');
            document.documentElement.style.setProperty('--text-color', '#495057');
            document.documentElement.style.setProperty('--message-bg', '#e9ecef');
            document.documentElement.style.setProperty('--header-bg', '#dee2e6');
            break;
        default:
            document.documentElement.style.setProperty('--primary-color', '#0084ff');
            document.documentElement.style.setProperty('--background-color', '#ffffff');
            document.documentElement.style.setProperty('--text-color', '#2c3e50');
            document.documentElement.style.setProperty('--message-bg', '#f0f0f0');
            document.documentElement.style.setProperty('--header-bg', '#f8f9fa');
    }
    localStorage.setItem('theme', theme);
}

function changeCustomBackground(color) {
    document.documentElement.style.setProperty('--background-color', color);
    localStorage.setItem('customBG', color);
}

function resetSettings() {
    localStorage.removeItem('theme');
    localStorage.removeItem('customBG');
    changeTheme('light');
    document.getElementById('themeSelect').value = 'light';
    document.getElementById('bgColorPicker').value = '#ffffff';
}

function toggleSettings() {
    document.getElementById('settingsPanel').classList.toggle('active');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadChats();
    const savedTheme = localStorage.getItem('theme') || 'light';
    const customBG = localStorage.getItem('customBG');
    
    changeTheme(savedTheme);
    document.getElementById('themeSelect').value = savedTheme;
    
    if(customBG) {
        document.documentElement.style.setProperty('--background-color', customBG);
        document.getElementById('bgColorPicker').value = customBG;
    }

    document.getElementById('messageInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
});