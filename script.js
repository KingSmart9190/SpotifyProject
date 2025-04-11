// Fetch album data from album_response.json and render albums
function fetchAlbumsFromFile() {
    fetch('albums_response.json') // Load the local file
        .then(response => response.json())
        .then(data => {
            if (!data.albums || data.albums.length === 0) {
                alert('No albums found in the JSON file.');
                return;
            }
            data.albums.forEach(album => renderAlbum(album)); // Render each album
        })
        .catch(error => console.error('Error fetching albums from file:', error));
}

// Render album cards on the grid
function renderAlbum(album) {
    const grid = document.querySelector('.grid');
    const card = document.createElement('div');
    card.classList.add('card');

    const albumArt = document.createElement('img');
    albumArt.src = album.images[0]?.url || 'placeholder.jpg'; // Fallback image
    albumArt.alt = album.name;

    const albumName = document.createElement('p');
    albumName.textContent = album.name;

    card.appendChild(albumArt);
    card.appendChild(albumName);

    // Add click event to play the first track preview
    card.addEventListener('click', () => {
        const previewUrl = album.tracks?.items[0]?.preview_url;
        if (previewUrl) {
            playMusic(previewUrl);
        } else {
            window.open(album.tracks?.items[0]?.external_urls.spotify, '_blank');
        }
    });    

    grid.appendChild(card);
}


// Play music using the <audio> element
function playMusic(previewUrl) {
    const audioPlayer = document.getElementById('audio-player');
    const audioSource = document.getElementById('audio-source');
    
    if (!previewUrl) {
        alert('No preview available for this track.');
        return;
    }
    
    audioSource.src = previewUrl; // Set the preview URL
    audioPlayer.load();
    audioPlayer.play();
}


// Call the function to fetch and display albums on page load
fetchAlbumsFromFile();

window.onSpotifyWebPlaybackSDKReady = () => {
    const token = 'BQBV6VydDxBbJ1s3YJovd9KMlAdFxEurPUa6uLRsnJlPMwPaG3t8x-qOxwNoSk8Wbndj10WcA0Ea2oHyjZf-SK8BbGeSu7R2zY-85-7dTppFrJwzbIIkRcagPSWi6uZltYz9an7Uz1k'; // Replace with your actual access token
    const player = new Spotify.Player({
        name: 'Web Playback SDK Player',
        getOAuthToken: cb => { cb(token); },
        volume: 0.5,
        robustnessLevel: 'SW_FALLBACK',
    });

    // Connect the player
    player.connect();

    // Event listeners
    player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
    });

    player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
    });

    if (window.location.pathname === '/callback') {
        handleCallback();
    }
    
};

function handleCallback() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    console.log('Authorization code:', code);
    // Add logic to exchange the code for an access token.
}


const audioPlayer = document.getElementById('audio-player');
const playPauseButton = document.querySelector('.play-pause');

// Update play/pause state when the audio is playing/paused
audioPlayer.addEventListener('play', () => {
    playPauseButton.innerHTML = '<i class="icon-pause"></i>'; // Pause button icon
});

audioPlayer.addEventListener('pause', () => {
    playPauseButton.innerHTML = '<i class="icon-play"></i>'; // Play button icon
});


document.querySelectorAll('.play-button').forEach(button => {
    button.addEventListener('click', (event) => {
        const audioPlayer = document.getElementById('audio-player');
        const albumCard = event.target.closest('.card');
        
        // Get associated album preview URL (modify this logic to match your app)
        const previewUrl = albumCard.dataset.previewUrl; 
        if (previewUrl) {
            audioPlayer.src = previewUrl; // Set audio source
            audioPlayer.play(); // Start playback
        } else {
            alert('No preview available for this track.');
        }
    });
});

// Select all cards
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
        const audioSrc = card.dataset.audio; // Get the audio file path from the data-audio attribute
        const audioPlayer = document.getElementById('audio-player');
        const audioSource = document.getElementById('audio-source');

        if (audioSrc) {
            audioSource.src = audioSrc; // Set the audio source
            audioPlayer.load(); // Load the new audio
            audioPlayer.play(); // Play the audio
        } else {
            alert(`No audio available for "${card.querySelector('p').textContent}"`);
        }
    });
});
