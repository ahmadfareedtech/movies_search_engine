"use strict";

const myKey = "3167af42";
let pageNumber = 0;
let noOfPages = 0;

const movieRow = document.querySelector(".movie__row");
const moviesContainer = document.querySelector(".container");
const searchEl = document.querySelector(".search__form--input");
const btn = document.querySelector(".btn");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const movieYear = document.querySelector(".movie__year");
const type = document.querySelector(".type");
const msgParent = document.querySelector(".msgParent");
4;
const paginationDiv = document.querySelector(".pagination__div");

const messageEl = document.querySelector(".message");

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
  msgParent.innerHTML = "";
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

//////////////// PAGINATION ///////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
const btns = function (amount) {
  // console.log(amount);
  let html = "";
  let till = 0;

  till = amount < 5 ? amount : Number(pageNumber) + 5;
  for (let i = pageNumber; i <= till; i++) {
    html += ` <span class="p-btn p-btn-no">${i}</span>`;
  }
  return html;
};
/////////////// RENDER BTNS FOR PAGINATION ////////////////

const renderPaginationBtn = function (amount) {
  let html = ` <span class="p-btn first"><<</span> <span class="p-btn prev"><</span>`;

  html += btns(amount);

  html += ` <span class="p-btn next">></span> <span class="p-btn last">>></span>`;

  paginationDiv.innerHTML = "";
  paginationDiv.insertAdjacentHTML("beforeend", html);
};

//////////////////////// click and goto page //////////////////

const getNewPAge = function (option) {
  console.log(typeof option, option);
  console.log(pageNumber);
  if (option === "next") pageNumber++;
  else if (option === "prev") pageNumber--;
  else if (option === "first") pageNumber = 1;
  else if (option === "last") pageNumber = noOfPages - 6;
  else if (option > noOfPages) return;
  else if (option == pageNumber) return;
  else if (option != pageNumber) pageNumber = option;
  else return;

  console.log(pageNumber);
  getJson(
    `http://www.omdbapi.com/?s=${searchEl.value}&page=${pageNumber}&&apikey=${myKey}&r=json`
  ).then(function (data) {
    const arr = data.Search;

    moviesContainer.innerHTML = "";

    arr.forEach(function (el, i) {
      renderMovies(el, i);
    });

    renderPaginationBtn(noOfPages);
  });
};

////////////// EVENT next or Previous Page /////////////

paginationDiv.addEventListener("click", function (e) {
  if (e.target.classList.contains("next") && pageNumber < noOfPages) {
    // console.log("next page");
    getNewPAge("next");
  } else if (e.target.classList.contains("prev") && pageNumber > 1) {
    // console.log(pageNumber);
    // console.log("prev page");
    getNewPAge("prev");
  } else if (e.target.classList.contains("first") && pageNumber !== 1) {
    getNewPAge("first");
  } else if (e.target.classList.contains("last") && pageNumber !== noOfPages) {
    getNewPAge("last");
  } else if (e.target.classList.contains("p-btn-no")) {
    // console.log(e.target.textContent);
    getNewPAge(e.target.textContent);
  } else {
    // console.log("wrong elemnt clicked");
    return;
  }
});

////////////////// ERROR ///////////////

const renderError = function (errMsg) {
  messageEl.innerHTML = "";

  const html = `<div class="err">${errMsg}</div>`;

  console.log(errMsg);

  messageEl.insertAdjacentHTML("beforeend", html);
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
      const results = data.totalResults;

      noOfPages = Math.ceil(results / 10);

      if (!arr) {
        const errMsg = "Movie not found please enter an other name...";
        renderError(errMsg);
        throw new Error("Movie Not Found, Searhc different one");
      }

      paginationDiv.innerHTML = "";
      moviesContainer.innerHTML = "";

      arr.forEach(function (el, i) {
        renderMovies(el, i);
      });
      pageNumber = 1;
      renderPaginationBtn(noOfPages);
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

  if (String(searchEl.value).length < 3 || !searchEl.value) {
    alert("Empty input or too short! try again with proper input");
    return;
  }

  moviesContainer.innerHTML = "";

  getMoviesByName(searchEl.value);
});

movieYear.addEventListener("change", function () {
  selectedMovieYear = movieYear.value;
});

type.addEventListener("change", function () {
  selectedType = type.value;
});
