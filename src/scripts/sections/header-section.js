theme.HeaderSection = (function() {
  'use strict';

  function Header() {
    theme.StickyHeader.init();
    theme.MobileNav.init();
  }

  Header.prototype.onUnload = function() {
    theme.StickyHeader.unload();
    theme.MobileNav.unload();
  };

  return Header;
})();
