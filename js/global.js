$(function () {

	
	/*$('.hdr_links', $('#header')).hover(function () {
		$(this).addClass('ui-state-highlight');
	}, function () {
		$(this).removeClass('ui-state-highlight');
	});.click (function () { //PiA to implement this
		$(this).addClass('ui-state-highlight');
	});*/
	
	/* Themes Global Code Start */
	
	//Theme click handler
	var $themes = $('#themes');
	var $themelist = $('#theme-list');
	var $themesSelect = $('.themes-el');
	
	var themeLinkPos = $themes.position();
	$themelist.dialog({
		position: [themeLinkPos.left - 220, themeLinkPos.top + 20],
		autoOpen: false,
		title: 'Select a theme',
		/*hide: { effect: 'drop', direction: "down" },
		show: { effect: 'drop', direction: "up" },*/
		hide: "fade",
		show: "slide",
		draggable: false,
		height: 300
	});
	
	$themes.click (function (e) { e.stopPropagation(); $themelist.dialog('open'); });
	
	$themelist.parent().click (function (e) { e.stopPropagation(); });
	
	$themesSelect.click (function () {
		$themesSelect.removeClass('ui-state-highlight');
		$(this).addClass('ui-state-highlight');
		
		var selectedTheme = $(this).data('theme');
		$themelist.dialog('close');
		util.showOverlay($('body'), 'Loading the new theme, Please wait..', function (selectedTheme) {
			var linkURL = $('link')[1].href;
			linkURL = linkURL.substring(0, linkURL.indexOf('\/themes\/') + 8);
			$('link')[1].href = linkURL + selectedTheme + '/jquery-ui.css';
			
			setTimeout(function () {
				util.hideOverlay();
			}, 500);
		}, [selectedTheme]);
	}).hover(function () {  $(this).addClass('ui-state-highlight'); }, 
			 function () { $(this).removeClass('ui-state-highlight'); });
	
	$(document).click (function (e) {
		if ($themelist.dialog( "isOpen" ) ) {
			$themelist.dialog('close');
		}
	});
	
	$('#c_overlay').fadeOut(500);
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