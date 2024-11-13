class MusicPlayer {
    constructor() {
        this.audio = new Audio();
        this.isPlaying = false;
        this.currentTrackIndex = 0;
        
        // Sample playlist - Replace with your own music files
        this.playlist = [
            {
                title: "Sample Song 1",
                artist: "Artist 1",
                file: "/assets/songs/file_example_MP3_700KB.mp3",
                albumArt: "/assets/images/pexels-pixabay-270288.jpg"
            },
            {
                title: "Sample Song 2",
                artist: "Artist 2",
                file: "/assets/songs/beautiful-loop-253269.mp3",
                albumArt: "/assets/images/pexels-magda-ehlers-pexels-1054713.jpg"
            }
            // Add more songs here
        ];

        this.initializePlayer();
        this.setupEventListeners();
    }

    initializePlayer() {
        this.renderPlaylist();
        if (this.playlist.length > 0) {
            this.loadTrack(0);
        }
    }

    renderPlaylist() {
        const playlistElement = document.getElementById('playlist-items');
        playlistElement.innerHTML = '';

        this.playlist.forEach((track, index) => {
            const li = document.createElement('li');
            li.className = 'playlist-item';
            li.innerHTML = `${track.title} - ${track.artist}`;
            li.addEventListener('click', () => this.loadTrack(index));
            playlistElement.appendChild(li);
        });
    }

    loadTrack(index) {
        if (index < 0) index = this.playlist.length - 1;
        if (index >= this.playlist.length) index = 0;

        this.currentTrackIndex = index;
        const track = this.playlist[index];

        document.getElementById('track-title').textContent = track.title;
        document.getElementById('track-artist').textContent = track.artist;
        document.getElementById('album-art').src = track.albumArt;

        this.audio.src = track.file;
        this.audio.load();

        this.updatePlaylistActiveItem();
        this.updatePlayPauseIcon();
    }

    updatePlaylistActiveItem() {
        const items = document.querySelectorAll('.playlist-item');
        items.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentTrackIndex);
        });
    }

    togglePlayPause() {
        if (this.audio.paused) {
            this.audio.play();
            this.isPlaying = true;
        } else {
            this.audio.pause();
            this.isPlaying = false;
        }
        this.updatePlayPauseIcon();
    }

    updatePlayPauseIcon() {
        const icon = document.querySelector('#play-pause i');
        icon.className = this.isPlaying ? 'fas fa-pause' : 'fas fa-play';
    }

    setupEventListeners() {
        // Play/Pause button
        document.getElementById('play-pause').addEventListener('click', () => this.togglePlayPause());

        // Previous track
        document.getElementById('prev').addEventListener('click', () => this.loadTrack(this.currentTrackIndex - 1));

        // Next track
        document.getElementById('next').addEventListener('click', () => this.loadTrack(this.currentTrackIndex + 1));

        // Volume control
        document.getElementById('volume').addEventListener('input', (e) => {
            this.audio.volume = e.target.value / 100;
        });

        // Progress bar
        const progressBar = document.querySelector('.progress-bar');
        progressBar.addEventListener('click', (e) => {
            const percent = e.offsetX / progressBar.offsetWidth;
            this.audio.currentTime = percent * this.audio.duration;
        });

        // Audio event listeners
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.loadTrack(this.currentTrackIndex + 1));
    }

    updateProgress() {
        const progress = document.querySelector('.progress');
        const currentTime = document.getElementById('current-time');
        const duration = document.getElementById('duration');

        const percent = (this.audio.currentTime / this.audio.duration) * 100;
        progress.style.width = `${percent}%`;

        currentTime.textContent = this.formatTime(this.audio.currentTime);
        duration.textContent = this.formatTime(this.audio.duration);
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}

// Initialize the music player when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const player = new MusicPlayer();
});