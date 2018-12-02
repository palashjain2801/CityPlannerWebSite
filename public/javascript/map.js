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
      center: [0, 0],
      zoom: 2
    })
  });

  document.getElementById('zoom-out').onclick = function() {
    let view = map.getView();
    let zoom = view.getZoom();
    view.setZoom(zoom - 1);
  };

  document.getElementById('zoom-in').onclick = function() {
    let view = map.getView();
    let zoom = view.getZoom();
    view.setZoom(zoom + 1);
};

console.log("map is loading ok");