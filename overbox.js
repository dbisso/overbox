/* global jQuery:true, Modernizr:true */

/**
 * Overbox
 *
 * Basic fixed overlay for lightbox like content.
 *
 * @param {Object} $ jQuery
 * @version 0.1.0
 * @param {Object} DBisso Global namespace to nest things in
 * @author Dan Bissonnet <dan@danisadesigner.com>
 * @exports DBisso.Overbox
 */
(function (root, factory) {
	// Create a namespace
    root.DBisso = root.DBisso || {};

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery', 'EventEmitter'], function (jQuery, EventEmitter) {
            // Also create a global in case some scripts
            // that are loaded still are looking for
            // a global even when an AMD loader is in use.
            return (root.DBisso.Overbox = factory(jQuery, EventEmitter));
        });
    } else {
        // Browser globals
        root.DBisso.Overbox = factory(root.jQuery);
    }
}(this, function( $, eventEmitter ) {
	if ( !window.getComputedStyle || !window.addEventListener || !Function.prototype.bind ) {
		return;
	}

	var transitionProp = "webkitTransition" in document.body.style ? (transitionend = "webkitTransitionEnd") && "webkitTransition" : "mozTransition" in document.body.style ? "mozTransition" : "transition" in document.body.style ? "transition" : false;

	function Overbox() {
		this.overlay = $('<div class="overbox"/>');
		this.closeBtn = $('<a class="overbox--close" href="#">Close</a>');
		this.loading = $('<div class="overbox--loading"><span>Loading</span></div>');
		this.content = $('<div class="overbox--content" />');

		this.overlay.append(this.closeBtn);
		this.overlay.append(this.content);
	}

	function setContent(content) {
		this.content.html(content);
		return this;
	}

	function appendContent(content) {
		this.content.append(content);
		return this;
	}

	function empty() {
		this.content.empty();
		return this;
	}

	function init() {
		// Clear out the overlay and hide
		this.overlay.append(this.loading).addClass('overbox--is-hidden');

		// Fix the height so that the descendent elements can have height
		this.overlay.css('height', $(window).height());

		this.closeBtn.click( this.close.bind(this) );

		if ( 'undefined' !== typeof window.Modernizr && Modernizr.touch ) {
			this.overlay.addClass('overbox--is-touch');
		}

		this.overlay.on( 'click', closeOnClick.bind(this) );
		$('body').prepend(this.overlay).addClass('overbox--is-active');

		bindKeys.call(this);

		if ( this.trigger ) {
			this.trigger( 'init', this );
		}

		return this;
	}

	function open() {
		this.init();
		this.show();

		if ( this.trigger ) {
			this.trigger( 'open', this );
		}

		return this;
	}

	function closeOnClick(event) {
		if ( event.target.className.match(/overbox--item/) ) {
			this.close();
		}
		return this;
	}

	function show() {
		// For some reason transitions aren't triggered unless we do this.
		setTimeout(	function() {
			this.overlay.removeClass('overbox--is-hidden');
		}.bind(this), 0 );

		var transition = window.getComputedStyle( this.overlay[0] )[transitionProp + 'Duration'];

		if ( transition && transition !== '0s' ) {
			this.overlay.on( 'transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', shown.bind(this) );
		} else {
			shown.apply(this);
		}

		return this;
	}

	function shown() {
		if ( this.trigger ) {
			this.trigger( 'show', this );
		}

		return this;
	}

	function close() {
		if ( this.trigger ) {
			this.trigger( 'close' );
		}

		this.overlay.addClass('overbox--is-hidden');

		var transition = window.getComputedStyle( this.overlay[0] )[transitionProp + 'Duration'];

		if ( transition && transition !== '0s' ) {
			this.overlay.on( 'transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', cleanUp.bind(this) );
		} else {
			cleanUp.apply(this);
		}
	}

	function cleanUp() {
		$('body').removeClass('overbox--is-active');

		this.overlay.remove();

		if ( this.trigger ) {
			this.trigger( 'closed' );
		}

		return this;
	}

	function stopLoading() {
		this.loading.remove();
		return this;
	}

	function bindKeys() {
		$(document).on( 'keydown', function( event ) {
			// 27 = esc
			if ( 27 === event.which ) {
				this.close();
			}
		}.bind(this) );
	}

	Overbox.prototype.setContent = setContent;
	Overbox.prototype.appendContent = appendContent;
	Overbox.prototype.open = open;
	Overbox.prototype.show = show;
	Overbox.prototype.init = init;
	Overbox.prototype.close = close;
	Overbox.prototype.empty = empty;
	Overbox.prototype.stopLoading = stopLoading;

	// Add optional support for event emitter
	eventEmitter = eventEmitter || window.EventEmitter;

	if ( eventEmitter ) {
		$.extend( Overbox.prototype, eventEmitter.prototype );
	}

	// Export the constructor
	return Overbox;
}));