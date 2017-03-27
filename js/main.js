/**
TODO:
1. Local Storage for Name, Email Checked out items.
2. Dynamically populate modal based on selected movie based json values /
3. Create a checkout modal
4. Hook up find a movie now to OMDB endpoint
5. About page
**/

var movies = document.getElementsByClassName('movie');
var modal = document.getElementById('movieInfo');
var moviesContainer = document.getElementsByClassName('container-movies')[0];
var availableMovies = {};
var checkedOutMovies = {};

if(!localStorage.checkedOutMovies)
  localStorage.checkedOutMovies= {};

if(!localStorage.availableMovies)
  localStorage.availableMovies = {};


//Functions
function bulkListenerAddMovie(movieElem){
  movieElem.addEventListener("click", function () {
     modal.style.display = "block";
     console.log (this.id);
     modifyModalElement(availableMovies[this.id])
     localStorage.isMovieModalOpen = "true";
  })
}

function modifyModalElement(movie){
    document.getElementsByClassName('modal-container-image')[0].children[0].src = movie.imageURL;
    document.getElementsByClassName('movie-title')[0].innerHTML = movie.title;
    document.getElementsByClassName('movie-plot')[0].innerHTML  = movie.plot;
    document.getElementsByClassName('movie-cast')[0].innerHTML  = movie.actors;
    document.getElementsByClassName('released-date')[0].innerHTML  = movie.release;
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

//Add listeners to movies
for(var idNum = 0; idNum <= movies.length-1; idNum++){
  var movie = movies[idNum]
  bulkListenerAddMovie(movie);
}


window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        localStorage.isMovieModalOpen = "false";
    }
}



window.onload = function loadDoc() {
  httpClient("GET","data/recommendations.json",function(){

    var movieRecommendations = JSON.parse(this.response);

    for(var index in movieRecommendations){
         var newMovie = new movie(movieRecommendations[index].Title,movieRecommendations[index].Poster,movieRecommendations[index].imdbID, movieRecommendations[index].Actors, movieRecommendations[index].Released, movieRecommendations[index].Plot);
         availableMovies[newMovie.title] = newMovie;
         createMovieElement(movieRecommendations[index], function(){
           moviesContainer.appendChild(this);
         });


    }
  });
}
