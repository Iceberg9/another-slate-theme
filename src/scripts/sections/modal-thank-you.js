theme.ModalThankYou = (function() {
  var selectors = {
    modalThankYou: '#thankyouModal',
    modalButton: '#ModalButton'
  };


  function ModalThankYou(container) {
    this.$container = $(container)
    var sectionId = this.$container.data('section-id');

    this.$modal = $(selectors.modalThankYou, this.$container);

    if (this.isContactPosted()) {
      this.$modal.modal('show');
      $(selectors.modalButton).on('click.toggleModal', $.proxy(this.onClickToggleModal, this));
    }
  }

  ModalThankYou.prototype = new theme.ModalRequest();
  ModalThankYou.prototype.constructor = ModalThankYou;

  ModalThankYou.prototype.isContactPosted = function() {
    if (Shopify.queryParams.contact_posted === undefined) {
      return false;
    }

    if (!Shopify.queryParams.contact_posted == true) {
      return false;
    }

    return true;
  };

  ModalThankYou.prototype.onClickToggleModal = function(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.$modal.modal('show');
  };

  return ModalThankYou;
})();
