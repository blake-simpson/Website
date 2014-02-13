$(function() {

  var $canvas = $("#map"),
      centerDundee = [56.462018,-2.970721],
      centerHamburg = [53.5569,9.9946],
      centerBremen = [53.07929,8.8016],
      defaultZoom = 14,
      location,
      map;

  function init() {
    location = new google.maps.LatLng(centerHamburg[0], centerHamburg[1]);

    var mapOpts = {
      minZoom: 4,
      zoom: defaultZoom,
      center: location,
      mapTypeId: google.maps.MapTypeId.SATELLITE,
      zoomControl: false,
      panControl: false,
      streetViewControl: false,
      mapTypeControl: false
    };

    map = new google.maps.Map($canvas.get(0), mapOpts);
  };

  function addEvents() {
    var $description = $("section.description"),
        $dundee = $description.find('.dundee'),
        $hamburg = $description.find('.hamburg'),
        $bremen = $description.find('.bremen');

    $dundee.click(function() {
      setMapLocation(centerDundee);
      return false;
    });

    $hamburg.click(function() {
      setMapLocation(centerHamburg);
      return false;
    });

    $bremen.click(function() {
      setMapLocation(centerBremen);
      return false;
    });

    $('a[rel="blank"]').each(function() {
      $(this).attr('target', '_blank');
    });
  }

  function setMapLocation(center) {
    map.panTo(new google.maps.LatLng(center[0], center[1]));
    map.setZoom(defaultZoom);
  }

  init();
  addEvents();
});
