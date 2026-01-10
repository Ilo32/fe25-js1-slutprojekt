/** 
 * @module render
 * Module responsible for rendering mostly everything on the main website.
**/
import { displayErrorOnSite, getImageUrl } from './utils.js';
import { queryPeople, getMovieDetails, queryMovies } from './api.js'

const listContainer = document.getElementById('top10-container');
const resultsContainer = document.getElementById('results-container');

async function showModal(movieId) {
    getMovieDetails(movieId)
        .then(async (responseData) => {
            const data = await responseData.json();

            const modal = document.createElement('div');
            const card = document.createElement('div');
            const modalContent = document.createElement('div');
            const closeBtn = document.createElement('button');

            const movieTitleElement = document.createElement('h2');
            const movieImageElement = document.createElement('img');
            const movieTaglineElement = document.createElement('p');
            const metaContainer = document.createElement('div');
            const movieRatingElement = document.createElement('p');
            const movieRuntimeElement = document.createElement('p');
            const movieGenresElement = document.createElement('p');
            const movieDirectorElement = document.createElement('p');
            const movieOverviewElement = document.createElement('p');
            const trailerContainer = document.createElement('div');
            const actorsContainer = document.createElement('div');

            modal.classList.add('main-modal');
            card.classList.add('modal-card');
            modalContent.classList.add('modal-content');
            closeBtn.classList.add('modal-close');
            metaContainer.classList.add('modal-meta');
            movieTaglineElement.classList.add('movie-tagline');
            trailerContainer.classList.add('modal-trailer');
            actorsContainer.classList.add('modal-actors');

            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-modal', 'true');

            const releaseYear = data.release_date ? data.release_date.substring(0,4) : '';
            const formattedTitle = data.title + (releaseYear ? ` (${releaseYear})` : '');

            closeBtn.textContent = 'X';
            movieTitleElement.textContent = formattedTitle;
            movieImageElement.src = getImageUrl(data.poster_path, 'poster');
            movieImageElement.alt = `Image of ${data.title}`;

            if (data.tagline) {
                movieTaglineElement.textContent = `"${data.tagline}"`;
            }

            const rating = typeof data.vote_average === 'number' ? data.vote_average.toFixed(1) : 'N/A';
            const votes = data.vote_count || 'N/A';
            movieRatingElement.textContent = `Rating: ${rating} / 10 (${votes} votes)`;

            const runtime = data.runtime ? `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m` : 'N/A';
            movieRuntimeElement.textContent = `Runtime: ${runtime}`;

            const genres = Array.isArray(data.genres) && data.genres.length ? data.genres.map(g => g.name).join(', ') : 'N/A';
            movieGenresElement.textContent = `Genres: ${genres}`;

            const director = data.credits && Array.isArray(data.credits.crew) ? data.credits.crew.find(c => c.job === 'Director') : null;
            if (director) {
                movieDirectorElement.textContent = `Director: ${director.name}`;
            }

            movieOverviewElement.textContent = data.overview || 'No overview available.';

            const videos = data.videos && Array.isArray(data.videos.results) ? data.videos.results : [];
            const trailer = videos.find(v => v.site === 'YouTube' && v.type === 'Trailer') || videos.find(v => v.site === 'YouTube');
            if (trailer && trailer.key) {
                const iframe = document.createElement('iframe');
                iframe.src = `https://www.youtube.com/embed/${trailer.key}?rel=0`;
                iframe.title = `${data.title} trailer`;
                iframe.setAttribute('allowfullscreen', '');
                trailerContainer.appendChild(iframe);
            }

            card.appendChild(movieImageElement);
            card.appendChild(modalContent);

            modalContent.appendChild(movieTitleElement);
            if (movieTaglineElement.textContent) modalContent.appendChild(movieTaglineElement);

            metaContainer.appendChild(movieRatingElement);
            metaContainer.appendChild(movieRuntimeElement);
            metaContainer.appendChild(movieGenresElement);
            if (movieDirectorElement.textContent) metaContainer.appendChild(movieDirectorElement);
            modalContent.appendChild(metaContainer);

            if (trailerContainer.children.length) modalContent.appendChild(trailerContainer);

            modalContent.appendChild(movieOverviewElement);

            modal.appendChild(card);
            modal.appendChild(closeBtn);
            document.body.appendChild(modal);

            const closeModal = () => {
                modal.remove();
                document.removeEventListener('keydown', onKeyDown);
            };
            
            closeBtn.addEventListener('click', closeModal);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            });
            const onKeyDown = (e) => {
                if (e.key === 'Escape') {
                    closeModal();
                }
            };
            document.addEventListener('keydown', onKeyDown);
        })
        .catch(async (responseData) => {
            displayErrorOnSite(500);
            console.error(responseData);
        });
};

async function showQueriedMovies(response) {
    const movies = response.results;
    const spliceMovies = movies.splice(0, 10);

    for (const movie of spliceMovies) {
        const card = document.createElement('button');
        const movieImageElement = document.createElement('img');
        const textDiv = document.createElement('div');
        const movieTitleElement = document.createElement('h4');
        const movieVoteElement = document.createElement('p');
        const movieReleaseElement = document.createElement('p');
        const movieDescriptionElement = document.createElement('p');

        card.classList.add('top10-card');
        textDiv.classList.add('p-2', 'w-100')

        movieTitleElement.textContent = movie.title;
        movieVoteElement.textContent = movie.vote_average;
        movieImageElement.src = getImageUrl(movie.poster_path)
        movieImageElement.alt = `Image of ${movie.title}`

        const shortenedOverview = movie.overview.length > 64 ? movie.overview.substring(0, 64) + "..." : movie.overview;
        movieDescriptionElement.textContent = shortenedOverview

        textDiv.appendChild(movieTitleElement);
        textDiv.appendChild(movieVoteElement);
        textDiv.appendChild(movieReleaseElement);
        textDiv.appendChild(movieDescriptionElement)
        card.appendChild(movieImageElement);
        card.appendChild(textDiv);
        resultsContainer.appendChild(card); 

        card.addEventListener('click', () => {
            console.log("Click")
            showModal(movie.id);
        });
    }
};

async function showQueriedPeople(response) {
    const people = response.results;

    const splicePeople = people.splice(0, 10);
    for (const person of splicePeople) {
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
    
        const slice = person.known_for.splice(0, 3)
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


export const showMovieCard = async (movie, hideDescription) => {
    const card = document.createElement('button');
    card.classList.add('top10-card');
    card.setAttribute("id" , movie.id);

    const movieImage = document.createElement('img');
    const textDiv = document.createElement('div');
    textDiv.classList.add('p-2', 'w-100')

    const movieTitle = document.createElement('h4');
    const movieVote = document.createElement('p');
    const movieRelease = document.createElement('p');
    console.log(hideDescription)
    const movieDescription = hideDescription ? "" : document.createElement('p');

    movieTitle.textContent = movie.title;
    movieRelease.textContent = movie.release_date;
    movieImage.src = getImageUrl(movie.poster_path)
    movieImage.alt = `Image of ${movie.title}`

    const shortenedOverview = movie.overview.length > 64 ? movie.overview.substring(0, 64) + "..." : movie.overview;
    if (!hideDescription) {
        movieDescription.textContent = shortenedOverview
        textDiv.appendChild(movieDescription)
    }
    
    textDiv.appendChild(movieTitle);
    textDiv.appendChild(movieVote);
    textDiv.appendChild(movieRelease);

    card.appendChild(movieImage);
    card.appendChild(textDiv);
    listContainer.appendChild(card);

    card.addEventListener('click', () => {
        showModal(movie.id);
    });
};

export async function showQuery() {
    resultsContainer.innerHTML = '';
    const searchInputType = document.getElementById('search-type').value
    const searchInputValue = document.getElementById('search-input').value
    try {
        if (searchInputType === "movie") {
            queryMovies(searchInputValue)
            .then(async (responseData) => {
                const data = await responseData.json();
                console.log(data)
                if (data.total_results === 0) {
                    displayErrorOnSite(404)
                }
                return showQueriedMovies(data);
            })
            .catch((responseData) => {
                if (!window.navigator.onLine) {
                    return displayErrorOnSite(418);
                }
                displayErrorOnSite(500);
                console.error(responseData);
            });
        }
        if (searchInputType === "person") {
            queryPeople(searchInputValue)
            .then(async (responseData) => {
                const data = await responseData.json();
                if (data.total_results === 0) {
                    displayErrorOnSite(404)
                }
                return showQueriedPeople(data);
            })
            .catch((responseData) => {
                if (!window.navigator.onLine) {
                    return displayErrorOnSite(418);
                }
                displayErrorOnSite(500);
                console.error(responseData);
            });
        }
    } catch(error) {
        console.error(error)
        displayErrorOnSite("An unexpected error occurred, please try again later.");
    }
};