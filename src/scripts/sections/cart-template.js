theme.CartTemplate = (function() {
  'use strict';

  var selectors = {
    cartQtyInput: 'input[type="number"]'
  };

  function CartTemplate(container) {
    this.$container = $(container);
    var sectionId = this.$container.data('section-id');

    theme.cartObject = JSON.parse($('#CartJson-' + sectionId).html());

    this.initQtySelector();
  }

  CartTemplate.prototype.initQtySelector = function() {
    $(selectors.cartQtyInput, this.$container).each(function(i, el) {
      new QtySelector(el);
    });
  };

  return CartTemplate;
})();
