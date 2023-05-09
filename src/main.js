//data

const paramsLang = () => {

  if (document.documentElement.lang === 'es') {
    return { 'language': document.documentElement.lang || 'en' }

  }else{
    return { 'language': document.documentElement.lang || 'es' }
  }

};


let lang;
async function getLang() {

  let trendingTitle = 'Trending',
    trendingBtn = 'See more',
    likedTitle = 'Favorite movies',
    categoriesTitle = 'Categories',
    relatedMovies = 'Similar movies',
    likedMoviesH2 = 'No favorite movies';

  let words = { 'trendingTitle': trendingTitle, 'trendingBtn': trendingBtn, 'likedTitle': likedTitle, 'categoriesTitle': categoriesTitle, 'relatedMovies': relatedMovies, 'likedMoviesH2': likedMoviesH2 };

  //console.log(words);

  if (document.documentElement.lang != 'en') {

    lang = document.documentElement.lang;
    //navigator.language = lang;

    for (const key in words) {
      if (Object.hasOwnProperty.call(words, key)) {
        const word = words[key];
        //console.log(word);
        const { data } = await apiLang('', {
          params: {
            q: word,
            langpair: `en|${lang}`
          }
        })
        let newText = data.responseData.translatedText;
        words[key] = newText;
      }
    }

    $trendingTitleText.textContent = words['trendingTitle'];
    $trendingBtnText.textContent = words['trendingBtn'];;
    $likedTitleText.textContent = words['likedTitle'];;
    $categoriesPreviewTitleText.textContent = words['categoriesTitle'];;
    $relatedMoviesTitleText.textContent = words['relatedMovies'];
    $likedMovieListH2.textContent = words['likedMoviesH2']
    
  } else {
    lang = document.documentElement.lang;
    console.log(lang);
    $trendingTitleText.textContent = words['trendingTitle'];
    $trendingBtnText.textContent = words['trendingBtn'];;
    $likedTitleText.textContent = words['likedTitle'];;
    $categoriesPreviewTitleText.textContent = words['categoriesTitle'];;
    $relatedMoviesTitleText.textContent = words['relatedMovies'];;
    $likedMovieListH2.textContent = words['likedMoviesH2']
  }

  getCategoriesPreview(lang)
  
}
const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
  params: {
    'api_key':API_KEY,
    ...paramsLang()
  }
});




const apiLang = axios.create({
  //https://api.mymemory.translated.net/get?q=Hello%20World!&langpair=en|it
  //apikey: 7f42237b07e4048a6978
  baseURL:'https://api.mymemory.translated.net/get',
  params: {
    'key': '7f42237b07e4048a6978' 
  }

})






function likedMoviesList() {
  const item = JSON.parse(localStorage.getItem('liked_movies'));
  let movies;
  if (item) {
    movies = item;
  }else{
    movies = {};
  }
  return movies; 
}


function likeMovie(movie) {
  const likedMovies = likedMoviesList();
  console.log(likedMovies);

  if (likedMovies[movie.id]) {
    //removerla del ls
    likedMovies[movie.id] = undefined;
    
  }else{
    //agregarla a ls
    likedMovies[movie.id] = movie;
  }

  localStorage.setItem('liked_movies',JSON.stringify(likedMovies));
  
}


//Utils

const lazyLoader = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    //console.log(entry.target.setAttribute);
    if (entry.isIntersecting) { 
      const url = entry.target.getAttribute('data-img');
      entry.target.setAttribute('src', url);
    }

  })
});


function createMovies(movies, container, {lazyLoad = false, clean = true}={}) {
  if (clean) {
    container.innerHTML = '';
  }

  movies.forEach(movie => {
    const $movieContainer = document.createElement('div');
    $movieContainer.classList.add('movie-container');
    
    
    const  $movieImg = document.createElement('img');
    $movieImg.classList.add('movie-img');
    $movieImg.setAttribute('alt', movie.title);

    $movieImg.setAttribute( lazyLoad ? 'data-img':'src', 'https://image.tmdb.org/t/p/w300'+movie.poster_path);
    $movieImg.addEventListener('click', () => {
      location.hash = '#movie=' + movie.id;
    })

    $movieImg.addEventListener('error', () => {
      //console.log(movie.genre_ids[0]);
      $movieImg.setAttribute('src', 'https://static.platzi.com/static/images/error/img404.png'); 
    });

    const $movieBtn = document.createElement('button');
    $movieBtn.classList.add('movie-btn');
    likedMoviesList()[movie.id] && $movieBtn.classList.add('movie-btn--liked');
    $movieBtn.addEventListener('click', () => {
      $movieBtn.classList.toggle('movie-btn--liked');
      likeMovie(movie);
      getLikedMovies();
    })


    if (lazyLoad) {
      lazyLoader.observe($movieImg);
    }

    $movieContainer.appendChild($movieImg);
    $movieContainer.appendChild($movieBtn);
    container.appendChild($movieContainer);
    
  });

}

function createCategories(categories, container) {
  container.innerHTML = '';

  categories.forEach(category => {

    const $categoryContainer = document.createElement('div');
    $categoryContainer.classList.add('category-container');

    const $categoryTitle = document.createElement('h3');
    $categoryTitle.classList.add('category-title');
    $categoryTitle.setAttribute('id', 'id' + category.id);
    $categoryTitle.addEventListener('click', () => {
      location.hash = `#category=${category.id}-${category.name}`;
    });


    const $categoryTitleText = document.createTextNode(category.name)

    $categoryTitle.appendChild($categoryTitleText);
    $categoryContainer.appendChild($categoryTitle);

    container.appendChild($categoryContainer);

  });

}


//Llamados al API

async function getTrendingMoviesPreview() {
  /* const res = await fetch('https://api.themoviedb.org/3/trending/movie/day?api_key='+ API_KEY),
    data = await res.json(); */
  
  const { data } = await api('trending/movie/day');
  const movies = data.results;

  createMovies(movies, $trendingMoviesPreviewList, true);


}

async function getCategoriesPreview(lang = '') {

  const { data } = await api('genre/movie/list', {
    params: {
      'language': lang
    }
  });
  const categories = data.genres;

  createCategories(categories, $categoriesPreviewList);

}

async function getMoviesByCategory(id) {
  const { data } = await api('discover/movie', {
    params: {
      with_genres: id,
    }
  });
  const movies = data.results;
  maxPage = data.total_pages;
  createMovies(movies, $genericSection, {lazyLoad: true});
}

function getPaginationMoviesByCategory(id) {
  return async function () {

    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const scrollIsBottom = (scrollTop + clientHeight) >= scrollHeight;

    const pageIsNotMax = page < maxPage;

    if (scrollIsBottom && pageIsNotMax) {
      page++;
      const { data } = await api('discover/movie', {
        params: {
          with_genres: id,
          page
        }
      });
      const movies = data.results;
      createMovies(movies, $genericSection, { lazyLoad: true, clean: false });
    }
  }
}

async function getMoviesBySearch(query) {
  const { data } = await api('search/movie', {
    params: {
      query
    }
  });
  const movies = data.results;
  maxPage = data.total_pages;
  console.log(maxPage);
  createMovies(movies, $genericSection);
}

function getPaginationMoviesBySearch(query) {
  return async function () {

    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const scrollIsBottom = (scrollTop + clientHeight) >= scrollHeight;

    const pageIsNotMax = page < maxPage;

    if (scrollIsBottom && pageIsNotMax) {
      page++;
      const { data } = await api('search/movie', {
        params: {
          query,
          page
        }
      });
      const movies = data.results;
      createMovies(movies, $genericSection, { lazyLoad: true, clean: false });
    }
  }
}

async function getTrendingMovies() {
  const { data } = await api('trending/movie/day');
  const movies = data.results;
  maxPage = data.total_pages;
  createMovies(movies, $genericSection,{lazyLoad: true, clean: true});

}

async function getPaginationTrendingMovies() {

  const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
  const scrollIsBottom = (scrollTop + clientHeight) >= scrollHeight;

  const pageIsNotMax = page < maxPage;

  if (scrollIsBottom && pageIsNotMax) {
    page++;
    const { data } = await api('trending/movie/day', {
      params: {
        page
      }
    });
    const movies = data.results;
    createMovies(movies, $genericSection, { lazyLoad: true, clean: false });
  } 
}

async function getMovieById(id) {
  const { data: movie } = await api('movie/'+id);

  const movieImgURL = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;

  console.log(movieImgURL);
  $headerSection.style.background = `
  linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%),
  url(${movieImgURL})`;

  $movieDetailTitle.textContent = movie.title;
  $movieDetailDescription.textContent = movie.overview;
  $movieDetailScore.textContent = movie.vote_average;

  createCategories(movie.genres, $movieDetailCategoriesList);
  getRelatedMoviesId(id);
}

async function getRelatedMoviesId(id) {
  const { data } = await api(`movie/${id}/recommendations`),
    relatedMovies = data.results;

  createMovies(relatedMovies, $relatedMoviesContainer);
}

function getLikedMovies() {
  const likedMovies = likedMoviesList();
  const moviesArray = Object.values(likedMovies)
  //console.log(moviesArray);

  createMovies(moviesArray, $likedMoviesListArticle, { lazyLoad: true, clean: true });


  if (moviesArray.length === 0) {
    console.log('There are no favorite movies');

    //const emptyH2 = document.createElement('h2');
    //emptyH2.textContent = 'No hay peliculas';
    $likedMoviesListArticle.classList.add('inactive');
    $likedMovieListH2.classList.remove('inactive');
    //$likedMoviesListArticle.appendChild(emptyH2);
  }



}

