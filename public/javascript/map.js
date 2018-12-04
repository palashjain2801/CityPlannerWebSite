
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




//draw lines between places (IT DOES NOT WORK)
let vectorSource = new ol.source.Vector({});
// function Distancebtw(x1,x2,y1,y2)
// {
//
//   // let sub1= x2-x1;
//   // let sub2= y2-y1;
//   // let p= sub1*sub1 + sub2 * sub2;
//   // console.log("this is Dis"+ Math.sqrt(p));
//   var R = 6371; // km
// var dLat1 = (x2 - x1);
// var dLon1 = (y2 - y1);
// let dLat = dLat1.toRad();
// let dLon = dLon1.to
// var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
//         Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
//         Math.sin(dLon/2) * Math.sin(dLon/2);
// var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
// var d = R * c;
// console.log("this is Dis"+ d);
// }



function Distancebtw(lat1, lat2, lon1, lon2,i,startloc,destloc) {
    //Radius of the earth in:  1.609344 miles,  6371 km  | var R = (6371 / 1.609344);
    var distance = [];
    var R = 3958.7558657440545; // Radius of earth in Miles
    var dLat = toRad(lat2-lat1);
    var dLon = toRad(lon2-lon1);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    console.log("this is Dis"+d);
    distance[i] = Math.round(d * 100) / 100;
   console.log('this is the distance object'+d)
   var timedoc =Math.round((distance[i]/20) * 60 + 10);

   var para = document.createElement("p");
   var node = document.createTextNode('The Distance between Location ' + startloc + ' and '+ destloc +' is ' + distance[i] + ' miles.' + " Time required via Pubic Transport " + timedoc + "min");
   para.appendChild(node);
   var element = document.getElementById("div1");
   element.appendChild(para);
    return d,distance;
}

function toRad(Value) {
    /** Converts numeric degrees to radians */
    return Value * Math.PI / 180;
}
for(let i=0;i<listPlaces.length;i++)
{
let startCoord1 = ol.proj.fromLonLat([listPlaces[i].coordinates.longitude, listPlaces[i].coordinates.latitude]);
let destCoord1 = ol.proj.fromLonLat([listPlaces[i+1].coordinates.longitude, listPlaces[i+1].coordinates.latitude]);
let coords1 = [startCoord1,destCoord1];
let lineString = new ol.geom.LineString(coords1);

console.log("this is cordo"+[listPlaces[0].coordinates.longitude]);
let x1=[listPlaces[i].coordinates.longitude];
let x2=[listPlaces[i+1].coordinates.longitude];
let startloc1=[listPlaces[i].name]
let destloc1=[listPlaces[i+1].name]
let y1=[listPlaces[i].coordinates.latitude];
let y2=[listPlaces[i+1].coordinates.latitude];
console.log("the x1 is "+x1);
console.log("the x2 is "+x2);
console.log("the y1 is "+y1);
console.log("the y2 is "+y1);
Distancebtw(y1,y2,x1,x2,i,startloc1,destloc1);




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
vectorSource.addFeature(feature1)
console.log("first");
let layerLines = new ol.layer.Vector({
  source: vectorSource
});

map.addLayer(layerLines);
};



//SOME CODE THAT DIDN'T WORK EITHER
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
