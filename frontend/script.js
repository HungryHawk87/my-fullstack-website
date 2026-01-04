// API URL - Update this after deploying backend
const API_URL = 'http://localhost:3000';

// Handle form submission
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };
    
    try {
        const response = await fetch(`${API_URL}/api/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showResponse('Success! Your message has been submitted.', 'success');
            document.getElementById('contactForm').reset();
            loadData(); // Refresh the data list
        } else {
            showResponse('Error: ' + data.message, 'error');
        }
    } catch (error) {
        showResponse('Error connecting to server. Make sure backend is running.', 'error');
    }
});

// Show response message
function showResponse(message, type) {
    const responseDiv = document.getElementById('response');
    responseDiv.textContent = message;
    responseDiv.className = `response ${type}`;
    responseDiv.classList.remove('hidden');
    
    setTimeout(() => {
        responseDiv.classList.add('hidden');
    }, 5000);
}

// Load and display submitted data
async function loadData() {
    try {
        const response = await fetch(`${API_URL}/api/data`);
        const data = await response.json();
        
        const dataList = document.getElementById('dataList');
        
        if (data.length === 0) {
            dataList.innerHTML = '<p style="color: #999;">No data submitted yet.</p>';
            return;
        }
        
        dataList.innerHTML = data.map(item => `
            <div class="data-item">
                <strong>Name:</strong> ${item.name}<br>
                <strong>Email:</strong> ${item.email}<br>
                <strong>Message:</strong> ${item.message}<br>
                <strong>Date:</strong> ${new Date(item.timestamp).toLocaleString()}
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Load data when page loads
loadData();