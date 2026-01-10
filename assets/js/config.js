/** 
 * @module config
 * Module responsible for maintaining all of the configuration for this site.
**/
export const api_key = '052ed265ba361437d37e84502608856e';
export const base_url = 'https://api.themoviedb.org/3';
export const base_image_url = 'https://image.tmdb.org/t/p';

export const image_sizes = {
    poster: {
        small: 'w185',
        medium: 'w342',
        large: 'w500',
        original: 'original'
    },
    backdrop: {
        small: 'w300',
        medium: 'w780',
        large: 'w1280',
        original: 'original'
    },
    profile: {
        small: 'w45',
        medium: 'w185',
        large: 'h632',
        original: 'original'
    }
};

export const placeholder_images = {
    poster: 'https://placehold.co/342x513?text=No+Poster',
    profile: 'https://placehold.co/185x278?text=No+Photo',
    backdrop: 'https://placehold.co/780x439?text=No+Backdrop'
};