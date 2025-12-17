import { api_key, base_url } from './config.js';
import { displayErrorOnSite } from './utils.js'

export const getTop10Movies = async (type) => {
    try {
        const response = await fetch(`${base_url}/movie/${type}?api_key=${api_key}`); 
        const data = await response.json();

        if (data.results) {
            return data;
        } else {
            displayErrorOnSite("Error", "Something went wrong while fetching data; try again later.")
            return null;
        }
    } catch(error) {
        displayErrorOnSite("Error", error)
        return null;
    }
};

/* För VG betyg, få mer information om en movie */
export const getMovieDetails = async (movieId) => {
    const response = await fetch(`${base_url}/movie/${movieId}?api_key=${api_key}`);
    const data = await response.json();
    return data;
};

export const queryMovies = async (query) => {
    const response = await fetch(`${base_url}/search/movie?query=${query}&api_key=${api_key}`);
    const data = await response.json();
    return data;
}

export const queryPeople = async (query) => {
    const response = await fetch(`${base_url}/search/person?query=${query}&api_key=${api_key}`);
    const data = await response.json();
    return data;
}