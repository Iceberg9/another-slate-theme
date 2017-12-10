theme.HeaderSection = (function() {
  'use strict';

  function Header() {
    theme.StickyHeader.init();
    theme.MobileNav.init();
    theme.AjaxCart.init();
  }

  Header.prototype.onUnload = function() {
    theme.StickyHeader.unload();
    theme.MobileNav.unload();
    theme.AjaxCart.unload();
  };

  return Header;
})();
