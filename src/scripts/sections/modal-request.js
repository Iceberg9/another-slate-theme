theme.ModalRequest = (function() {
  'use strict';

  var selectors = {
    modalRequest: '#requestModal'
  };

  function ModalRequest(container) {
    this.$container = $(container)
    var sectionId = this.$container.data('section-id');

    this.$modal = $(selectors.modalRequest, this.$container);

    if (this.isContactForm()) {
      this.$modal.modal('show');
    }
  }

  ModalRequest.prototype.onSelect = function(evt) {
    this.$modal.modal('show');
  };

  ModalRequest.prototype.onDeselect = function(evt) {
    this.$modal.modal('hide');
  };

  ModalRequest.prototype.isContactForm = function() {
    if (Shopify.queryParams.form_type === undefined) {
      return false;
    }

    if (!Shopify.queryParams.form_type == 'contact') {
      return false;
    }

    return true;
  };

  return ModalRequest;
})();
