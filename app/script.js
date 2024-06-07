const apiKey = "c1867447"; // OMDb API Key
const baseAPIURL = "http://www.omdbapi.com/";
const form = document.getElementById("search-form");
const query = document.getElementById("query");
const root = document.getElementById("root");

let page = 1,
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
    const searchTerm = query.value || "movie"; // Default search term if none provided
    const URL = `${baseAPIURL}?s=${searchTerm}&apikey=${apiKey}&page=${page}`;
    fetchAndShowResults(URL, true);
}

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
                        <a class="btn" href="player.html?title=${encodeURIComponent(movie.Title)}">Play</a>
                    </div>
                </div>
                <div class="describe">
                    ${movie.Type}
                </div>
            </div>
        </div>
    </div>`

const showResults = (items, append = false) => {
    let content = append ? root.innerHTML : "";
    if (items && items.length > 0) {
        items.forEach((item) => {
            content += movieCard(item);
        });
    } else {
        content += "<p>Something went wrong!</p>";
    }
    root.innerHTML = content; // Inject content to root
}

const handleLoadMore = () => {
    getSpecificPage(++page);
}

const detectEndAndLoadMore = (e) => {
    let el = document.documentElement;
    if (
        !inSearchPage &&
        el.scrollTop + el.clientHeight == el.scrollHeight
    ) {
        console.log("BINGO!");
        handleLoadMore();
    }
}

form.addEventListener("submit", async (e) => {
    inSearchPage = true;
    e.preventDefault();
    page = 1; // Reset page number on new search
    const searchTerm = query.value;
    if (searchTerm) {
        const searchURL = `${baseAPIURL}?s=${searchTerm}&apikey=${apiKey}&page=1`;
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
