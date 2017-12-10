theme.AjaxCart = (function() {
  'use strict';

  var selectors = {
    openCart: '[data-open-cart]',
    miniCartContent: '[data-mini-cart-content]',
    miniCart: '[data-mini-cart]',
    miniCartClose: '[data-mini-cart-close]'
  };

  var config = {
    isOpen: false
  };

  var cache = {};

  function cacheSelectors() {
    cache = {
      $openCart: $(selectors.openCart),
      $miniCartContent: $(selectors.miniCartContent),
      $miniCart: $(selectors.miniCart),
      $miniCartClose: $(selectors.miniCartClose)
    }
  }

  function init() {
    cacheSelectors();

    cache.$openCart.on('click.Cart', onClickOpenCart);
    cache.$miniCartClose.on('click.Cart', onClickCloseCart);
  }

  function onClickOpenCart(evt) {
    evt.preventDefault();

    if (config.isOpen) {
      return;
    }

    getCart();
  }

  function onClickCloseCart(evt) {
    evt.preventDefault();
    closeMiniCart();
  }

  function getCart() {
    $.getJSON('/cart.js', onCartUpdate);
  }

  function onCartUpdate(cart) {
    cache.$miniCartContent.empty();

    if (cart.item_count === 0) {
      var html = $('#NoItemsInBag').html();

      cache.$miniCartContent.append(html);

      showMiniCart();

      return;
    }

    var source = $('#ItemsInBag').html();
    var template = Handlebars.compile(source);
    var context = {
      itemsCount: cart.item_count
    };
    var html = template(context);

    cache.$miniCartContent.append(html);

    showMiniCart();
  }

  function showMiniCart() {
    if (config.isOpen) {
      return;
    }

    cache.$miniCart.fadeIn(300);

    config.isOpen = true;

    cache.$miniCart.on('click.Cart', function(evt) {
      evt.stopImmediatePropagation();
    });

    $(document).on('keydown.Cart', function(evt) {
      if (evt.keyCode === 27) {
        closeMiniCart();
      }
    });

    $('body').on('click.Cart', function() {
      closeMiniCart();
    });
  }

  function closeMiniCart() {
    if (!config.isOpen) {
      return;
    }

    cache.$miniCart.fadeOut(300);
    config.isOpen = false;

    cache.$miniCart.off('click.Cart');
    $(document).off('keydown.Cart');
    $('body').off('click.Cart');
  }

  function unload() {
    cache.$openCart.off('click.Cart');
    cache.$miniCartClose.off('click.Cart');
    cache.$miniCart.off('click.Cart');
    $(document).off('keydown.Cart');
    $('body').off('click.Cart');
  }

  return {
    init: init,
    unload: unload,
    closeMiniCart: closeMiniCart
  };
})();
