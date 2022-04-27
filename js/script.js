"use strict";

// Made by : Ahmad Fareed
// First time JS practice project

// just stopped it where it felt Ok not making it excelent
// css and html is little untidey or random you may find... forgive me for that
// use your own api key

const myKey = "3167af42";

const movieRow = document.querySelector(".movie__row");
const moviesContainer = document.querySelector(".container");
const searchEl = document.querySelector(".search__form--input");
const btn = document.querySelector(".btn");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const movieYear = document.querySelector(".movie__year");
const type = document.querySelector(".type");
const msgParent = document.querySelector(".msgParent");
const paginationDiv = document.querySelector(".pagination__div");
const messageEl = document.querySelector(".message");

let pageNumber = 0; // current page number
let noOfPages = 0; // total number of pages
let count = 0; // to keep track of buttons to be updated or not
let selectedMovieYear = movieYear.value;
let selectedType = type.value;

// this fills the list of options for year filters form 1900 to current year
const yearOps = function () {
  const curYear = new Date().getFullYear();

  for (let i = curYear; i >= 1900; i--) {
    const option = document.createElement("option");
    option.innerHTML = i;
    option.value = i;
    movieYear.appendChild(option);
  }
};

// executuing to fill options in year filter
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
  // amount = noOfPages
  let html = "";
  let till = 0; // to loop till "till"

  // show less buttons if amount of pages is less than 6
  till = amount < 5 ? amount : Number(pageNumber) + 5;

  // printing buttons
  for (let i = pageNumber; i <= till; i++) {
    html += ` <span class="p-btn p-btn-no b${i}">${i}</span>`;
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
  document.querySelector(`.b${pageNumber}`).classList.add("btn-active");
};

//////////////////////// click and goto page //////////////////
let prevPage = 0;

const getNewPAge = function (option) {
  prevPage = pageNumber;
  if (option === "next") pageNumber++;
  else if (option === "prev") pageNumber--;
  else if (option === "first") pageNumber = 1;
  else if (option === "last") pageNumber = noOfPages - 5;
  else if (option > noOfPages) return;
  else if (option == pageNumber) return;
  else if (option != pageNumber) pageNumber = option;
  else return;

  getJson(
    `http://www.omdbapi.com/?s=${searchEl.value}&page=${pageNumber}&&apikey=${myKey}&r=json`
  ).then(function (data) {
    const arr = data.Search;

    moviesContainer.innerHTML = "";

    arr.forEach(function (el, i) {
      renderMovies(el, i);
    });
  });
};

////////////// EVENT next or Previous Page /////////////
// addid event listener to the parent element of the buttons

paginationDiv.addEventListener("click", function (e) {
  // a new call is made to the api in order to get new page
  // btns are rendered according to scenario of click

  if (e.target.classList.contains("next") && pageNumber < noOfPages) {
    getNewPAge("next");
    document.querySelector(`.b${prevPage}`).classList.remove("btn-active");
    if (count < 6) {
      // as we have 6 buttons so, when 7th button is to be show
      // this condition will be false as value will be 6
      document.querySelector(`.b${pageNumber}`).classList.add("btn-active");
      count++;
      return;
    }
    // render new buttons after every six next clicks
    renderPaginationBtn(noOfPages);
    count = 1;
  } else if (e.target.classList.contains("prev") && pageNumber > 1) {
    getNewPAge("prev");
    document.querySelector(`.b${prevPage}`).classList.remove("btn-active");
    if (count > 1) {
      document.querySelector(`.b${pageNumber}`).classList.add("btn-active");
      count--;
      return;
    }
    // render new buttons when count is 1
    renderPaginationBtn(noOfPages);
  } else if (e.target.classList.contains("first") && pageNumber !== 1) {
    count = 1;
    getNewPAge("first");
    document.querySelector(`.b${prevPage}`).classList.remove("btn-active");
    renderPaginationBtn(noOfPages);
  } else if (e.target.classList.contains("last") && pageNumber !== noOfPages) {
    count = 1;
    getNewPAge("last");
    document.querySelector(`.b${prevPage}`).classList.remove("btn-active");
    renderPaginationBtn(noOfPages);
  } else if (e.target.classList.contains("p-btn-no")) {
    getNewPAge(e.target.textContent);
    document.querySelector(`.b${prevPage}`).classList.remove("btn-active");
    document.querySelector(`.b${pageNumber}`).classList.add("btn-active");
    // no need to render buttons when clicked on a single button
  } else {
    return;
  }
});

////////////////// ERROR ///////////////
// if no movies are found render error message

const renderError = function (errMsg) {
  messageEl.innerHTML = "";

  const html = `<div class="err">${errMsg}</div>`;

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
// make usrl according to the slelected values of the two filter options

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
      const arr = data.Search;
      const results = data.totalResults;

      // calculating no. pages can be made with 10 results each page
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
      count = 1;
      renderPaginationBtn(noOfPages);
    })
    .catch((err) => console.log(err));
  // for errror that don't let the promise to be fulfilled
  // I didn't wanted to work on this for this project
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

// setting filter values

movieYear.addEventListener("change", function () {
  selectedMovieYear = movieYear.value;
});

type.addEventListener("change", function () {
  selectedType = type.value;
});
