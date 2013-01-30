$(function() {

  var $canvas = $("#map"),
      tweets = [],
      center_dundee = [56.462018,-2.970721],
      center_hamburg = [53.5569,9.9946],
      default_zoom = 14,
      markers = [],
      location,
      bounds,
      profile_photo,
      map;

  function init() {
    location = new google.maps.LatLng(center_hamburg[0], center_hamburg[1]);

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
    google.maps.event.addListener(map, 'bounds_changed', function() { update_popups(); });
    load_tweets();
  };

  function load_tweets() {
    $.getJSON('https://api.twitter.com/1/statuses/user_timeline.json?user_id=44665823&callback=?', function(data) {
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
      if (!tweet || !tweet.geo) { return;}

      var lat = tweet.geo.coordinates[0],
          lng = tweet.geo.coordinates[1],
          point = new google.maps.LatLng(lat,lng);

      marker = new google.maps.Marker({
        map: map,
        position: point,
        tweet_id: tweet.id
      });

      markers.push(marker);
      create_popup(tweet, marker);
      click_listener(marker);
      bounds.extend(point);
    });
    update_popups();
  }

  function update_popups() {
    $('.popup').each(function() {
      var $self = $(this);
      update_popup_position($self.data('id'));
    });
  }

  function update_popup_position(popup_id) {
    var $popup = $('.popup[data-id="'+popup_id+'"]');
    $.each(markers, function(key, marker) {
      if(marker.tweet_id == popup_id) {
        var marker_offset = get_marker_offset(marker),
            offset = popup_position($popup, marker_offset);
        $popup.css('left', offset.x+'px');
        $popup.css('top', offset.y+'px');
      }
    });
  }

  function popup_position(popup, offset) {
    var x = offset.x,
        y = offset.y,
        width = popup.outerWidth(),
        height = popup.outerHeight();
    var new_x = x-(width/2);
    if(height == 62) {
      var new_y = y-(height*1.6);
    } else if(height == 48) {
      var new_y = y-(height*1.8);
    } else {
      var new_y = y-(height*1.5);
    }
    return {x: new_x, y: new_y}
  }

  function replace_urls_with_links(text) {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(exp,"<a href=\"$1\">$1</a>");
  }

  function create_popup(tweet, marker) {
    var popup = $("<div></div>").appendTo("body"),
        text = replace_urls_with_links(tweet.text);
    popup.attr('data-id', tweet.id);
    popup.addClass('popup');
    popup.html(text);
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
    if(profile_photo || !tweet.user) { return;}

    profile_photo = tweet.user.profile_image_url.replace("_normal", "");
    $("aside.profile img").attr('src', profile_photo).show();
    $("aside.profile .loading").hide();
  }

  function get_marker_offset(marker) {
    var scale = Math.pow(2, map.getZoom());
    var nw = new google.maps.LatLng(
        map.getBounds().getNorthEast().lat(),
        map.getBounds().getSouthWest().lng()
    );
    var worldCoordinateNW = map.getProjection().fromLatLngToPoint(nw);
    var worldCoordinate = map.getProjection().fromLatLngToPoint(marker.getPosition());
    return new google.maps.Point(
        Math.floor((worldCoordinate.x - worldCoordinateNW.x) * scale),
        Math.floor((worldCoordinate.y - worldCoordinateNW.y) * scale)
    );
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
