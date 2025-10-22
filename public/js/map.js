
  const map = new maplibregl.Map({
    container: 'map', // container ID
  style: `https://api.maptiler.com/maps/hybrid/style.json?key=${key}`,
    center: coordinates, // [lng, lat] → center of India
    zoom: 6
    
  });

  // Add zoom & rotation controls
  map.addControl(new maplibregl.NavigationControl());

  const marker = new maplibregl.Marker()
    .setLngLat(coordinates) // [longitude, latitude]
    .addTo(map);

  new maplibregl.Marker({ color: "#d9534f" }) // custom red marker
    .setLngLat(coordinates)
    .addTo(map);

    // console.log(coordinates);