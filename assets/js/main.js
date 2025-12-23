import { getTop10Movies } from './api.js';
import { displayErrorOnSite } from './utils.js';
import { showMovieCard, showQuery } from './renderContent.js'

const listType = document.getElementById('top10-type');
const searchForm = document.getElementById('search-form')

/*
* Handing of switching between top rated and most popular movies on the front page. 
*/
listType.addEventListener('change', () => {
    listContainer.innerHTML = '';

});

/*
* Handling of user Queries, such as Movie Queries and People Queries.
*/
searchForm.addEventListener('submit', () => {
    showQuery();
});

/*  
* Main handling of the top 10 popular and top rated movies.
* uses getTop10Movies to send a api request, decodes the data and pushes it to render the components.
*/
getTop10Movies(listType.value)
    .then(async (responseData) => {
        const movieData = await responseData.json();
        const movies = movieData.results;
        for (const movie of movies) {
            showMovieCard(movie)
        }
    })
    .catch((responseData) => {
        console.log(responseData)
        displayErrorOnSite(responseData)
    });