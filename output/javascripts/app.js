$(function() {
  
  var $canvas = $("#map"),
      tweets = [],
      location,
      bounds,
      map;
      
  function init() {    
    location = new google.maps.LatLng(53.5569,9.9946);
    
    var mapOpts = {
      minZoom: 4,
      zoom: 14,
      center: location,
      mapTypeId: google.maps.MapTypeId.SATELLITE,
      zoomControl: false,
      panControl: false,
      streetViewControl: false,
      mapTypeControl: false
    };
    
    map = new google.maps.Map($canvas.get(0), mapOpts); 
    bounds = new google.maps.LatLngBounds();
    load_tweets();
    load_page();
  };   
  
  function load_page() {
    $.getJSON('http://campl.us/user/brsim', function(data) {
      console.log(data)
    });
  }
  
  function load_tweets() {
    $.getJSON('http://twitter.com/statuses/user_timeline.json?screen_name=brsim&count=15&callback=?', function(data) {
      $.each(data, function(key, val) {
        if(val.geo) {
          tweets.push(val);
        }
      });
      show_tweets();
    });
  }
  
  function show_tweets() {
    $.each(tweets, function(key, tweet) {
      var lat = tweet.geo.coordinates[0],
          lng = tweet.geo.coordinates[1],
          point = new google.maps.LatLng(lat,lng);
          
      new google.maps.Marker({
        map: map,
        position: point
      });
      bounds.extend(point);
    });
  }
  
  init();
  
});