theme.PiecesList = (function() {
  'use strict';

  var settings = {
    mediaQueryMediumUp: 'screen and (min-width: 750px)',
    isMasonry: false
  };

  var defaults = {
    itemSelector: '.pieces-list__item'
  };

  function PiecesList(container) {
    this.$container = $(container)
    var sectionId = this.$container.data('section-id');
    this.$grid = $('#PiecesGrid-' + sectionId, this.$container);

    this.initBreakpoints();
  }

  PiecesList.prototype.initBreakpoints = function() {
    var self = this;

    enquire.register(settings.mediaQueryMediumUp, {
      match: function() {
        self.initMasonry();
      },
      unmatch: function() {
        if (settings.isMasonry) {
          self.destroyMasonry();
        }
      }
    });
  };

  PiecesList.prototype.initMasonry = function() {
    var self = this;

    this.$grid.masonry(defaults);

    this.$grid.imagesLoaded().progress(function() {
      self.$grid.masonry('layout');
    });

    settings.isMasonry = true;
  };

  PiecesList.prototype.destroyMasonry = function() {
    this.$grid.masonry('destroy');

    settings.isMasonry = true;
  };

  return PiecesList;
})();
