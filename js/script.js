"use strict";

const myKey = "3167af42";

const movieRow = document.querySelector(".movie__row");
const moviesContainer = document.querySelector(".container");
const searchEl = document.querySelector(".search__form--input");
const btn = document.querySelector(".btn");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const movieYear = document.querySelector(".movie__year");
const type = document.querySelector(".type");

let selectedMovieYear = movieYear.value;
let selectedType = type.value;

const yearOps = function () {
  const curYear = new Date().getFullYear();

  for (let i = curYear; i >= 1900; i--) {
    const option = document.createElement("option");
    option.innerHTML = i;
    option.value = i;
    movieYear.appendChild(option);
  }
};

yearOps();

// render functions ////////////////////////////

const renderMovies = function (movie, i) {
  const html = `
<div class="movie__row">
<img class="thumbnail" src=${movie.Poster} alt="not available"></img>
<div class="movie__details">
    <div class="detail name${i}">
        <label>Name:</label> ${movie.Title}
    </div>
    <div class="detail">
        <label>Type:</label> ${movie.Type}
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
    // const mName = movieName.textContent.trim().split(" ").splice(1).join(" ");

    // moviesContainer.innerHTML = "";

    getMovieDetails(movie.imdbID);
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
    <label class="lb">Type:</label> ${movie.Type}
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

// Get json ////////////////
const getJson = function (url) {
  return fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error(`${res.status}`);
    }

    return res.json();
  });
};

/////////////////// API requesting Funcs ///////////////////

const makeURL = function (name) {
  if (selectedMovieYear === "none" && selectedType === "none") {
    return `http://www.omdbapi.com/?s=${name}&&apikey=${myKey}&r=json`;
  } else if (selectedMovieYear === "none" && selectedType !== "none") {
    return `http://www.omdbapi.com/?s=${name}&type=${selectedType}&apikey=${myKey}&r=json`;
  } else if (selectedMovieYear !== "none" && selectedType === "none") {
    return `http://www.omdbapi.com/?s=${name}&y=${selectedMovieYear}&apikey=${myKey}&r=json`;
  }

  return `http://www.omdbapi.com/?s=${name}&y=${selectedMovieYear}&type=${selectedType}&apikey=${myKey}&r=json`;
};

///////////////////// getting movies list ////////////////////////
const getMoviesByName = function (name) {
  const url = makeURL(name);

  getJson(url)
    .then(function (data) {
      console.log(data);
      const arr = data.Search;

      if (!arr) throw new Error("Movie Not Found, Searhc different one");

      arr.forEach(function (el, i) {
        renderMovies(el, i);
      });
    })
    .catch((err) => console.log(err));
};
///////////////////////// get one movie ///////////////////////////
const getMovieDetails = function (imdbId) {
  const url = `http://www.omdbapi.com/?i=${imdbId}&apikey=${myKey}`;

  getJson(url)
    .then(function (details) {
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
    })
    .catch((err) => console.log(err, "Movie not found"));
};

//////////////////////// event handlers ///////////////////////////

btn.addEventListener("click", function (e) {
  e.preventDefault();
  moviesContainer.innerHTML = "";

  getMoviesByName(searchEl.value);
});

movieYear.addEventListener("change", function () {
  selectedMovieYear = movieYear.value;
});

type.addEventListener("change", function () {
  selectedType = type.value;
});
