window.QtySelector = (function() {
  'use strict';

  var selectors = {
    body: 'body',
    cartContainer: '#cart-container',
    subtotalWrapper: '[data-subtotal]',
    message: '[data-message]'
  };

  var settings = {
    minQty: $(selectors.body).hasClass('template-cart') ? 0 : 1,
    isCartTemplate: $(selectors.body).hasClass('template-cart'),
  };

  var QtySelector = function(el) {
    var $el = $(el);

    this.$el = $el;

    this.createInputs();
    this.bindEvents();
  };

  QtySelector.prototype.createInputs = function() {
    var $el = this.$el;

    var data = {
      value: $el.val(),
      key: $el.attr('id'),
      name: $el.attr('name'),
      line: $el.attr('data-line')
    };

    var source = $("#JsQty").html();
    var template = Handlebars.compile(source);

    this.$wrapper = $(template(data)).insertBefore($el);

    // Remove original number input
    $el.remove();
  };

  QtySelector.prototype.bindEvents = function() {
    this.$wrapper.find('.js-qty__adjust').on('click', $.proxy(this.adjustQty, this));

    // Select input text on click
    this.$wrapper.on('click', '.js-qty__num', function() {
      this.setSelectionRange(0, this.value.length);
    });

    // If the quantity changes on the cart template, update the price
    if (settings.isCartTemplate) {
      this.$wrapper.on('change', '.js-qty__num', $.proxy(function(evt) {
        var $input = $(evt.currentTarget);
        var line = $input.attr('data-line');
        var qty = this.validateQty($input.val());
        this.updateCartItemPrice(line, qty);
      }, this));
    }
  };

  QtySelector.prototype.adjustQty = function(evt) {
    var $el = $(evt.currentTarget);
    var $input = $el.siblings('.js-qty__num');
    var qty = this.validateQty($input.val());
    var line = $input.attr('data-line');

    if ($el.hasClass('js-qty__adjust--minus')) {
      qty -= 1;
      if (qty <= settings.minQty) {
        qty = settings.minQty;
      }
    } else {
      qty += 1;
    }

    if (settings.isCartTemplate) {
      this.updateCartItemPrice(line, qty);
    } else {
      $input.val(qty);
    }
  };

  QtySelector.prototype.validateQty = function(qty) {
    if ((parseFloat(qty) === parseInt(qty, 10)) && !isNaN(qty)) {
      // We have a valid number!
    } else {
      // Not a number. Default to 1.
      qty = 1;
    }
    return parseInt(qty, 10);
  };

  QtySelector.prototype.updateCartItemPrice = function(line, qty) {
    // Update cart after short timeout so user doesn't create simultaneous ajax calls
    clearTimeout(this.qtyUpdateTimeout);
    this.qtyUpdateTimeout = setTimeout($.proxy(function() {
      this.validateAvailability(line, qty);
    }, this), 200);
  };

  QtySelector.prototype.validateAvailability = function(line, quantity) {
    var product = theme.cartObject.items[line - 1]; // 0-based index in API
    var handle = product.handle; // needed for the ajax request
    var id = product.id; // needed to find right variant from ajax results

    var params = {
      type: 'GET',
      url: '/products/' + handle + '.js',
      dataType: 'json',
      success: $.proxy(function(cartProduct) {
        this.validateAvailabilityCallback(line, quantity, id, cartProduct);
      }, this)
    };

    $.ajax(params);
  };

  QtySelector.prototype.validateAvailabilityCallback = function(line, quantity, id, product) {
    var quantityIsAvailable = true;

    // This returns all variants of a product.
    // Loop through them to get our desired one.
    for (var i = 0; i < product.variants.length; i++) {
      var variant = product.variants[i];
      if (variant.id === id) {
        break;
      }
    }

    // If the variant tracks inventory and does not sell when sold out
    // we can compare the requested with available quantity
    if (variant.inventory_management !== null && variant.inventory_policy === 'deny') {
      if (variant.inventory_quantity < quantity) {
        // Show notification with error message
        var currentText = $(selectors.message).html();

        $(selectors.message)
          .text(theme.strings.noStockAvailable)
          .addClass('color-accent');

        clearTimeout(timeout);
        var timeout = setTimeout(function() {
          $(selectors.message)
            .text(currentText)
            .removeClass('color-accent');
        }, 4000);

        // Set quantity to max amount available
        this.$wrapper.find('.js-qty__num').val(variant.inventory_quantity);

        quantityIsAvailable = false;
      }
    }

    if (quantityIsAvailable) {
      this.updateItemQuantity(line, quantity);
    }
  };

  QtySelector.prototype.updateItemQuantity = function(line, quantity) {
    var params = {
      type: 'POST',
      url: '/cart/change.js',
      data: 'quantity=' + quantity + '&line=' + line,
      dataType: 'json',
      success: $.proxy(function(cart) {
        this.updateCartItemCallback(cart);
      }, this)
    };

    $.ajax(params);
  };

  QtySelector.prototype.updateCartItemCallback = function(cart) {
    // Reload the page to show the empty cart if no items
    if (cart.item_count === 0) {
      location.reload();
      return;
    }

    // Update cart object
    theme.cartObject = cart;

    // Handlebars.js cart layout
    var data = {};
    var items = [];
    var item = {};
    var source = $('#CartProductTemplate').html();
    var template = Handlebars.compile(source);
    var prodImg;

    // Add each item to our handlebars.js data
    $.each(cart.items, function(index, cartItem) {

      /* Hack to get product image thumbnail
       *   - If image is not null
       *     - Remove file extension, add 240x240, and re-add extension
       *     - Create server relative link
       *   - A hard-coded url of no-image
       */

      if (cartItem.image === null) {
        prodImg = '//cdn.shopify.com/s/assets/admin/no-image-medium-cc9732cb976dd349a0df1d39816fbcc7.gif';
      } else {
        prodImg = slate.Image.getSizedImageUrl(cartItem.image, '240x240_crop_center');
      }

      if (cartItem.properties !== null) {
        $.each(cartItem.properties, function(key, value) {
          if (key.charAt(0) === '_' || !value) {
            delete cartItem.properties[key];
          }
        });
      }

      // Create item's data object and add to 'items' array
      item = {
        key: cartItem.key,
        line: index + 1, // Shopify uses a 1+ index in the API
        url: cartItem.url,
        img: prodImg,
        name: cartItem.product_title,
        variation: cartItem.variant_title,
        properties: cartItem.properties,
        itemQty: cartItem.quantity,
        price: slate.Currency.formatMoney(cartItem.price, theme.moneyFormat),
        vendor: cartItem.vendor,
        linePrice: slate.Currency.formatMoney(cartItem.line_price, theme.moneyFormat),
        originalLinePrice: slate.Currency.formatMoney(cartItem.original_line_price, theme.moneyFormat),
        discounts: cartItem.discounts,
        discountsApplied: cartItem.line_price === cartItem.original_line_price ? false : true
      };

      items.push(item);
    });

    // Gather all cart data and add to DOM
    data = {
      items: items
    };
    $(selectors.cartContainer).empty().append(template(data));

    // Create new quantity selectors
    $(selectors.cartContainer).find('input[type="number"]').each(function(i, el) {
      new QtySelector($(el));
    });

    // Update the cart subtotal
    $(selectors.subtotalWrapper).html(slate.Currency.formatMoney(cart.total_price, theme.moneyFormat));

    // Set focus on cart table
    slate.a11y.pageLinkFocus($(selectors.cartContainer));
  };

  return QtySelector;
})();
