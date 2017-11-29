theme.StickyHeader = (function() {
  'use strict';

  var selectors = {
    siteHeader: '#SiteHeader'
  };

  var config = {
    lastThreshold: 0,
    siteHeaderStickyClass: 'site-header--sticky'
  };

  var cache = {};

  function cacheSelectors() {
    cache = {
      $body: $('body'),
      $window: $(window),
      $siteHeader: $(selectors.siteHeader)
    };
  }

  function init() {
    cacheSelectors();
    config.isActive = false;

    stickyHeaderOnScroll();
    cache.$window.on('scroll.stickyNav', $.throttle(15, stickyHeaderOnScroll));
  }

  function getThreshold() {
    var threshold = cache.$siteHeader.outerHeight();

    if (config.lastThreshold > 0) {
      threshold = config.lastThreshold;
    }

    return threshold;
  }

  function stickyHeaderOnScroll() {
    var scroll = cache.$window.scrollTop();
    var threshold = getThreshold();

    if (scroll > threshold) {
      stickNav();
    } else {
      unstickNav();
    }
  }

  function stickNav() {
    if (config.isActive) {
      return;
    }

    config.isActive = true;

    var offset = cache.$siteHeader.outerHeight();

    config.lastThreshold = offset;

    cache.$siteHeader.addClass(config.siteHeaderStickyClass);
    cache.$body.css('padding-top', offset);
  }

  function unstickNav() {
    if (!config.isActive) {
      return;
    }

    config.isActive = false;

    config.lastThreshold = 0;

    cache.$siteHeader.removeClass(config.siteHeaderStickyClass);
    cache.$body.css('padding-top', '');
  }

  function unload() {
    cache.$window.off('scroll.stickyNav');
  }

  return {
    init: init,
    unload: unload
  };
})();
