const apiKey = "c1867447"; // OMDb API Key
const baseAPIURL = "http://www.omdbapi.com/";
const imgURL = "https://image.tmdb.org/t/p/w1280"; // OMDb doesn't have its own image URL, but TMDb image URL can be used if available.
const form = document.getElementById("search-form");
const query = document.getElementById("query");
const root = document.getElementById("root");

let movies = [],
    page = 1,
    inSearchPage = false;

// Fetch JSON data from URL
async function fetchData(URL) {
    try {
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return await response.json();
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

const fetchAndShowResults = async (URL, append = false) => {
    const data = await fetchData(URL);
    if (data && data.Search) {
        showResults(data.Search, append);
    } else {
        showError("No results found or something went wrong!");
    }
};

const getSpecificPage = (page) => {
    // OMDb API does not support pagination in the same way as TMDb
    const URL = `${baseAPIURL}?s=movie&apikey=${apiKey}&page=${page}`;
    fetchAndShowResults(URL, true);
};

const movieCard = (movie) =>
    `<div class="col">
          <div class="card">
            <a class="card-media" href="${movie.Poster}" target="_blank">
              <img src="${movie.Poster}" alt="${movie.Title}" width="100%" />
            </a>
            <div class="card-content">
              <div class="card-cont-header">
                <div class="cont-left">
                  <h3 style="font-weight: 600">${movie.Title}</h3>
                  <span style="color: #12efec">${movie.Year}</span>
                </div>
                <div class="cont-right">
                  <a href="${movie.Poster}" target="_blank" class="btn">See image</a>
                </div>
              </div>
              <div class="describe">
                ${movie.Plot || "No overview yet..."}
              </div>
            </div>
          </div>
        </div>`;

const showResults = (items, append = false) => {
    let content = append ? root.innerHTML : "";
    items.forEach((item) => {
        let { Poster, Title, Year, Plot } = item;

        Poster = Poster !== "N/A" ? Poster : "./img-01.jpeg";
        Title = Title.length > 15 ? Title.slice(0, 15) + "..." : Title;
        Plot = Plot || "No overview yet...";
        Year = Year || "No release date";

        const movieItem = { Poster, Title, Year, Plot };
        content += movieCard(movieItem);
    });

    root.innerHTML = content; // Inject content to root
};

const showError = (message) => {
    root.innerHTML = `<p>${message}</p>`;
};

const handleLoadMore = () => {
    getSpecificPage(++page);
};

const detectEndAndLoadMore = () => {
    let el = document.documentElement;
    if (!inSearchPage && el.scrollTop + el.clientHeight === el.scrollHeight) {
        handleLoadMore();
    }
};

form.addEventListener("submit", async (e) => {
    inSearchPage = true;
    e.preventDefault();
    const searchTerm = query.value;
    if (searchTerm) {
        page = 1; // Reset page number on new search
        const searchURL = `${baseAPIURL}?s=${searchTerm}&apikey=${apiKey}&page=${page}`;
        fetchAndShowResults(searchURL);
        query.value = "";
    }
});

window.addEventListener("scroll", detectEndAndLoadMore);

function init() {
    inSearchPage = false;
    fetchAndShowResults(`${baseAPIURL}?s=movie&apikey=${apiKey}&page=1`);
}

init();

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log("User signed in:", profile.getName());
}
