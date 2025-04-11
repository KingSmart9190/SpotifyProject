// Variables for authorization
const clientId = '8ea181d6d7564f768d089e79617521cc'; // Replace with your Spotify Client ID
const redirectUri = 'http://127.0.0.1:5500/'; // Make sure this matches the redirect URI in your Spotify app
const scope = 'user-read-private user-read-email';
const state = generateRandomString(16); // Generate a random string for CSRF protection

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// Redirect the user for authorization
function authorizeUser() {
    const url = `https://accounts.spotify.com/authorize?` +
        `client_id=${clientId}&` +
        `response_type=code&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=${encodeURIComponent(scope)}&` +
        `state=${state}`;
    
    window.location.href = url; // Redirect the user
}


// Parse URL parameters to retrieve the authorization code
function handleCallback() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const receivedState = params.get('state');

    // Verify state parameter for security
    if (receivedState !== state) {
        console.error('State mismatch error!');
        return;
    }

    // Exchange the authorization code for an access token
    exchangeToken(code);
}

function exchangeToken(code) {
    fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa('8ea181d6d7564f768d089e79617521cc:f0c3bf700c4548019156333fb8044ea1') // Base64-encode client ID and secret
        },
        body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(redirectUri)}`
    })
    .then(response => response.json())
    .then(data => {
        console.log('Access Token:', data.access_token);
        console.log('Refresh Token:', data.refresh_token);

        // Store the tokens for later use
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
    })
    .catch(error => console.error('Error exchanging token:', error));
}
