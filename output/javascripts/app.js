$(function() {
  
  var $canvas = $("#map"),
      tweets = [],
      location,
      bounds,
      profile_photo,
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
  };
  
  function load_tweets() {
    $.getJSON('http://twitter.com/statuses/user_timeline.json?screen_name=brsim&count=15&callback=?', function(data) {
      $.each(data, function(key, val) {
        if(val.geo) {
          tweets.push(val);
        }
        assign_profile_photo(val);
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
  
  function assign_profile_photo(tweet) {
    if(!profile_photo && tweet.user) {
      profile_photo = tweet.user.profile_image_url.replace("_normal", "");
      $("aside.profile img").attr('src', profile_photo);
    }
  }
  
  init();
  
});