var coords = [[78.65, -32.65], [15.65, -98.65]];

var lineStyle = new ol.style.Style({
    stroke: new ol.style.Stroke(({
        width: 10
    }))
});

var layerLines = new ol.layer.Vector({
    style: lineStyle,
    source: new ol.source.Vector({
        features: [new ol.Feature({
            geometry: new ol.geom.LineString(coords, 'EPSG:4326',   'EPSG:3857'),
            name: 'Line'
        })]
    }),
});

var map = new ol.Map({
    layers: [
        mainLayer,
        vectorLayer,
        layerLines
    ],
    projection: "EPSG:3857",
    target: 'map',
    view: view
});