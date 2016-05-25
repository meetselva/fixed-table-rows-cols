/*
A jQuery plugin to convert a well formatted table into a table with fixed
rows and columns.

Copyright 2011-2015 Selvakumar Arumugam
http://meetselva.github.io/

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
(function ($) {
	
	$.fn.fxdHdrCol = function (o) {
		var cfg = {
			height: 0,
			width: 0,		
			leftFixedCols: 0,
			rightFixedCols: 0,
			colModal: [],
			tableTmpl: function () {
				return '<table />';							
			},
			sort: false,
			tableClasses: ''
		};
		$.extend(cfg, o);
		
		return this.each (function () {
			var lc = {
					ft_container: null,
					ft_rel_container: null,
					ft_wrapper: null,
					ft_rc: null,
					ft_r: null,
					ft_c_left: null,
					ft_c_right: null,
					tableWidth: 0
			};
			
			var $this = $(this);
								
			$this.wrap('<div class="ft_container" />');
			lc.ft_container = $this.parent().css({width: cfg.width, height: cfg.height});		
			
			var $ths = $('thead tr', $this).first().find('th');
			
			if (cfg.sort && sorttable && cfg.leftFixedCols == 0) {				
				$ths.addClass('fx_sort_bg');				
			}

			var $thFirst = $ths.first();
			var thSpace = parseInt($thFirst.css('paddingLeft'), 10) + parseInt($thFirst.css('paddingRight'), 10);

			/* set width and textAlign from colModal */
			var ct = 0;
			$ths.each(function (i, el) {
				var calcWidth = 0;
				for (var j = 0; j < el.colSpan; j++) {
					calcWidth += cfg.colModal[ct].width;
					ct++;
				}
				$(el).css({width: calcWidth, textAlign: cfg.colModal[ct-1].align});
				
				lc.tableWidth += calcWidth + thSpace + ((i == 0)?2:1);
			});
								
			$('tbody', $this).find('tr').each(function (i, el) {
				$('td', el).each(function (i, tdel) {
					tdel.style.textAlign = cfg.colModal[i].align;
				});
			});
			
			$this.width(lc.tableWidth);

			//add relative container
			$this.wrap('<div class="ft_rel_container" />');
			lc.ft_rel_container = $this.parent();
						
			//add wrapper to base table which will have the scrollbars
			$this.wrap('<div class="ft_scroller" />');
			lc.ft_wrapper = $this.parent().css('width', cfg.width - 5);
			
			var theadTr = $('thead', $this);
			//clone the thead->tr 
			var theadTrClone = theadTr.clone();
			
			//construct fixed row (full row)
			lc.ft_rel_container
				.prepend($(cfg.tableTmpl(), {'class': 'ft_r ' + cfg.tableClasses})
				.append(theadTrClone));

			//an instance of fixed row
			lc.ft_r = $('.ft_r', lc.ft_rel_container);
			lc.ft_r.wrap($('<div />', {'class': 'ft_rwrapper'}));
			
			lc.ft_r.width(lc.tableWidth);
			
			if (cfg.leftFixedCols > 0) {
				//clone the thead again to construct the 
				theadTrClone = theadTr.clone();
				
				//calculate the actual column's count (support for colspan)					
				var r1c1ColSpan = 0;	
				for (var i = 0; i < cfg.leftFixedCols; i++ ) {
					r1c1ColSpan += this.rows[0].cells[i].colSpan;			
				}					
				
				//prepare rows/cols for fixed row col section
		        $('tr', theadTrClone).each(function () {
		          var tdct = 0;
		          $(this).find('th').filter(function() {
		            tdct += this.colSpan;
		            return tdct > r1c1ColSpan;
		          }).remove();
		        });
				
				//add fixed row col section
				lc.ft_rel_container
					.prepend($(cfg.tableTmpl(), {'class': 'ft_rc ' + cfg.tableClasses})
					.append(theadTrClone));
				
				//an instance of fixed row column
				lc.ft_rc = $('.ft_rc', lc.ft_rel_container);
				
				//now clone the fixed row column and append tbody for the remaining rows
				lc.ft_c_left = lc.ft_rc.clone();
				lc.ft_c_left[0].className = 'ft_c ' + cfg.tableClasses;
				
				//append tbody
				lc.ft_c_left.append('<tbody />');
				
				//append row by row while just keeping the frozen cols
				var ftc_tbody = lc.ft_c_left.find('tbody'); 
				$.each ($this.find('tbody > tr'), function (idx, el) {
					var tr = $(el).clone();
					
					tdct = 0;
					tr.find('td').filter(function (){
						tdct += this.colSpan;
						return tdct > r1c1ColSpan;
					}).remove();
					
					ftc_tbody.append(tr);
				});
				
				lc.ft_rc.after(lc.ft_c_left);
				lc.ft_c_left.wrap($('<div />', {'class': 'ft_cwrapper'}));

				var tw = 0;
				for (var i = 0; i < cfg.leftFixedCols; i++) {
					tw += $(this.rows[0].cells[i]).outerWidth(true);
				}
				lc.ft_c_left.add(lc.ft_rc).width(tw);       
				lc.ft_c_left.height($this.outerHeight(true));
					
				//set height of fixed_rc and fixed_c
				for (var i = 0; i < this.rows.length; i++) {
					var ch = $(this.rows[i]).outerHeight();
					var fch = $(lc.ft_c_left[0].rows[i]).outerHeight(true);
					
					ch = (ch>fch)?ch:fch;
					
					if (i < lc.ft_rc[0].rows.length) {
						$(lc.ft_r[0].rows[i])
							.add(lc.ft_rc[0].rows[i])								
							.height(ch);
					}
					
					$(lc.ft_c_left[0].rows[i])
						.add(this.rows[i])
						.height(ch);
				}
				
				lc.ft_c_left			
					.parent()
					.css({height: lc.ft_container.height() - getScrollBarHeight()})
					.width(lc.ft_rc.outerWidth(true) + 1);
			}
			
			if (cfg.rightFixedCols > 0) {
		        //clone the thead again to construct the 
		        theadTrClone = theadTr.clone();
			    
                //calculate the actual column's count (support for colspan)
                var r1c1ColSpan = 0;    
                for (var i = this.rows[0].cells.length-1; i > this.rows[0].cells.length-1-cfg.rightFixedCols; i--) {
                    r1c1ColSpan += this.rows[0].cells[i].colSpan;
                }
                
                //prepare rows/cols for fixed row col section
                var tdct = 0;
                $($('tr', theadTrClone).first().find('th').get().reverse()).filter( function () {
                    tdct += this.colSpan;
                    return tdct > r1c1ColSpan;
                }).remove();
                
                //add fixed row col section
                lc.ft_rel_container
                    .append($(cfg.tableTmpl(), {'class': 'ft_rc_right ' + cfg.tableClasses, 'style': 'right: ' + getScrollBarWidth() + 'px'})
                    .append(theadTrClone));
                
                //an instance of fixed row column
                lc.ft_rc = $('.ft_rc_right', lc.ft_rel_container);
                
                //now clone the fixed row column and append tbody for the remaining rows
                lc.ft_c_right = lc.ft_rc.clone();
                lc.ft_c_right[0].className = 'ft_c ' + cfg.tableClasses;
                // Blank out the style so it loses the 'right'
                lc.ft_c_right[0].style.right = '';
                
                //append tbody
                lc.ft_c_right.append('<tbody />');
                
                //append row by row while just keeping the frozen cols
                var ftc_tbody = lc.ft_c_right.find('tbody'); 
                $.each ($this.find('tbody > tr'), function (idx, el) {
                    var tr = $(el).clone();
                    
                    tdct = 0;
                    $(tr.find('td').get().reverse()).filter(function (){
                        tdct += this.colSpan;
                        return tdct > r1c1ColSpan;
                    }).remove();
                    
                    ftc_tbody.append(tr);
                });
                
                lc.ft_rc.before(lc.ft_c_right);
                lc.ft_c_right.wrap($('<div />', {'class': 'ft_cwrapper_right', 'style': 'right: ' + (getScrollBarWidth()-1) + 'px'}));

                var tw = 0;
                for (var i = this.rows[0].cells.length-1; i > this.rows[0].cells.length-1-cfg.rightFixedCols; i--) {
                    tw += $(this.rows[0].cells[i]).outerWidth(true);
                }
                lc.ft_c_right.add(lc.ft_rc).width(tw);       
                lc.ft_c_right.height($this.outerHeight(true));
                    
                //set height of fixed_rc and fixed_c
                for (var i = 0; i < this.rows.length; i++) {
                    var ch = $(this.rows[i]).outerHeight();
                    var fch = $(lc.ft_c_right[0].rows[i]).outerHeight(true);
                    
                    ch = (ch>fch)?ch:fch;
                    
                    if (i < lc.ft_rc[0].rows.length) {
                        $(lc.ft_r[0].rows[i])
                            .add(lc.ft_rc[0].rows[i])                               
                            .height(ch);
                    }
                    
                    $(lc.ft_c_right[0].rows[i])
                        .add(this.rows[i])
                        .height(ch);
                }
                
                lc.ft_c_right         
                    .parent()
                    .css({height: lc.ft_container.height() - getScrollBarHeight()})
                    .width(lc.ft_rc.outerWidth(true) + 1);
            }

			lc.ft_r
				.parent()
				.css({width: lc.ft_wrapper.width()- 13});
			
			//events (scroll and resize)
			lc.ft_wrapper.scroll(function () {
				if (cfg.leftFixedCols > 0) {
					lc.ft_c_left.css('top', ($(this).scrollTop()*-1));
				}
				if (cfg.rightFixedCols > 0) {
                    lc.ft_c_right.css('top', ($(this).scrollTop()*-1));
                }
				lc.ft_r.css('left', ($(this).scrollLeft()*-1));
			});
			
			if (cfg.leftFixedCols > 0 && cfg.rightFixedCols > 0) {
			    fixFrozenColumnScrolling(lc.ft_c_left, lc.ft_c_right, lc.ft_wrapper);
			} else if (cfg.leftFixedCols > 0) {
			    fixFrozenColumnScrolling(lc.ft_c_left, null, lc.ft_wrapper);
			} else if (cfg.rightFixedCols > 0) {
			    fixFrozenColumnScrolling(null, lc.ft_c_right, lc.ft_wrapper);
			}
			
			/*$(window).on('resize', function () {
				lc.ft_r
				.parent()
				.css({width: lc.ft_rel_container.width()- 17});			
			});*/
			
			if (cfg.sort && sorttable && cfg.leftFixedCols == 0 && cfg.rightFixedCols == 0) {
				
				$('table', lc.ft_container).addClass('sorttable');
				
				sorttable.makeSortable(this);
				
				var $sortableTh = $('.fx_sort_bg', lc.ft_rel_container);
				
				$sortableTh.click (function () {
					var $this = $(this);
					var isAscSort = $this.hasClass('fx_sort_asc'); 
					
					$sortableTh.removeClass('fx_sort_asc fx_sort_desc');
					
					if (isAscSort) { 
						$this.addClass('fx_sort_desc').removeClass('fx_sort_asc'); 
					} else { 
						$this.addClass('fx_sort_asc').removeClass('fx_sort_desc'); 
					}
					
					var idx = $(this).index();
					
					sorttable.innerSortFunction.apply(lc.ft_wrapper.find('th').get(idx), []);
				});
			}

		});
		
		function fixFrozenColumnScrolling(selectorOne, selectorTwo, scrollElement) {
		    if (selectorOne != null) {
		        $(selectorOne).bind('mousewheel DOMMouseScroll', function(event) {
		            event.preventDefault();
		            var scrollTo;
                    if (event.originalEvent.detail) {
                        scrollTo = event.originalEvent.detail*15;
                    } else {
                        scrollTo = (event.originalEvent.wheelDeltaY/40)*-15;
                    }
                    
                    scrollElement.stop().animate({
                        scrollTop: scrollElement.scrollTop() + scrollTo,
                    }, 150);
		        });
		    }
		    if (selectorTwo != null) {
		        $(selectorTwo).bind('mousewheel DOMMouseScroll wheel onmousewheel', function(event) {
		            event.preventDefault();
		            var scrollTo;
		            if (event.originalEvent.detail) {
		                scrollTo = event.originalEvent.detail*15;
		            } else {
		                scrollTo = (event.originalEvent.wheelDeltaY/40)*-15;
		            }
		            
		            scrollElement.stop().animate({
                        scrollTop: scrollElement.scrollTop() + scrollTo,
                    }, 150);
                });
		    }
		}
		function getScrollBarWidth() {
		    var $outer = $('<div>').css({visibility: 'hidden', width: 100, overflow: 'scroll'}).appendTo('body'),
		        widthWithScroll = $('<div>').css({width: '100%'}).appendTo($outer).outerWidth();
		    $outer.remove();
		    return 100 - widthWithScroll;
		};
		function getScrollBarHeight() {
            var $outer = $('<div>').css({visibility: 'hidden', height: 100, overflow: 'scroll'}).appendTo('body'),
                heightWithScroll = $('<div>').css({height: '100%'}).appendTo($outer).outerHeight();
            $outer.remove();
            return 100 - heightWithScroll;
        };
	};	

})(jQuery);

