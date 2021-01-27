

// Selecting elements from the DOM
const buttonElement = document.querySelector('#search');
const inputElement = document.querySelector('#inputValue');
const movieSearchable = document.querySelector('#movies-searchable');
const moviesContainer = document.querySelector('#movies-container');



function movieSection(movies) {
    return movies.map((movie) => {
        if (movie.poster_path) {
            return `<img 
                src=${IMAGE_URL + movie.poster_path} 
                data-movie-id=${movie.id}/>`
        }
    })
}

function createMovieContainer(movies, title = '') {
    const movieElement = document.createElement('div');
    movieElement.setAttribute('class', 'movie');

    const movieTemplate = `
    <h2>${title}</h2>
    <section class="section">
    ${movieSection(movies)}
    </section>
    <div class="content">
      <p id="content-close">X</p>
    </div>
    `;

    movieElement.innerHTML = movieTemplate;
    return movieElement;
}

function renderSearchMovies(data) {
    // remove last search results from DOM
    movieSearchable.innerHTML = '';
    // data results
    const movies = data.results;
    const movieBlock = createMovieContainer(movies);
    movieSearchable.appendChild(movieBlock)
}
function renderMovies(data) {
    // remove last search results from DOM
    // data results
    const movies = data.results;
    const movieBlock = createMovieContainer(movies, this.title);
    moviesContainer.appendChild(movieBlock)
}


function handleError(error) {
    console.log('Error: ', error);
}
// Search feature
buttonElement.onclick = function (event) {
    event.preventDefault();
    const value = inputElement.value;
    searchMovie(value)

    inputElement.value = '';
}

// Create iframe
function createIframe(video) {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${video.key}`;
    iframe.width = `360`;
    iframe.height = `315`;
    iframe.allowFullscreen = true;

    return iframe;
}

function createVideoTemplate(data, content) {
    content.innerHTML = `<p id="content-close">X</p>`;
    console.log('Videos: ', data);
    const videos = data.results;
    const length = videos.length > 4 ? 4 : videos.length;
    const iframeContainer = document.createElement('div')

    for (let index = 0; index < length; index++) {
        const video = videos[index]; //video
        const iframe = createIframe(video);
        iframeContainer.appendChild(iframe);
        content.appendChild(iframeContainer);

    }
}

// Event delegation
document.onclick = function (event) {
    const target = event.target;
    if (target.tagName.toLowerCase() === 'img') {
        // console.log('Event: ', event);
        const movieId = target.dataset.movieId;
        // console.log(movieId);
        const section = event.target.parentElement; //section
        const content = section.nextElementSibling; //content
        content.classList.add('content-display');

        const path = `/movie/${movieId}videos`;
        const url = generateUrl(path)
        // fetch movie videos
        fetch(url)
            .then((res) => res.json())
            .then((data) => createVideoTemplate(data, content))
            .catch((error) => {
                console.log('Error: ', error);
            });
    }

    if (target.id === 'content-close') {
        const content = target.parentElement;
        content.classList.remove('content-display');
    }
}

getNowPlaying();
getUpcomingMovies();
getTopRatedMovies();
getPopularMovies();