import { base_image_url, image_sizes, placeholder_images } from './config.js';

export function getImageUrl(path) {
    if (!path) return placeholder_images["poster"] || placeholder_images.poster;
    return `${base_image_url}/${image_sizes["poster"]?.["medium"] || 'w342'}${path}`;
}

export function displayErrorOnSite(code) {
    const messageContainer = document.getElementById('message-container')
    
    const responseData = code.status ? code.status : code
    const translatedError = {
        [200] : "How do you even get this as an error?",
        [500] : "Something went wrong on our side; try again later!",
        [404] : "The requested resource could not be found.",
        [401] : "You are not authorized to access the requested resource.",
        [403] : "Access to the requested resource is forbidden.",
        [408] : "The request timed out; please try again.",
        [429] : "Too many requests; please slow down your requests."
    }

    console.log(code, responseData, typeof(responseData));
    let error = code;
    if (typeof(responseData) === "number") {
        error = translatedError[responseData];
    } else {
        error = "Something went wrong on our side; try again later.";
        console.error(code);
    }

    const errorContainer = document.createElement('span');
    const errorTitle = document.createElement('h2');
    const errorContent = document.createElement('p');
    const errorFooter = document.createElement('p');
    errorFooter.classList.add('message-muted')
    errorTitle.textContent = "Error";
    errorContent.textContent = error;
    errorFooter.textContent = "Click me to hide the error.";

    errorContainer.appendChild(errorTitle);
    errorContainer.appendChild(errorContent);
    errorContainer.appendChild(errorFooter);
    messageContainer.appendChild(errorContainer);

    errorContainer.addEventListener('click', () => {
       errorContainer.remove();
    });
}