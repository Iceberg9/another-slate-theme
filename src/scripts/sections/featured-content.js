theme.FeaturedContent = (function() {
  'use strict';

  function FeaturedContent(container) {
    this.$container = $(container);
    var sectionId = this.$container.data('section-id');

    this.$checkbox = $('#toggle-' + sectionId, this.$container);
  }

  FeaturedContent.prototype.onSelect = function(evt) {
    this.$checkbox.prop('checked', true);
  }

  FeaturedContent.prototype.onDeselect = function(evt) {
    this.$checkbox.prop('checked', false);
  }

  return FeaturedContent;
})();
