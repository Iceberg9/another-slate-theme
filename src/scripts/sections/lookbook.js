theme.Lookbook = (function() {
  'use strict';

  var selectors = {
    slide: '.lookbook__image',
    pagination: '[data-pagination]'
  }

  function Lookbook(container) {
    this.$container = $(container);
    var sectionId = this.$container.data('section-id');

    this.$slider = $('#Slider-' + sectionId, this.$container);

    var settings = {
      dots: false,
      arrows: true,
      autoplay: this.$slider.data('autoplay'),
      autoplaySpeed: this.$slider.data('speed'),
      adaptiveHeight: true,
      slide: selectors.slide,
      fade: true,
      responsive: [
        {
          breakpoint: '989',
          settings: {
            arrows: false,
            dots: true
          }
        }
      ]
    };

    this.$slider.on('init reInit afterChange', this.pagination);

    this.$slider.slick(settings);
  }

  Lookbook.prototype.pagination = function(event, slick, currentSlide, nextSlide) {
    var currentSlide = currentSlide ? currentSlide : 0;
    var index = currentSlide + 1;
    $(selectors.pagination, this.$container).html(index + '/' + slick.slideCount);
  };

  return Lookbook;
})();
