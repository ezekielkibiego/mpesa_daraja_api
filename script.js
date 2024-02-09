const form = document.getElementById('stkForm');
const responseDiv = document.getElementById('response');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const phone = formData.get('phone');
    const amount = formData.get('amount');

    try {
        const response = await fetch('http://localhost:8000/stk', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phone, amount })
        });
        const data = await response.json();

        if (response.ok) {
            if (data.ResponseCode === '0') {
                responseDiv.textContent = `Payment successful.`;
            } else {
                responseDiv.textContent = `Payment failed.`;
            }
        } else {
            responseDiv.textContent = `Error: ${data.message}`;
        }
    } catch (error) {
        console.error('Error:', error);
        responseDiv.textContent = 'An error occurred. Please try again.';
    }
});