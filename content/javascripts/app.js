$(function() {
  
  var $canvas = $("#map"),
      tweets = [],
      center_dundee = [56.462018,-2.970721],
      center_hamburg = [53.5569,9.9946],
      default_zoom = 14,
      location,
      bounds,
      profile_photo,
      map;
      
  function init() {    
    location = new google.maps.LatLng(center_hamburg[0],center_hamburg[1]);
    
    var mapOpts = {
      minZoom: 4,
      zoom: default_zoom,
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
    $.getJSON('https://twitter.com/statuses/user_timeline/44665823.json?callback=?', function(data) {
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
      
      create_popup(tweet);    
      marker = new google.maps.Marker({
        map: map,
        position: point,
        tweet_id: tweet.id
      });
      click_listener(marker);
      bounds.extend(point);
    });
  }
  
  function create_popup(tweet) {
    var popup = $("<div></div>").appendTo("body");
    popup.data('id', tweet.id);
    popup.addClass('popup');
    popup.text(tweet.text);
  }
  
  function click_listener(marker) {
    new google.maps.event.addListener(marker, 'click', function() {
      hide_all_popups();
      $('.popup').each(function() {
        var popup = $(this);
        if(popup.data('id') == marker.tweet_id) {
          popup.fadeIn(200);
        }
      })
    });
  }
  
  function hide_all_popups() {
    $('.popup').each(function() {
      $(this).fadeOut(200);
    })
  }
    
  function assign_profile_photo(tweet) {
    if(!profile_photo && tweet.user) {
      profile_photo = tweet.user.profile_image_url.replace("_normal", "");
      $("aside.profile img").attr('src', profile_photo).show();
      $("aside.profile .loading").hide();
    }
  }
  
  function add_events() {
    var $description = $("section.description"),
        $dundee = $description.find('.dundee'),
        $hamburg = $description.find('.hamburg');
    
    $dundee.click(function() {
      map.panTo(new google.maps.LatLng(center_dundee[0],center_dundee[1]));
      map.setZoom(default_zoom);
      return false;
    });
    $hamburg.click(function() {
      map.panTo(new google.maps.LatLng(center_hamburg[0],center_hamburg[1]));
      map.setZoom(default_zoom);
      return false;
    });

    $('a[rel="blank"]').each(function() {
      $(this).attr('target', '_blank');
    });
  }
  
  init();
  add_events();
});