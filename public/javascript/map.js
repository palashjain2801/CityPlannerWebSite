let centerCoor = ol.proj.fromLonLat([listPlaces[0].coordinates.longitude, listPlaces[0].coordinates.latitude]);
let otherCoor = ol.proj.fromLonLat([listPlaces[1].coordinates.longitude, listPlaces[1].coordinates.latitude]);


//create the map
let map = new ol.Map({
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  target: 'map',
  controls: ol.control.defaults({
    attributionOptions: {
      collapsible: false
    }
  }),
  view: new ol.View({
    center: centerCoor,
    zoom: 13
  })
});


  console.log('center is:', centerCoor);


  var markers = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: [
        new ol.Feature({
          geometry: new ol.geom.Point(centerCoor),
          name: 'Crescent St',
          description: 'Apartment'
        }),
        new ol.Feature({
          geometry: new ol.geom.Point(otherCoor),
          name: 'Long Island City',
          desctiption: 'Apartment'
        })
      ]
    }),
    style: new ol.style.Style({
      image: new ol.style.Icon({
        center: centerCoor,
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixel',
        opacity: 0.75,
        src: 'https://cdn4.iconfinder.com/data/icons/spirit20/marker-delete.png',
      })
    })
  });
  map.addLayer(markers);


  console.log(search.city);
  console.log(search.numDays);
  console.log(listPlaces);
  


