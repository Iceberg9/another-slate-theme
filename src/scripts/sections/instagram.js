theme.Instagram = (function() {
  'use strict';

  var accessToken = theme.accessToken ? theme.accessToken : '';
  var tagName = theme.tagName ? theme.tagName : '';

  function Instagram(container) {
    this.$container = $(container)
    var sectionId = this.$container.data('section-id');

    if (accessToken && tagName) {
      this.initInstafeed();
    }
  }

  Instagram.prototype.initInstafeed = function() {
    var feed = new Instafeed({
      get: 'tagged',
      tagName: tagName,
      limit: 2,
      resolution: 'low_resolution',
      accessToken: accessToken,
      template: '<div class="instafeed__item"><a href="{{link}}"><img src="{{image}}" /></a><span>{{model.short_caption}}</span></div>',
      filter: function(image) {
        var MAX_LENGTH = 100;

        if (image.caption && image.caption.text) {
          image.short_caption = image.caption.text.slice(0, MAX_LENGTH);
        } else {
          image.short_caption = "";
        }

        return true;
      }
    });

    feed.run();
  }

  return Instagram;
})();
