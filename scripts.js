document.addEventListener('DOMContentLoaded', async function () {
    const token = localStorage.getItem('access_token'); // Assuming access_token is stored in localStorage

    if (!token) {
        alert('Please log in.');
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('signout-button').addEventListener('click', function () {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        alert('You have been signed out.');
        window.location.href = 'login.html';
    });

    document.getElementById('profile-button').addEventListener('click', async function () {
        try {
            let token = localStorage.getItem('access_token');

            if (!token) {
                throw new Error('No token found. Please log in again.');
            }

            const response = await fetch('http://127.0.0.1:8000/api/profile/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                alert(errorText);
            } else {
                const userData = await response.json();
                console.log('User profile data:', userData);

                // Display user profile information
                const profileDetailsDiv = document.getElementById('profile-details');
                profileDetailsDiv.innerHTML = `
                    <p><strong>Username:</strong> ${userData.first_name}</p>
                    <p><strong>Email:</strong> ${userData.email}</p>
                    <p><strong>Phone Number:</strong> ${userData.phone_number}</p>
                    <p><strong>Role:</strong> ${userData.role}</p>
                    <!-- Add more details as needed -->
                `;

                // Show profile info section
                document.getElementById('profile-info').style.display = 'block';
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            alert('Failed to fetch user profile. Please try again later.');
        }
    });
});
