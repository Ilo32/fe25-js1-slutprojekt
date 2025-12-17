import { getTop10Movies, queryMovies, queryPeople } from './api.js';
import { displayErrorOnSite, getImageUrl } from './utils.js';

const topListType = document.getElementById('top10-type');
const topListContainer = document.getElementById('top10-container');

const searchBtn = document.querySelector('.search-btn');
const resultsContainer = document.getElementById('results-container');
const searchForm = document.getElementById('search-form')

async function showMovieCard(movie) {
    const card = document.createElement('div');
    card.classList.add('top10-card');

    const movieImage = document.createElement('img');
    const textDiv = document.createElement('div');
    textDiv.classList.add('p-2', 'w-100')

    const movieTitle = document.createElement('h4');
    const movieVote = document.createElement('p');
    const movieRelease = document.createElement('p');

    movieTitle.textContent = movie.title;
    movieVote.textContent = movie.vote_average;
    movieRelease.textContent = movie.release_date;
    movieImage.src = getImageUrl(movie.poster_path)
    
    textDiv.appendChild(movieTitle);
    textDiv.appendChild(movieVote);
    textDiv.appendChild(movieRelease);

    card.appendChild(movieImage);
    card.appendChild(textDiv);
    topListContainer.appendChild(card);
};

async function showMovieCards() {
    try {
        const data = await getTop10Movies(topListType.value);
        const movies = data.results;
        if (!movies) {
            displayErrorOnSite("Couldn't fetch movies from TMDB at the moment, please try again later.")
            return
        }
        for (const movie of movies) {
            showMovieCard(movie)
        }
    } catch(error) {
        displayErrorOnSite("Whoops! Something went wrong on our servers, try again later.")
    }
};

async function showQueriedMovies(response) {
    const movies = response.results;

    for (const movie of movies) {
        const card = document.createElement('div');
        card.classList.add('top10-card');
    
        const movieImage = document.createElement('img');
        const textDiv = document.createElement('div');
        textDiv.classList.add('p-2', 'w-100')
    
        const movieTitle = document.createElement('h4');
        const movieVote = document.createElement('p');
        const movieRelease = document.createElement('p');
    
        movieTitle.textContent = movie.title;
        movieVote.textContent = movie.vote_average;
        movieRelease.textContent = movie.release_date;
        movieImage.src = getImageUrl(movie.poster_path)
        movieImage.alt = `Image of ${movie.title}`
        
        textDiv.appendChild(movieTitle);
        textDiv.appendChild(movieVote);
        textDiv.appendChild(movieRelease);
    
        card.appendChild(movieImage);
        card.appendChild(textDiv);
        resultsContainer.appendChild(card); 
    }
};

async function showQueriedPeople(response) {
    const people = response.results;

    for (const person of people) {
        const card = document.createElement('div');
        card.classList.add('top10-card');
    
        const personsImage = document.createElement('img');
        const textDiv = document.createElement('div');
        textDiv.classList.add('p-2', 'w-100')
    
        const personsName = document.createElement('h4');
        const personsKnownFor = document.createElement('p');
    
        personsName.textContent = person.name;
        personsKnownFor.textContent = person.known_for_department;
        personsImage.src = getImageUrl(person.profile_path)
        personsImage.alt = `Image of ${person.name}`
        
        textDiv.appendChild(personsName);
        textDiv.appendChild(personsKnownFor);
    
        const slice = person.known_for.slice(0, 3)
        for (const item of slice) {
            const knownForItem = document.createElement('p');
            if (item.media_type === 'movie') {
                knownForItem.textContent = `Film: ${item.title}`;
            } else {
                knownForItem.textContent = `TV: ${item.name}`;
            }         
            textDiv.appendChild(knownForItem);
        }
        card.appendChild(personsImage);
        card.appendChild(textDiv);
        resultsContainer.appendChild(card); 
    }
};

async function showQuery() {
    const searchInputType = document.getElementById('search-type').value
    const searchInputValue = document.getElementById('search-input').value
    try {
        if (searchInputType === "movie") {
            const response = await queryMovies(searchInputValue);
            if (!response.results) {
                displayErrorOnSite("Could not fetch data from TMDB at the moment, try again later.")
                return
            }
            if (response.total_results === 0) {
                displayErrorOnSite("Found no movies, try tweaking your search terms.")
                return
            }
            showQueriedMovies(response)
            return
        }
        if (searchInputType === "person") {
            const response = await queryPeople(searchInputValue);
            if (!response.results) {
                displayErrorOnSite("Could not fetch data from TMDB at the moment, try again later.")
                return
            }
            if (response.total_results === 0) {
                displayErrorOnSite("Found no people, try tweaking your search terms.")
                return
            }
            showQueriedPeople(response)
            return
        }
    } catch(error) {
        displayErrorOnSite("Whoops! Something went wrong on our servers, try again later.");
    }
};

topListType.addEventListener('change', () => {
    topListContainer.innerHTML = '';
    showMovieCards();
});

searchBtn.addEventListener('click', () => {
    resultsContainer.innerHTML = '';
    showQuery();
});

searchForm.addEventListener('submit', () => {
    e.preventDefault();
});

showMovieCards();