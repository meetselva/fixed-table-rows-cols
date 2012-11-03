$(function () {

	$('#slide_items li').click (function () {
		
		if (this.id == 'si_close') {
			
			if ($(this).hasClass('ui-icon-circle-triangle-n')) return;
			
			$('#slide_container .slide_content').slideUp();
			$('#slide_items li').removeClass('active ui-state-active');
			$(this).find('span').removeClass('ui-icon-circle-triangle-s').addClass('ui-icon-circle-triangle-n');
			return;
		}
		
		if ($(this).hasClass('active')) return;
		
		$('#slide_container .slide_content').not('.' + this.id + '_content').slideUp();
		$('#slide_container' + ' .' + this.id + '_content').slideDown();
		
		$('#slide_items li').removeClass('active ui-state-active');
		$(this).addClass('active ui-state-active');	
		
		$('#si_close').find('span').removeClass('ui-icon-circle-triangle-n').addClass('ui-icon-circle-triangle-s');
	});
	
	$('.themes-el').click (function () {
		
		$('.themes-el').removeClass('ui-state-highlight active'); //remove class for all li
		$(this).addClass('ui-state-highlight active');
		
		var selectedTheme = $(this).data('theme');
				
		util.showOverlay($('body'), 'Loading the new theme, Please wait..', function (selectedTheme) {
			var linkURL = $('link')[1].href;
			linkURL = linkURL.substring(0, linkURL.indexOf('\/themes\/') + 8);
			$('link')[1].href = linkURL + selectedTheme + '/jquery-ui.css';
			
			setTimeout(function () {
				util.hideOverlay();
			}, 500);
		}, [selectedTheme]);
	}).hover(function () {
		if ($(this).hasClass('ui-state-highlight')) {
			$(this).addClass('active');
		} else { 
			$(this).addClass('ui-state-highlight');
		}
	}, function () { 
		if ($(this).hasClass('active')) {
			$(this).removeClass('active');
		} else {
			$(this).removeClass('ui-state-highlight');
		}
	});
	
	$('#c_overlay').fadeOut(2000);
});

var util = {
		
		/* Utility function to show overlay over a div element  */
		showOverlay: function (el, txt, callback, callbackArgs) {
			var overlay = $('#c_overlay');
			if (overlay.length == 0) {
				el.append('<div id="c_overlay" ></div>');
				overlay = $('#c_overlay');
			} 
			if ($('#c_overlay_status').length == 0) {
				el.append('<div id="c_overlay_status" class="ui-corner-all" >' + 					
						'<span id="c_overlay_status_msg"></span>' +
						'</div>');			
			} 
			$('#c_overlay_status_msg').html(txt);
			overlay.fadeIn(400, function () {
				callback(callbackArgs);
			});
			$('#c_overlay_status').show();
			
			overlay.css({"width": el.outerWidth() + "px", "height": (el.outerHeight()) + "px"});
			
			overlay.position({
				of: el,
				my: 'left top',
				at: 'left top',
				offset: '0 0',
				collision: 'none none'
			});
			
			overlay = null;
		},

		/* Utility function to hide overlay shown over a div element */
		hideOverlay: function () { $("#c_overlay").fadeOut(500); $("#c_overlay_status").hide(); }
};