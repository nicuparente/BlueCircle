var moviesLength = document.getElementsByClassName("movie");
var modal = document.getElementById('movieInfo');
var span = document.getElementsByClassName("close")[0];

//Add listeners to movies
for(var idNum = 0; idNum <= moviesLength.length-1; idNum++){
  var movie = moviesLength[idNum]
  //var movie = document.getElementById('movie' + id0Num);
  bulkListenerAddMovie(movie);
}


function bulkListenerAddMovie(movieElem){
  movieElem.addEventListener("click", function () {
     modal.style.display = "block";
     console.log (this);
  })
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


/**
TODO:
1. Local Storag for Name, Email Checked out items.
2. Dynamically populate modal based on selected movie based json values
3. Create a checkout modal
4. Hook up find a movie now to OMDB endpoint
5. About page
**/
