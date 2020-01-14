$(function() {
  $('img[data-lazysrc]').each(function() {
    var sourceImage = this;
    var newImage = new Image;
    newImage.src = $(sourceImage).data('lazysrc');
    newImage.onload = function() {
      sourceImage.src = newImage.src;
      setTimeout(function() {
        $(sourceImage).css('visibility', 'visible');
      }, 500);
    }
  });

  $('[data-vimeo]').each(function() {
    var source = $(this);
    var id     = source.data('vimeo');
    var bgsize = source.data('bgsize');

    source.html('<button class="card-media__play-button"></button>');

    $.get('https://vimeo.com/api/v2/video/'+id+'.json', function(res) {
      var thumb = res[0].thumbnail_large;
      source.css('backgroundImage', 'url("'+thumb+'")');
    });

    source.css('backgroundRepeat', 'no-repeat');
    source.css('backgroundPosition', '50% 50%');
    source.css('backgroundSize', bgsize ? bgsize : 'contain');

    if (parseInt(source.data('height')) > parseInt(source.data('width'))) {
      var newHeight = parseInt(source.data('height')) / (parseInt(source.data('width')) / parseInt(source.width()));
      source.height(newHeight);
    }

    source.one('click', function() {
      source.css('backgroundImage', 'none');
      $(this).html('<iframe width="'+source.width()+'" height="'+source.height()+'" src="//player.vimeo.com/video/'+id+'?title=0&byline=0&portrait=0&autoplay=1" frameborder="0" allowfullscreen style="display:block"></iframe>');
    });
  });

  $('[data-youtube]').each(function() {
    var source = $(this);
    var id     = source.data('youtube');
    var bgsize = source.data('bgsize');

    source.html('<button class="card-media__play-button"></button>');

    var thumb = '//i.ytimg.com/vi/'+id+'/sddefault.jpg';
    source.css('backgroundImage', 'url("'+thumb+'")');
    source.css('backgroundRepeat', 'no-repeat');
    source.css('backgroundPosition', '50% 50%');
    source.css('backgroundSize', bgsize ? bgsize : 'contain');

    source.one('click', function() {
      source.css('backgroundImage', 'none');
      $(this).html('<iframe width="'+source.width()+'" height="'+source.height()+'" src="//www.youtube.com/embed/'+id+'?autoplay=1&autohide=1" frameborder="0" allowfullscreen style="display:block"></iframe>');
    });
  });
});
