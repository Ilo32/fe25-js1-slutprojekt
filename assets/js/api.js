/** 
 * @module api
 * Module responsible everything that handles API calls.
**/
import { api_key, base_url } from './config.js';

export const getTop10Movies = async (type) => {
    const response = await fetch(`${base_url}/movie/${type}?api_key=${api_key}`)
    return response
};

export const getMovieDetails = async (movieId) => {
    const response = await fetch(`${base_url}/movie/${movieId}?api_key=${api_key}&append_to_response=credits,videos`);
    return response
};

export const getPeopleDetails = async (personId) => {
    const response = await fetch(`${base_url}/person/${personId}?api_key=${api_key}`);
    return response
};

export const queryMovies = async (query) => {
    const response = await fetch(`${base_url}/search/movie?query=${query}&api_key=${api_key}`);
    return response
}

export const queryPeople = async (query) => {
    const response = await fetch(`${base_url}/search/person?query=${query}&api_key=${api_key}`);
    return response
}