/**
 * Goal of palette plugin:
 * - progressive enhancement: start with a standard dropdown of named palettes, with values of json arrays of color codes
 * - if javascript is available, hide standard dropdown and display a pleasant dropdown of color palettes
 * - have a "custom" one that, if chosen, allows users to create their own (hard; requires loose coupling to dialogs, etc.?)
 */
/*jslint white: false */
/*global jQuery: true */
(function($) {
	var methods = {
		init : function(options) {
			return this.each(function(){
				var $this = $(this), data = $this.data('palette'), $swatch, $dropdown, $selected;
				
				// If the plugin hasn't been initialized yet
				if (!data) {
					// Create dropdown of palette options
					$swatch = $('<div class="palette-swatch"/>')
					$current = $('<div class="palette-current"/>');
					$dropdown = $('<div class="palette-select"/>');
					$("option", $this).each(function() {
						var label = $(this).text() || '', value = $(this).attr('value'), colors = value.split(/ /), $option = $('<div class="palette-option"/>');
						$(colors).each(function() {
							$option.append('<div class="palette-color" style="background-color: ' + this + '" />');
						});
						$option.data('value', value).data('label', label);
						$dropdown.append($option);
						if (!$selected) {
							$selected = $option;
						}
					});
					// Clicking any option selects it and closes the dropdown
					$('.palette-option', $dropdown).click(function() {
						$selected = $(this);
						options.onChange($selected.data('value'), $selected.data('label'));
						$current.empty().append($selected.clone());
						$dropdown.slideUp('fast');
					});
					// Clicking the swatch displays the dropdown
					$swatch.click(function() {
						$dropdown.slideDown('fast');
					});
					$swatch.append($current);
					$swatch.append($dropdown);
					$swatch.append($selected.clone());
					$this.replaceWith($swatch);
					
					$this.data('palette', {
						dropdown: $dropdown
					});
				}
			});
		},
		destroy: function() {
			return this.each(function() {
				var $this = $(this), data = $this.data('palette');

				// Namespacing FTW
				data.palette.remove();
				$this.removeData('palette');
			});
		}
	 };

	$.fn.palette = function( method ) {
		// Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.palette' );
		}
	};
}( jQuery ));
