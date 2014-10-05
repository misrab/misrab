var app = angular.module('app');

// navigator.geolocation.getCurrentPosition(function(position) {
//       console.log(position);
//     });


app.controller('CyberdyneCoreController', function($scope, $http, GenericService) {
	init();

	function init() {
    showNotes();
    $("#notes_save").click(saveNote);
    $("#readings_add").click(saveReading);

    $(function() {
      effects();
      //icons();
    });
    
	};


  /*
    Generic
  */
  function rebindRemove() {
    $('.remove').unbind('click');
    $('.remove').click(function(e) {
      var parent = $(this).parent();
      var id = parent.children('input[name="id"]').val();
      var type = parent.attr('class');
      
      // remove it
      var url = '/cyberdyne/api/v1/' + type + '/' + id;
      $http({
        method: 'DELETE', 
        url: url
      })
      .success(function(data, status, headers, config) {
        parent.remove();
      })
      .error(function() {
        console.log("Error updating notes...");
      });
    });
  };

  // returns html of an object with class for each field
  // expect object id, date as unix
  function renderObject(type, date, obj) {
    var html = '<div class="'+ type +'">'
        + '<input type="hidden" name="id" value="'+ obj.id +'" />'
        + '<div class="time">' + date.toUTCString() + '</div>'
        + '<a href="" class="remove">Remove</a>';

    for (k in obj) {
      if (["id", "created", "updated"].indexOf(k) !== -1) continue;
      html = html + '<div class="' + k + '">' + obj[k] + '</div>';
    }

    html = html + '</div>';
    return html;
  };
  

  /*
    Readings
  */


  /*
    Notes
  */
  function renderNote(note) {
    var input = $("#notes");
    var date = new Date(note.created/1000000);
    var html = renderObject('note', date, note);
    input.after(html);
  };

  function showNotes() {
    $http({
        method: 'GET', 
        url: '/cyberdyne/api/v1/notes'
      })
      .success(function(data, status, headers, config) {
        if (!data) return;

        // show the notes
        for (var i=0; i < data.length; i++) {
          renderNote(data[i]);
        }

        rebindRemove();
      })
      .error(function() {
        console.log("Error updating notes...");
      });
  };

  function saveNote(e) {
    e.preventDefault();

    var notes = $("#notes");
    var html = notes.val();
    // var note = {
    //   html: html,
    //   created: (new Date).getTime()
    // };

    $http({
        method: 'POST', 
        url: '/cyberdyne/api/v1/note',
        data: { 
          html: html
        }
      })
      .success(function(data, status, headers, config) {
        // show it
        renderNote(data);
        rebindRemove();
      })
      .error(function() {
        console.log("Error updating notes...");
      });
  };

  // function setReadings() {
  //   // first bind the reading add button


  // };
  // function addReading() {

  // };

  
  
  // function setNotes() {
  //   var notes = $("#notes");
  //   $http({method: 'GET', url: '/cyberdyne/api/v1/note'})
  //     .success(function(data, status, headers, config) {
  //       if (!data) return
  //       notes.html(data.html);
  //     });

  //   // update on changes
  //   $("#notes_save").bind("click", updateNotes);
  // };
  // function updateNotes(e) {
  //   var notes = $("#notes");
  //   $http({
  //       method: 'PATCH', 
  //       url: '/cyberdyne/api/v1/note',
  //       data: { html: notes.html() }

  //     })
  //     .success(function(data, status, headers, config) {

  //     })
  //     .error(function() {
  //       console.log("Error updating notes...");
  //     });
  // };


  // add icons for various parts of system
  function icons() {
    var w = $(window).width();
    var h = $(window).height();
    var r = $('#cyberdyne_logo').width()/2;

    var icons = ["analytics"];
    var N = icons.length;
    var padding = 30;
    for (index in icons) {
      // var x = w/2 + (r + padding)*Math.cos(2*Math.PI*index/N);
      // var y = h/2 + (r + padding)*Math.sin(2*Math.PI*index/N);

      // place div
      var moon = $('<div class="moon" data-tooltip="'+icons[index]+'"></div>');
      $('#core').append(moon);

      var t = 0;
    }

    $('.moon').each(function(i, v) {
      setInterval(function() {
        var x = w/2 + (r+padding)*Math.cos(2*Math.PI*(i/N) -t);
        var y = h/2 + (r+padding)*Math.sin(2*Math.PI*(i/N) -t);
        $(v).animate({ left: x, top: y }, 100);
        t += 0.02;
      }, 60);
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
    $('#core').append(el);

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