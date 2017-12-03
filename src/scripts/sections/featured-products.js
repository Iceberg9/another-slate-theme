theme.FeaturedProducts = (function() {
  'use strict';

  var settings = {
    mediaQuerySmall: 'screen and (max-width: 749px)',
    isSlider: false
  };

  var defaults = {
    arrows: false,
    dots: true,
    adaptiveHeight: true,
    slidesToShow: 2,
    slidesToScroll: 2
  };

  function FeaturedProducts(container) {
    this.$container = $(container);
    var sectionId = this.$container.data('section-id');
    this.$slider = $('#Slider-' + sectionId, this.$container);

    this.initBreakpoints();
  }

  FeaturedProducts.prototype.initBreakpoints = function() {
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

  FeaturedProducts.prototype.initSlider = function() {
    this.$slider.slick(defaults);
    settings.isSlider = true;
  };

  FeaturedProducts.prototype.destroySlider = function() {
    this.$slider.slick('unslick');
    settings.isSlider = false;
  };

  return FeaturedProducts;

})();
