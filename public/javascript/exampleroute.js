

      var map = new ol.Map({
        target: 'map',
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          })
        ],
        view: new ol.View({
          center: ol.proj.transform([-1.6699, 47.1019], 'EPSG:4326', 'EPSG:3857'),
          zoom: 8
        }),
        controls: ol.control.defaults({
          attributionOptions: {
            collapsible: false
          }
        })
      });

      // Some code logic was extracted from http://workshop.pgrouting.org/chapters/ol3_client.html
      // and adapted for OSRM backend

      // The "start" and "destination" features.
      var startPoint = new ol.Feature();
      var destPoint = new ol.Feature();

      // The vector layer used to display the "start" and "destination" features.
      var vectorLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
          features: [startPoint, destPoint]
        })
      });
      map.addLayer(vectorLayer);

      vectorSource = new ol.source.Vector();
      var line_style = new ol.style.Style({//  My style definition
        fill: new ol.style.Fill({
          color: 'rgba(120, 0, 255, 0.9)'
        }),
        stroke: new ol.style.Stroke({
          color: 'rgba(120, 0, 255, 0.9)',
          width: 3,
          lineDash: [4,4] // <-Here is the change. first line then space. try [40,40] if not shown as dash
        })
      });

      vectorLayerPolyline = new ol.layer.Vector({
        name: "polylines",
        source: vectorSource,
        style: line_style
      });

      map.addLayer(vectorLayerPolyline);

      // Register a map click listener.
      map.on('click', function(event) {
        if (startPoint.getGeometry() == null) {
          // First click.
          startPoint.setGeometry(new ol.geom.Point(event.coordinate));
        } else if (destPoint.getGeometry() == null) {
          // Second click.
          destPoint.setGeometry(new ol.geom.Point(event.coordinate));
          // Transform the coordinates from the map projection (EPSG:3857)
          // to the server projection (EPSG:4326).
          var startCoord = ol.proj.toLonLat(startPoint.getGeometry().getCoordinates());
          var destCoord = ol.proj.toLonLat(destPoint.getGeometry().getCoordinates());
          // var root_url = 'http://localhost:5000';
          var root_url = 'https://router.project-osrm.org';
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

          var clearButton = document.getElementById('clear');
          clearButton.addEventListener('click', function(event) {
            // Reset the "start" and "destination" features.
            startPoint.setGeometry(null);
            destPoint.setGeometry(null);
            vectorSource.clear();
          });
        }
      });

    