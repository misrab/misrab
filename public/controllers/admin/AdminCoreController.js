var app = angular.module('app');

// navigator.geolocation.getCurrentPosition(function(position) {
//       console.log(position);
//     });


app.controller('AdminCoreController', function($scope) {
	init();

	function init() {
    effects();
    icons();
	};




  // add icons for various parts of system
  function icons() {
    var w = $(window).width();
    var h = $(window).height();
    var r = $('#cyberdyne_logo').width()/2;

    var icons = ["misrab.me", "hyperdrive", "captain\'s log", "stellar"];
    var N = icons.length;
    var padding = 30;
    for (index in icons) {
      // var x = w/2 + (r + padding)*Math.cos(2*Math.PI*index/N);
      // var y = h/2 + (r + padding)*Math.sin(2*Math.PI*index/N);

      // place div
      var moon = $('<div class="moon" data-tooltip="'+icons[index]+'"></div>');
      $('body').append(moon);
      // moon.css('left', x);
      // moon.css('top', y);

      var t = 0;
      // setInterval(function() {
      //   var x = w/2 + (r+padding)*Math.cos(2*Math.PI*(index/N) -t);
      //   var y = h/2 + (r+padding)*Math.sin(2*Math.PI*(index/N) -t);
      //   moon.animate({ left: x, top: y }, 100);
      //   t += 0.005;
      // }, 100);
    }

    $('.moon').each(function(i, v) {
      setInterval(function() {
        var x = w/2 + (r+padding)*Math.cos(2*Math.PI*(i/N) -t);
        var y = h/2 + (r+padding)*Math.sin(2*Math.PI*(i/N) -t);
        $(v).animate({ left: x, top: y }, 100);
        t += 0.005;
      }, 100);
    });

    $('.moon').mouseenter( function() {
      var tip = $(this).attr("data-tooltip");
      $('#tooltip').html(tip);
    }).mouseleave( function() {
      $('#tooltip').html('');
    });
    // $('.moon').click(function(e) {
    //   e.preventDefault();

    // });
  };



  // show neural dots
  function effects() {
    setInterval(addDot, 1000);
    //addDot();
  };

  function addDot() {
    var el = $("<div class='neural_dot'></div>");

    // place it at center
    var w = $(window).width();
    var h = $(window).height();
    var x = w/2;
    var y = h/2;
    // perturb starting point
    var r = Math.min(h, w) / 4;
    x += r*Math.cos(2*Math.PI*Math.random());
    y += r*Math.sin(2*Math.PI*Math.random());


    el.css('left', x);
    el.css('top', y);
    //el.css('opacity', Math.random()/2);
    $('body').append(el);

   // find radial difference
   var outx = (w-x) < w/2 ? w-x : -x;
   var outy = (h-y) < h/2 ? h-y : -y;
   // scale to avoid stretching window
   outx *= 0.8; outy *= 0.8;

    el.animate({
      'left': '+=' + String(outx),
      'top': '+=' + String(outy),
      'opacity': 1
    }, 8000, function() {
      // complete
      el.remove();
    });
  };
});