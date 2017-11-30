theme.MobileNav = (function() {
  'use strict';

  var selectors = {
    siteHeader: '#SiteHeader',
    toggleNav: '#ToggleNav',
    hamburger: '#Hamburger',
    mobileNav: '#MobileNav',
    itemHasSubmenu: '.mobile-nav__item--has-submenu'
  };

  var config = {
    hamburgerCollapsedClass: 'hamburger--collapsed',
    itemActiveSubmenu: 'mobile-nav__item--active-submenu'
  };

  var cache = {};

  function cacheSelectors() {
    cache = {
      $window: $(window),
      $siteHeader: $(selectors.siteHeader),
      $toggleNav: $(selectors.toggleNav),
      $hamburger: $(selectors.hamburger),
      $mobileNav: $(selectors.mobileNav),
      $itemHasSubmenu: $(selectors.itemHasSubmenu)
    };
  }

  function init() {
    cacheSelectors();

    cache.$toggleNav.on('click.toggleNav', onClickToggleNav);
    cache.$itemHasSubmenu.on('click.mobileNav', onClickHasSubmenu);
  }

  function onClickHasSubmenu(evt) {
    var $el = $(this);

    if (evt.target.tagName == 'svg') {
      evt.preventDefault();
      $el.toggleClass(config.itemActiveSubmenu);
    }
  }

  function onClickToggleNav(evt) {
    evt.preventDefault();

    cache.$hamburger.toggleClass(config.hamburgerCollapsedClass);
    cache.$mobileNav.fadeToggle(300);
  }

  function unload() {
    cache.$toggleNav.off('click.toggleNav');
    cache.$itemHasSubmenu.off('click.mobileNav');
  }

  return {
    init: init,
    unload: unload
  };

})();
