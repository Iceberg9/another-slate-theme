theme.StickyHeader = (function() {
  'use strict';

  var selectors = {
    siteHeader: '#SiteHeader',
    notificationBar: '#NotificationBar'
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
      $siteHeader: $(selectors.siteHeader),
      $notificationBar: $(selectors.notificationBar)
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

    if (cache.$notificationBar.length) {
      threshold += cache.$notificationBar.outerHeight();
    }

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

    var offset = getThreshold();

    config.lastThreshold = offset;

    cache.$siteHeader.addClass(config.siteHeaderStickyClass);
    cache.$body.css('padding-top', offset);
    cache.$notificationBar.hide();
  }

  function unstickNav() {
    if (!config.isActive) {
      return;
    }

    config.isActive = false;

    config.lastThreshold = 0;

    cache.$siteHeader.removeClass(config.siteHeaderStickyClass);
    cache.$body.css('padding-top', '');
    cache.$notificationBar.show();
  }

  function unload() {
    cache.$window.off('scroll.stickyNav');
  }

  return {
    init: init,
    unload: unload
  };
})();
