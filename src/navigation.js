let maxPage;
let page = 1,
  infiniteScroll;

$searchForm.addEventListener('click', ()=> {
  location.hash = '#search=' + $searchFormInput.value;
})
$trendingBtn.addEventListener('click', ()=> {
  location.hash = '#trends';
})
$arrowBtn.addEventListener('click', ()=> {

  history.back();
  
})

window.addEventListener('DOMContentLoaded', getLang, false);
window.addEventListener('languagechange', getLang);
window.addEventListener('DOMContentLoaded', navigator, false);
langBtn.addEventListener('click', ()=> {
  console.log(api);
  if ($languageBtn.textContent === 'es') {
    $languageBtn.textContent = 'en';
    document.documentElement.lang = 'en';
  }else{
    $languageBtn.textContent = 'es';
    document.documentElement.lang = 'es';
  }
  getLang();
})



window.addEventListener('hashchange', navigator, false);
window.addEventListener('scroll', infiniteScroll, false);


function navigator() {
  //console.log({location});
  navigator.language = document.documentElement.lang;


  if (infiniteScroll) {
    window.removeEventListener('scroll', infiniteScroll, {passive: false});
    infiniteScroll = undefined;
  }

  if (location.hash.startsWith('#trends')) {
    trendsPage();
  }else if(location.hash.startsWith('#search=')){
    searchPage();
  }else if(location.hash.startsWith('#movie=')){
    movieDetailsPage();
  }else if(location.hash.startsWith('#category=')){
    categoriesPage();
  }else {
    homePage();
  }
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  if (infiniteScroll) {
    window.addEventListener('scroll', infiniteScroll, { passive: false });
  }
}

function homePage() {
  //console.log('HOME!');

  $headerSection.classList.remove('header-container--long');
  $headerSection.style.background = '';
  $arrowBtn.classList.add('inactive');
  $arrowBtn.classList.remove('header-arrow--white');

  $headerTitle.classList.remove('inactive');
  $headerCategoryTitle.classList.add('inactive');
  $searchForm.classList.remove('inactive');
  
  $trendingPreviewSection.classList.remove('inactive');
  $likedMoviesSection.classList.remove('inactive');
  $categoriesPreviewSection.classList.remove('inactive');
  $genericSection.classList.add('inactive');
  $movieDetailSection.classList.add('inactive');

  getTrendingMoviesPreview();
  getCategoriesPreview();
  getLikedMovies();

}
function categoriesPage() {
  console.log('CATEGORIES!');

  $headerSection.classList.remove('header-container--long');
  $headerSection.style.background = '';
  $arrowBtn.classList.remove('inactive');
  $arrowBtn.classList.remove('header-arrow--white');

  $headerTitle.classList.add('inactive');
  $headerCategoryTitle.classList.remove('inactive');
  $searchForm.classList.add('inactive');

  $trendingPreviewSection.classList.add('inactive');
  $categoriesPreviewSection.classList.add('inactive');
  $likedMoviesSection.classList.add('inactive');
  $genericSection.classList.remove('inactive');
  $movieDetailSection.classList.add('inactive');

  const [_, categoryData] = location.hash.split('='), //['#category', 'id-name']
    [categoryId, categoryName] = categoryData.split('-')//['id', 'name']
  
  $headerCategoryTitle.innerHTML = categoryName;

  getMoviesByCategory(categoryId);

  infiniteScroll = getPaginationMoviesByCategory(categoryId);


}
function movieDetailsPage() {
  console.log('MOVIE!');

  $headerSection.classList.add('header-container--long');
  //$headerSection.style.background = '';
  $arrowBtn.classList.remove('inactive');
  $arrowBtn.classList.add('header-arrow--white');

  $headerTitle.classList.add('inactive');
  $headerCategoryTitle.classList.add('inactive');
  $searchForm.classList.add('inactive');

  $trendingPreviewSection.classList.add('inactive');
  $categoriesPreviewSection.classList.add('inactive');
  $likedMoviesSection.classList.add('inactive');

  $genericSection.classList.add('inactive');
  $movieDetailSection.classList.remove('inactive');

  const [_, movieId] = location.hash.split('='); //['#movie', '234517']

  getMovieById(movieId);

}
function searchPage() {
  console.log('SEARCH!');

  $headerSection.classList.remove('header-container--long');
  $headerSection.style.background = '';
  $arrowBtn.classList.remove('inactive');
  $arrowBtn.classList.remove('header-arrow--white');

  $headerTitle.classList.add('inactive');
  $headerCategoryTitle.classList.add('inactive');
  $searchForm.classList.remove('inactive');

  $trendingPreviewSection.classList.add('inactive');
  $categoriesPreviewSection.classList.add('inactive');
  $likedMoviesSection.classList.add('inactive');

  $genericSection.classList.remove('inactive');
  $movieDetailSection.classList.add('inactive');

  const [_, query] = location.hash.split('=') //['#search', 'valorBuscado']
  getMoviesBySearch(query);

  infiniteScroll = getPaginationMoviesBySearch(query);

}
function trendsPage() {
  console.log('TRENDS!');

  $headerSection.classList.remove('header-container--long');
  $headerSection.style.background = '';
  $arrowBtn.classList.remove('inactive');
  $arrowBtn.classList.remove('header-arrow--white');

  $headerTitle.classList.add('inactive');
  $headerCategoryTitle.classList.remove('inactive');
  $searchForm.classList.add('inactive');

  $trendingPreviewSection.classList.add('inactive');
  $categoriesPreviewSection.classList.add('inactive');
  $likedMoviesSection.classList.add('inactive');
  $genericSection.classList.remove('inactive');
  $movieDetailSection.classList.add('inactive');

  $headerCategoryTitle.innerHTML = 'Tendencias';
  getTrendingMovies();

  infiniteScroll = getPaginationTrendingMovies;
}
