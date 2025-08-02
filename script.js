// script.js

// PENTING: Ganti dengan API Key TMDB lo!
const API_KEY = 'GANTI_DENGAN_API_KEY_TMDB_LO'; 
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

// Fungsi untuk mengambil data dari TMDB
async function fetchMovies(endpoint) {
    const url = `${BASE_URL}${endpoint}?api_key=${API_KEY}&language=en-US`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// Fungsi untuk membuat kartu film
function createMovieCard(movie) {
    // Ganti tautan ke URL cantik yang kita inginkan
    return `
        <a href="/movie/${movie.id}" class="movie-card">
            <img src="${IMAGE_URL}${movie.poster_path}" alt="${movie.title}" loading="lazy">
            <div class="movie-card-info">
                <h3>${movie.title}</h3>
                <p>Rating: ${movie.vote_average.toFixed(1)}</p>
            </div>
        </a>
    `;
}

// Fungsi untuk menampilkan film di grid
function displayMovies(movies, containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = movies.map(createMovieCard).join('');
    }
}

// Fungsi untuk menampilkan detail film
async function displayMovieDetail(movieId) {
    const movie = await fetchMovies(`/movie/${movieId}`);
    const content = document.getElementById('movie-detail-content');

    if (movie && content) {
        document.title = `${movie.title} | Detail Film`; // Update judul halaman
        const genres = movie.genres.map(genre => `<span>${genre.name}</span>`).join('');
        
        content.innerHTML = `
            <div class="detail-poster">
                <img src="${IMAGE_URL}${movie.poster_path}" alt="${movie.title}">
            </div>
            <div class="detail-info">
                <h1>${movie.title}</h1>
                <div class="genres">${genres}</div>
                <p><strong>Rating:</strong> ${movie.vote_average.toFixed(1)} / 10</p>
                <p><strong>Tanggal Rilis:</strong> ${movie.release_date}</p>
                <h2>Overview</h2>
                <p>${movie.overview}</p>
            </div>
        `;
    } else {
        content.innerHTML = `<p>Gagal memuat detail film.</p>`;
    }
}

// Cek di halaman mana kita berada dan jalankan fungsi yang sesuai
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    if (path === '/' || path.endsWith('index.html')) {
        // Halaman Utama
        fetchMovies('/movie/popular').then(data => displayMovies(data.results, 'popular-movies'));
        fetchMovies('/movie/now_playing').then(data => displayMovies(data.results, 'now-playing-movies'));
    } else if (path.startsWith('/movie/')) {
        // Halaman Detail (dengan URL cantik)
        const movieId = path.split('/')[2];
        displayMovieDetail(movieId);
    } else if (window.location.search.includes('?id=')) {
        // Fallback untuk halaman detail.html jika .htaccess gagal
        const params = new URLSearchParams(window.location.search);
        const movieId = params.get('id');
        if (movieId) {
            displayMovieDetail(movieId);
        }
    }
});
