theme.Gallery = (function() {
  'use strict';

  var settings = {
    mediaQuerySmall: 'screen and (max-width: 749px)',
    isSlider: false
  };

  var defaults = {
    arrows: false,
    dots: true,
    slide: '.gallery__image',
    adaptiveHeight: true
  };

  function Gallery(container) {
    this.$container = $(container)
    var sectionId = this.$container.data('section-id');
    this.$gallery = $('#Gallery-' + sectionId, this.$container);

    this.initBreakpoints();

  }

  Gallery.prototype.initBreakpoints = function() {
    var self = this;

    enquire.register(settings.mediaQuerySmall, {
      match: function() {
        self.initSlider();
      },
      unmatch: function() {
        if (settings.isSlider) {
          self.destroySlider();
        }
      }
    });
  };

  Gallery.prototype.initSlider = function() {
    this.$gallery.slick(defaults);
    settings.isSlider = true;
  };

  Gallery.prototype.destroySlider = function() {
    this.$gallery.slick('unslick');
    settings.isSlider = false;
  };

  return Gallery;
})();
