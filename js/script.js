"use strict";

const movieRow = document.querySelector(".movie__row");
const moviesContainer = document.querySelector(".container");
const searchEl = document.querySelector(".search__form--input");
const btn = document.querySelector(".btn");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");

const renderMovies = function (movie, i) {
    const html = `
<div class="movie__row">
<img class="thumbnail" src=${movie.Poster} alt="not available"></img>
<div class="movie__details">
    <div class="detail name${i}">
        <label>Name:</label> ${movie.Title}
    </div>
    <div class="detail">
        <label>Genre:</label> ${movie.Genre}
    </div>
    <div class="detail">
        <label>Year:</label> ${movie.Year}
    </div>

    <div class="detail">
                    <label>details:</label> 
                    <button class="btn__click__me btn${i}">click me!</button>
                </div>
</div>
</div>
`;

    moviesContainer.insertAdjacentHTML("beforeend", html);
    // getting buttons and names
    const movieName = document.querySelector(`.name${i}`);
    const btnDetail = document.querySelector(`.btn${i}`);
    // event handler to render single movie on click
    btnDetail.addEventListener("click", function () {
        const mName = movieName.textContent.trim().split(" ").splice(1).join(" ");
        // moviesContainer.innerHTML = "";

        getMovieDetails(mName);
        modal.classList.remove("hidden");
        overlay.classList.remove("hidden");
    });
};

const renderSingleMovie = function (movie) {
    const html = `
<div class="single__movie">
<svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 close__modal"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
<img class="single__movie__img" src=${movie.Poster} alt="" />
<div class="single__movie__details">
  <div class="single__name">
    <label class="lb">Name:</label> ${movie.Title}
  </div>
  <div class="single__genre">
    <label class="lb">Genre:</label> ${movie.Genre}
  </div>
  <div class="single__rating">
    <label class="lb">IMDB:</label> ${movie.imdbRating}
  </div>
  <div class="single__year">
    <label class="lb">Year:</label> ${movie.Year}
  </div>
  <div class="single__lang">
    <label class="lb">Language:</label> ${movie.Language}
  </div>
  <div class="single__boxoffice">
    <label class="lb">BoxOffice:</label> ${movie.BoxOffice}
  </div>
</div>
</div>
`;
    // modal.innerHTML = "";
    modal.insertAdjacentHTML("afterbegin", html);
};

const getJson = function (url) {
    return fetch(url).then((res) => {
        if (!res.ok) {
            throw new Error(`${res.status}`);
        }

        return res.json();
    });
};

const myKey = "3167af42";

/////////////////// API requesting Funcs ///////////////////

///////////////////// getting movies list ////////////////////////
const getMoviesByName = function (name) {
    const url = `http://www.omdbapi.com/?s=${name}&apikey=${myKey}&r=json`;
    //   const url = `https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term=${name}`;

    getJson(url).then(function (data) {
        console.log(data);
        const arr = data.Search;
        // console.log(arr);
        arr.forEach(function (el, i) {
            renderMovies(el, i);
        });
    });
};
///////////////////////// get one movie ///////////////////////////
const getMovieDetails = function (name) {
    const url = `http://www.omdbapi.com/?t=${name}&apikey=${myKey}`;

    getJson(url).then(function (details) {
        // console.log(details);
        renderSingleMovie(details);

        // close model element is rendered after movie details button
        // is click hence it does ot exist prior to this
        // so we need to make selection here
        const closeModal = document.querySelector(".close__modal");
        closeModal.addEventListener("click", function () {
            modal.classList.add("hidden");
            overlay.classList.add("hidden");

            modal.innerHTML = "";
        });
    });
};

//////////////////////// event handlers ///////////////////////////

btn.addEventListener("click", function (e) {
    e.preventDefault();
    // const movieName = searchEl.value;

    moviesContainer.innerHTML = "";
    // console.log(movieName);
    getMoviesByName(searchEl.value);
});
