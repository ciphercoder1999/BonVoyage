var centreLat; 
var centreLong; 
var map;
var marker;
const locationMap = new Map();

var currentLocationToLoad = sessionStorage.getItem('currentLocationValue');
// console.log(currentLocationToLoad)


function populateMap(currentLocationToLoad) {
    const jsonPath = `./assets/js/${currentLocationToLoad}.json`;
  
    fetch(jsonPath)
      .then(response => response.json())
      .then(data => {
        // Iterate through the data from the JSON
        data.forEach(item => {
          const name = item.description.name;
          const latitude = item.location.latitude;
          const longitude = item.location.longitude;
  
          // Add the name and location to the map
          locationMap.set(name, { latitude, longitude });
        });
      })
      .catch(error => {
        console.error('Error:', error);
        // Reload the current page and bypass the cache
        location.reload(true);
      });
  }


fetch('./assets/js/location.json')
  .then(response => response.json())
  .then(data => {
    data.forEach(item => {
      if (item._id === currentLocationToLoad) {

        const centreLatitude = item.location.latitude;
        const centreLongitude = item.location.longitude;
        const zoom = item.location.zoom;

        initMap(centreLatitude,centreLongitude,zoom);   
        populateMap(currentLocationToLoad);
        return;
    }
    });

    // console.log(centreLat, centreLong); // Log the values inside the then block
  })
  .catch(error => {
    console.error('Error:', error);
    // Reload the current page and bypass the cache
    location.reload(true);
  });


//   console.log(locationMap);

function initMap(centreLat, centreLong, zoom) {
    // Create a new map instance
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: centreLat, lng: centreLong }, // Set the initial map center
        zoom: zoom,// Set the initial zoom level
        disableDefaultUI: true,
    });
}


// Function to add a marker to the map
function addMarker(latitude, longitude, title) {
    // Check if a marker already exists, remove it first
    if (marker) {
        marker.setMap(null);
    }

    // Create a new marker and add it to the map
    marker = new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
        title: title
    });

    marker.setMap(locationMap);
}


function removeMarker() {

    if (marker) {
        marker.setMap(null);
    }
}

