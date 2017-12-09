theme.NewsletterPopup = (function() {
  'use strict';

  var selectors = {
    modalNewsletter: '#newsletterModal'
  };

  var settings = {
    secondsBeforeShow: theme.newsletterDelay,
    daysBeforeReappear: theme.newsletterFrequency,
    enabled: theme.newsletterEnabled
  };

  function NewsletterPopup(container) {
    this.$container = $(container)
    var sectionId = this.$container.data('section-id');
    settings.cookieName = sectionId;

    this.cookie = Cookies.get(settings.cookieName);

    this.$modal = $(selectors.modalNewsletter, this.$container);

    if (!settings.enabled) {
      return;
    }

    this.$modal.on('hidden.bs.modal', this.onClose);

    if (!this.cookie) {
      this.initPopupDelay();
    }
  }

  NewsletterPopup.prototype = new theme.ModalRequest();
  NewsletterPopup.prototype.constructor = NewsletterPopup;

  NewsletterPopup.prototype.initPopupDelay = function() {
    var self = this;

    setTimeout(function() {
      self.$modal.modal('show');
    }, settings.secondsBeforeShow * 1000);
  };

  NewsletterPopup.prototype.onClose = function(evt) {
    var attributes = {
      expires: settings.daysBeforeReappear
    };
    Cookies.set(settings.cookieName, 'opened', attributes);
  };

  return NewsletterPopup;
})();
