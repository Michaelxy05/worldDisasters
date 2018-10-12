
// form prevent enter
$(window).keydown(function(event){
  if((event.keyCode == 13) && ($(event.target)[0]!=$("textarea")[0])) {
      event.preventDefault();
      return false;
  }
});

// Click logo
$('.navbar-brand').click(function() {
  $('.surveyPage').fadeOut();
  $('.articlePage').fadeOut();
  $('.mainPage').fadeIn();
})

// Top Events ==================================================================================================
//==============================================================================================================

//Pull Top 5 "Natural Disasters" headlines from NewsAPI.org 
$.ajax({
  method: "GET",
  url: "https://newsapi.org/v2/everything?q=natural+disasters&apiKey=4e07aef37295467f87b9a6582c0892fb",
})
  .then(function (response) {
    // console.log(response);
    for (let i = 0; i < 5; i++) {

      $(".rightImage").attr("src", response.articles[0].urlToImage);
      $(".title").text(response.articles[0].title);
      $(".description").text(response.articles[0].description);
      $(".rightDisplay").attr("href", response.articles[0].url);

      $(".leftImagesTL").attr("src", response.articles[1].urlToImage);
      $(".titleTL").text(response.articles[1].title);
      //$(".descriptionTL").text(response.articles[1].description);
      $("#topLeft").attr("href", response.articles[1].url);

      $(".leftImagesTR").attr("src", response.articles[2].urlToImage);
      $(".titleTR").text(response.articles[2].title);
      //$(".descriptionTR").text(response.articles[2].description);
      $("#topRight").attr("href", response.articles[2].url);

      $(".leftImagesBL").attr("src", response.articles[3].urlToImage);
      $(".titleBL").text(response.articles[3].title);
      //$(".descriptionBL").text(response.articles[3].description);
      $("#botLeft").attr("href", response.articles[3].url);

      $(".leftImagesBR").attr("src", response.articles[4].urlToImage);
      $(".titleBR").text(response.articles[4].title);
      //$(".descriptionBR").text(response.articles[4].description);
      $("#botRight").attr("href", response.articles[4].url);
    }
  });



// Articles Section (Natural Disasters Image Onclick Section)===================================================
//==============================================================================================================

$('.disastersCard').click(function () {
  $("html, body").animate({ scrollTop: 0 }, "slow");
  var orginalName = $(this).text();
  var disasterName = $(this).text().trim().toLowerCase();
  disasterName = disasterName.replace(/ +/g, "");
  // console.log(disasterName);
  $('.mainPage').fadeOut();
  $('.articlePage').fadeIn();
  $('#articlePageTitle').text(orginalName);
  // Pull API Call from NewsAPI.org
  //GET DROPDOWN SOURCES 
  $.ajax({
    method: "GET",
    url: "https://newsapi.org/v2/everything?q=weather%20" + disasterName + "&apiKey=4e07aef37295467f87b9a6582c0892fb",
  })
    .then(function (response) {
      $(".articleCol").empty();
      // console.log(response);
      for (let i = 0; i < 5; i++) {

        // console.log(response.articles[i].author);

        // Constructing HTML containing the artist information
        var newsTitle = $("<h1>").text(response.articles[i].title);
        var author = $("<a>").text(response.articles[i].author);
        var dateArticle = $("<a>").text(response.articles[i].publishAt);
        var newsImage = $("<img>").attr("src", response.articles[i].urlToImage);
        // var content = $("<h2>").text(response.articles[i].content)
        var description = $("<a>").text(response.articles[i].description);
        var sourceOwner = $("<a>").text(response.articles[i].source.name);
        var articleLink = $("<a target='_blank'>").attr("href", response.articles[i].url);
        var enterBreak = $('<br>');
        var spaceBreak = $('<span>: </span>')

        var content = articleLink.append(newsTitle, newsImage, description, dateArticle);
        $(".articleCol").append(content, enterBreak, sourceOwner, spaceBreak, author);
      }

    });

    // Goolge Map
    initMap();
    function initMap() {
      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2,
        center: {lat: 0, lng: 0}
      });
      setMarkers(map);
    }
    
    function setMarkers(map) {
      
      let coordinates = [];
      $.ajax({
        url: 'https://api.predicthq.com/v1/events/?label=' + disasterName,
        beforeSend: function(xhr) {
             xhr.setRequestHeader("Authorization", "Bearer 2JBGozRCHHCuspaJ0OH8gA5WLfDgke")
        }, success: function(data){
            // console.log(data);
            
            for (let i = 0; i < data.results.length; i++) {
              // console.log(data.results[i].location[0])
              let longitude =  data.results[i].location[0];
              // console.log(data.results[i].location[1])
              let latitude = data.results[i].location[1];
              coordinates.push([latitude, longitude]);
              // console.log(coordinates[])
            }
            
            for (var i = 0; i < coordinates.length; i++) {
              // console.log(coordinates)
              var beach = coordinates[i];
              var marker = new google.maps.Marker({
                animation: google.maps.Animation.DROP,
                position: {lat: coordinates[i][0], lng: coordinates[i][1]},
                map: map,
              });
            }
        }
      })
    }



})
//============= Firebase ==========================================
//========= Alan Simpson Youtube ==================================

// Initialize Firebase
var config = {
  apiKey: "AIzaSyBGfcEq05CzvBcy06VdRpc37_xyaOW1mc0",
  authDomain: "naturaldisasters-6810f.firebaseapp.com",
  databaseURL: "https://naturaldisasters-6810f.firebaseio.com",
  projectId: "naturaldisasters-6810f",
  storageBucket: "naturaldisasters-6810f.appspot.com",
  messagingSenderId: "575545942870"
};
firebase.initializeApp(config);


// Hit Counter (Number is Views)

//rootRef is a reference to the whole Firebase database.
var rootRef = firebase.database().ref();
// pageCountRef is just the node that tracks hits
var pageCountsRef = rootRef.child("pageCounts");


//Gets the key and current hit count for the page (if it exists)
let getHistory = new Promise(function (resolve, reject) {
  //Create an object to store copy of the saved db data.
  let obj = {};
  pageCountsRef.orderByChild("page").equalTo(location.pathname).once("value", function (snapshot) {
    snapshot.forEach(function (child) {
      obj = {
        key: child.key,
        count: child.val().count
      }
    });
    if (obj) {
      resolve(obj);
    } else {
      reject(error);
    }
  });
});

getHistory.then(function (fromResolve) {
  var key = fromResolve.key;
  var pastcounts = fromResolve.count;
  //If key is undefined, create a new key for this database item.
  if (key == undefined) {
    key = pageCountsRef.push().key;
    pastcounts = 0;
  }
  //Total hits to date.
  counts = pastcounts + 1;
  console.log("view hits=" + counts);
  $('.views').text(counts);
  //Gather info to post
  var postData = {
    page: location.pathname,
    count: counts,
  }

  var updates = {}
  updates["/pageCounts/" + key] = postData;
  rootRef.update(updates);
})




 
// 
// 
// Survey
// 
// 
$('.locationSurvey').click(function() {
  // console.log('clicked survey')
  $('.mainPage').fadeOut();
  $('.articlePage').fadeOut();
  $('.surveyPage').fadeIn();
  window.scrollTo(0, 0);
})

$('#pointer').click(function() {
  let toggleAddPlace = $('#pointer').attr('aria-expanded');
  if (toggleAddPlace === 'false') {
      $('#toggleCollapse').text(' (Click to collapse)')
  }
  if (toggleAddPlace === 'true') {
      $('#toggleCollapse').text(' (Click to expand)')
  }
})


let locationName;
let comment;

$( "#addPlaceBtn" ).click(function() {
  locationName = $('#locationName').val();
  // console.log(locationName);
  // Add submitted place
  let newLi = "<li style='background: red; width: 50%;' data-vote='2'>" + locationName + "</li>"

  $('.bargraph').append(newLi);
  // reset form
  $('#locationName').val('');
  $('#comments').val('');
});
// const surveyRef = rootRef.child("survey");
// const totalCount = rootRef.child("totalCount")

// $('.locationSurvey').click(function() {
//   // console.log('clicked survey')
//   $('.mainPage').fadeOut();
//   $('.articlePage').fadeOut();
//   $('.surveyPage').fadeIn();
//   window.scrollTo(0, 0);
// })

// $('#pointer').click(function() {
//   let toggleAddPlace = $('#pointer').attr('aria-expanded');
//   if (toggleAddPlace === 'false') {
//       $('#toggleCollapse').text(' (Click to collapse)')
//   }
//   if (toggleAddPlace === 'true') {
//       $('#toggleCollapse').text(' (Click to expand)')
//   }
// })



// $( "#addPlaceBtn" ).click(function() {
//   event.preventDefault();
//   let locationName = $('#locationName').val();
//   let count = 1;
//   rootRef.child("survey/" + locationName).push({
//       count: count
//   });
//   // reset form
//   $('#locationName').val('');
//   $('#comments').val('');
// });


// surveyRef.on("child_added", function(childSnapshot) { 
//   let nameOfLocation = childSnapshot.val().location
//   let count = childSnapshot.val().count
//   let newLi = "<li style='background: red; width: 50%;' data-vote='" + count + "'>" + nameOfLocation + "</li>"
//   $('.bargraph').append(newLi);
// });