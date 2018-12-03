
//check if we have the correct data from the view
console.log(search.city);
console.log(search.numDays);
console.log(listPlaces);

//we establish the center of our map in the first place of our array
let centerCoor = ol.proj.fromLonLat([listPlaces[0].coordinates.longitude, listPlaces[0].coordinates.latitude]);
let startCoord = ol.proj.fromLonLat([listPlaces[0].coordinates.longitude, listPlaces[0].coordinates.latitude]);
let destCoord = ol.proj.fromLonLat([listPlaces[1].coordinates.longitude, listPlaces[1].coordinates.latitude]);

let coords = [startCoord,destCoord];

//create the map
let map = new ol.Map({
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    }),
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

//create an array of features (markers) to show all the places of the list
let features = [];

for(let i=0;i<listPlaces.length;i++)
{
  let coor = ol.proj.fromLonLat([listPlaces[i].coordinates.longitude, listPlaces[i].coordinates.latitude]);
  let feature = 
    new ol.Feature({
    geometry: new ol.geom.Point(coor),
    name: listPlaces[i].name,
    description: listPlaces[i].name
  })
  features.push(feature);
}

//add the array of markers and show it on the map
  let markers = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: features
    }),
    style: new ol.style.Style({
      image: new ol.style.Icon({
        center: centerCoor,
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixel',
        opacity: 0.95,
        src: 'http://oi66.tinypic.com/wji0lj.jpg'
      })
    })
  });
map.addLayer(markers);




//draw lines between places
let vectorSource = new ol.source.Vector({});
let lineString = new ol.geom.MultiLineString(coords);

let feature1 = new ol.Feature({
  geometry: lineString,
  name: 'Line',
  style : new ol.style.Style({
    stroke : new ol.style.Stroke({
      color : 'red',
      width: 10
    })
  })
});

let layerLines = new ol.layer.Vector({
  source: vectorSource
});

vectorSource.addFeature(feature1)
map.addLayer(layerLines);

//add the routes between markers
/*var params = {
  LAYERS: 'pgrouting:pgrouting',
  FORMAT: 'image/png'
};

var viewparams = [
  'x1:' + startCoord[0], 'y1:' + startCoord[1],
  'x2:' + destCoord[0], 'y2:' + destCoord[1]
];

params.viewparams = viewparams.join(';');
result = new ol.layer.Image({
  source: new ol.source.ImageWMS({
    url: 'http://localhost:3000/geoserver/pgrouting/wms',
    params: params
  })
});

map.addLayer(result);*/

/*let vectorSource = new ol.source.Vector();

var root_url = 'http://localhost:3000';
var url = root_url + '/route/v1/driving/' +
  startCoord[0] + ',' + startCoord[1] + ';' +
  destCoord[0] + ',' + destCoord[1] + '?' +
  'overview=full' +
  '&alternatives=true' +
  '&steps=true' +
  '&hints=;';

fetch(url).then(function(response) {
  return response.json().then(function(json) {
    var format = new ol.format.Polyline({
      factor: 1e5
    });

    var encoded_line = json.routes[0].geometry;
    var line = format.readGeometry(encoded_line, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
    });
    var feature = new ol.Feature({
      geometry: line
    });
    vectorSource.addFeature(feature);
  });
});

let line_style = new ol.style.Style({//  My style definition
  fill: new ol.style.Fill({
    color: 'rgba(120, 0, 255, 0.9)'
  }),
  stroke: new ol.style.Stroke({
    color: 'rgba(120, 0, 255, 0.9)',
    width: 3,
    lineDash: [4,4] // <-Here is the change. first line then space. try [40,40] if not shown as dash
  })
});

let vectorLayerPolyline = new ol.layer.Vector({
  name: "polylines",
  source: vectorSource,
  style: line_style
});

map.addLayer(vectorLayerPolyline); */    



