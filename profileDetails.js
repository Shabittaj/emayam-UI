document.addEventListener('DOMContentLoaded', async function () {
    document.getElementById('profile-button').addEventListener('click', async function () {
        try {
            let token = localStorage.getItem('access_token');

            if (!token) {
                throw new Error('No token found. Please log in again.');
            }

            const response = await fetch('https://emayam-api.onrender.com/api/profile/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                if (response.status === 401 && errorText.includes('Token is invalid or expired')) {
                    // Token expired, attempt to refresh token
                    const refreshToken = localStorage.getItem('refresh_token');
                    const refreshResponse = await fetch('https://emayam-api.onrender.com/token/refresh/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ refresh: refreshToken })
                    });

                    if (!refreshResponse.ok) {
                        throw new Error('Failed to refresh token.');
                    }

                    const newData = await refreshResponse.json();
                    localStorage.setItem('access_token', newData.access);
                    token = newData.access; // Update token variable

                    // Retry original request with new access token
                    const retryResponse = await fetch('https://emayam-api.onrender.com/api/profile/', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!retryResponse.ok) {
                        throw new Error('Failed to fetch user profile after token refresh.');
                    }

                    // Process profile data
                    const userData = await retryResponse.json();
                    console.log('User profile data:', userData);

                    // Display user profile information
                    const profileDetailsDiv = document.getElementById('profile-details');
                    profileDetailsDiv.innerHTML = `
        <p><strong>Username:</strong> ${userData.email}</p>
        <p><strong>Email:</strong> ${userData.phone}</p>
        <p><strong>Additional Field 1:</strong> ${userData.additional_field1}</p>
        <p><strong>Additional Field 2:</strong> ${userData.additional_field2}</p>
        <!-- Add more details as needed -->
    `;

                    // Show profile info section
                    document.getElementById('profile-info').style.display = 'block';

                } else {
                    throw new Error(`Failed to fetch user profile. Server response: ${errorText}`);
                }
            } else {
                const userData = await response.json();
                console.log('User profile data:', userData);

                // Display user profile information
                const profileDetailsDiv = document.getElementById('profile-details');
                profileDetailsDiv.innerHTML = `
    <p><strong>Username:</strong> ${userData.first_name}</p>
    <p><strong>Email:</strong> ${userData.email}</p>
     <p><strong>Additional Field 1:</strong> ${userData.phone_number}</p>
     <p><strong>Additional Field 2:</strong> ${userData.role}</p>
    <!-- Add more details as needed -->
`;

                // Show profile info section
                document.getElementById('profile-info').style.display = 'block';
            }

        } catch (error) {
            console.error('Error fetching user profile:', error);
            alert('Failed to fetch user profile. Please try again later.');
        }
    })
});