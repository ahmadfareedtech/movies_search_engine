'use strict'

const movieRow = document.querySelector('.movie__row');
const moviesContainer = document.querySelector('.container');
const searchEl = document.querySelector('.search__form--input');
const btn = document.querySelector('.btn');

const renderMovies = function (movie) {
    const html = `
<div class="movie__row">
<img class="thumbnail" src=${movie.Poster}></img>
<div class="movie__details">
    <div class="detail">
        <label>Name:</label> ${movie.Title}
    </div>
    <div class="detail">
        <label>Genre:</label> nothing
    </div>
    <div class="detail">
        <label>Year:</label> ${movie.Year}
    </div>

    <div class="detail">
        <label>Trailer:</label> link here
    </div>
</div>
</div>
`
    moviesContainer.insertAdjacentHTML('beforeend', html);
};

const getJson = function (url) {
    return fetch(url)
        .then(res => {
            if (!res.ok) {
                throw new Error(`${errMsg}! ${response.status}`);
            }

            return res.json();
        });
};

const getMoviesByName = function (name) {
    const myKey = '3167af42';
    const url = `http://www.omdbapi.com/?s=${name}&apikey=${myKey}&r=json`;

    getJson(url).then(function (data) {
        const arr = data.Search;
        console.log(arr);
        arr.forEach(function (el) {
            renderMovies(el);
        });

    });
}

// event handlers

btn.addEventListener('click', function (e) {
    e.preventDefault();
    const movieName = searchEl.value;
    searchEl.value = '';
    moviesContainer.insertAdjacentHTML('beforeend', ``);
    // console.log(movieName);
    getMoviesByName(movieName);
})

// getMoviesByName('batman');
// renderMovies();