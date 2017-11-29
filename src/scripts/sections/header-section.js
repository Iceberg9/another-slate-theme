theme.HeaderSection = (function() {
  'use strict';

  function Header() {
    theme.StickyHeader.init();
  }

  Header.prototype.onUnload = function() {
    theme.StickyHeader.unload();
  };

  return Header;
})();
