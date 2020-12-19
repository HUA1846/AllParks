
  mapboxgl.accessToken = mapToken;
  const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
  center: park.geometry.coordinates, // starting position [lng, lat]
  zoom: 9 // starting zoom
  });

const marker = new mapboxgl.Marker()
.setLngLat(park.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({ offset: 25 })
        .setHTML(
            `<h3>${park.name}</h3>`
        )
)
.addTo(map);
