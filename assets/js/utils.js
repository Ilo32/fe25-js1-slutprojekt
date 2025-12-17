import { base_image_url, image_sizes, placeholder_images } from './config.js';

export function getImageUrl(path) {
    if (!path) return placeholder_images["poster"] || placeholder_images.poster;
    return `${base_image_url}/${image_sizes["poster"]?.["medium"] || 'w342'}${path}`;
}

export function displayErrorOnSite(Description) {
    const errorContainer = document.createElement('span');
    const errorTitle = document.createElement('h2');
    const errorContent = document.createElement('p');
    const errorFooter = document.createElement('p');
    errorFooter.classList.add('message-muted')
    errorTitle.textContent = "Error";
    errorContent.textContent = Description;
    errorFooter.textContent = "Click me to hide the error.";

    errorContainer.appendChild(errorTitle);
    errorContainer.appendChild(errorContent);
    errorContainer.appendChild(errorFooter);
    document.getElementById('message-container').appendChild(errorContainer);

    errorContainer.addEventListener('click', () => {
       errorContainer.remove();
    });
}