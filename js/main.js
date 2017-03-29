/**
TODO:
1. Hook up find a movie now to OMDB endpoint
**/

//Getting the html elements
var modal = document.getElementById('movieInfo');
var movieCounterNav = document.getElementById('movieCounterNav');
var movies = document.getElementsByClassName('movie');
var modalContainer = document.getElementsByClassName('modal-container')[0];
var moviesContainer = document.getElementsByClassName('container-movies')[0];
var modalBackButton = document.getElementsByClassName('back')[0];
var modalRentButton = document.getElementsByClassName('rent')[0];
var checkoutContainer = document.getElementsByClassName('container-checkout')[0];
var messagesContainer = document.getElementById('message');
var availableMovies = {};


//Functions
function bulkListenerAddMovie(movieElem){
     movieElem.addEventListener("click", function () {
     modal.style.display = "block";
     console.log (this.id);
     modifyModalElement(availableMovies[this.id])
     localStorage.isMovieModalOpen = "true";
  });
}

function modifyModalElement(movie){
    document.getElementsByClassName('modal-container-image')[0].children[0].src = movie.imageURL;
    document.getElementsByClassName('movie-title')[0].innerHTML = movie.title;
    document.getElementsByClassName('movie-plot')[0].innerHTML  = movie.plot;
    document.getElementsByClassName('movie-cast')[0].innerHTML  = movie.actors;
    document.getElementsByClassName('released-date')[0].innerHTML  = movie.release;

    var lModalMovieInf = JSON.stringify(movie);
    localStorage.modalMovieInfo = lModalMovieInf;
}

function httpClient(protocol, url, callback){
  var httpClient = new XMLHttpRequest();
  httpClient.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
       callback.apply(httpClient);
    }
  };
  httpClient.open(protocol, url, true);
  httpClient.send();
}

function movie(title, imageURL, imdbID, actors, released, plot){
  this.title = title;
  this.imageURL = imageURL;
  this.imdbID = imdbID;
  this.actors = actors;
  this.release = released;
  this.plot = plot;
}

function createMovieElement(movie, callback){
  var movDiv = document.createElement('div');
  movDiv.className = "movie";
  movDiv.id = movie.Title;

  var movPoster = document.createElement('img');
  movPoster.src = movie.Poster;
  movDiv.appendChild(movPoster);
  bulkListenerAddMovie(movDiv);
  callback.apply(movDiv);
}

function fadeIfRented(mID){
  document.getElementById(mID).style.opacity = 0.5;
}

function updateCheckoutCounterElement(){
  movieCounterNav.innerHTML = ": " + JSON.parse(localStorage.checkedOutMovies).length;
}

function closeModal(){
  modal.style.display = "none";
  localStorage.isMovieModalOpen = "false";
}

function succesfullyRented(movTitle){
  alert('Successfully rented "'+ movTitle + '" !');
  updateCheckoutCounterElement();
  fadeIfRented(movTitle);
}

function rentMovie(movieSelected){
  var lCheckedOutMovies = localStorage.checkedOutMovies;

  if( lCheckedOutMovies === '[]' || !lCheckedOutMovies){
    lCheckedOutMovies = [movieSelected.title];
    localStorage.checkedOutMovies = JSON.stringify(lCheckedOutMovies);
    succesfullyRented(movieSelected.title);
  }
  else{
      lCheckedOutMovies = JSON.parse(lCheckedOutMovies);
      if(!lCheckedOutMovies.includes(movieSelected.title)){
        lCheckedOutMovies.push(movieSelected.title);
        localStorage.checkedOutMovies = JSON.stringify(lCheckedOutMovies);
        succesfullyRented(movieSelected.title);
        closeModal();
      }
      else{
        alert("Movie is already checked out! Select another movie!");
        fadeIfRented(movieSelected.title);
        closeModal();
      }
  }
}


//Add Event listeners
modalBackButton.addEventListener('click', closeModal);

window.addEventListener('click', function(){
  if(event.target === modal){
    closeModal();
  }
});

modalRentButton.addEventListener('click', function(){
   var rentMovieTitle = document.getElementsByClassName('movie-title')[0].innerHTML;
   rentMovie(availableMovies[rentMovieTitle]);
});


//When page loads or reloads
window.onload = function loadDoc() {

  //Check if modal was open before reloading the page
  if(localStorage.isMovieModalOpen == 'true'){
    var lModalMovieInfo = JSON.parse(localStorage.modalMovieInfo);
    modifyModalElement(lModalMovieInfo);
    modal.style.display = "block";
  }

  //Render Movies
  httpClient("GET","data/movieList.json",function(){
    var movieRecommendations = JSON.parse(this.response);

    //iterates to movies
    for(var index in movieRecommendations){

         var movieRecommendationsItem = movieRecommendations[index];
         var newMovie = new movie(movieRecommendationsItem.Title, movieRecommendationsItem.Poster,movieRecommendationsItem.imdbID, movieRecommendationsItem.Actors, movieRecommendationsItem.Released, movieRecommendationsItem.Plot);

         availableMovies[newMovie.title] = newMovie;

         //Populate movies container with movie elements
         createMovieElement(movieRecommendationsItem, function(){
           if(localStorage.checkedOutMovies){

             var checkoutMovieList =  JSON.parse(localStorage.checkedOutMovies);

             if(checkoutMovieList.includes(this.id))
              this.style.opacity = 0.5

           }
           moviesContainer.appendChild(this);
         });
    }

    if(localStorage.checkedOutMovies){
      updateCheckoutCounterElement();
    }
  });
}
