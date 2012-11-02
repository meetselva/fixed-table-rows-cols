/*
A jQuery plugin to convert a well formatted table into a table with fixed
rows and columns.

Copyright (C) (2011-2012) Selvakumar Arumugam

This program is free software: you  can redistribute it and/or modify it
under the  terms of the GNU  General Public License as  published by the
Free Software Foundation,  either version 3 of the License,  or (at your
option) any later version.

This  program  is distributed  in  the  hope  that  it will  be  useful,
but  WITHOUT  ANY  WARRANTY;  without   even  the  implied  warranty  of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General
Public License for more details.

You should have received a copy  of the GNU General Public License along
with this program. If not, see <http://www.gnu.org/licenses/>.
*/
(function ($) {
	
	$.fn.fxdHdrCol = function (o) {
		var cfg = {
			height: 0,
			width: 0,
			tableWidth: 0,
			fixedCols: 0,
			tableTmpl: function () {
				return '<table />';							
			}
		};
		$.extend(cfg, o);
		
		var lc = {
			ft_container: null,
			ft_rel_container: null,
			ft_wrapper: null,
			ft_rc: null,
			ft_r: null,
			ft_c: null
		};
		
		this.addClass('ui-widget-header');
		this.find('tbody tr').addClass('ui-widget-content');
							
		//add base container
		this.wrap('<div class="ft_container" />');
		lc.ft_container = this.parent();
		
		//add relative container
		this.wrap('<div class="ft_rel_container" />');
		lc.ft_rel_container = this.parent();
		
		//set width and height for rel container
		lc.ft_rel_container.css({width: cfg.width, height: cfg.height});
		
		//add wrapper to base table which will have the scrollbars
		this.wrap('<div class="ft_scroller" />');
		lc.ft_wrapper = this.parent();
		
		var theadTr = $('thead', this);				
		
		//clone the thead->tr 
		var theadTrClone = theadTr.clone();
		
		//construct fixed row (full row)
		lc.ft_rel_container
			.prepend($(cfg.tableTmpl(), {'class': 'ft_r ui-widget-header'})
			.append(theadTrClone));

		//an instance of fixed row
		lc.ft_r = $('.ft_r', lc.ft_rel_container);
		lc.ft_r.wrap($('<div />', {'class': 'ft_rwrapper'}));
		
		//clone the thead again to construct the 
		theadTrClone = theadTr.clone();

		//calculate the actual column's count (support for colspan)					
		var r1c1ColSpan = 0;		
		for (var i = 0; i < cfg.fixedCols; i++ ) {
			r1c1ColSpan += this[0].rows[0].cells[i].colSpan;			
		}					
		
		//prepare rows/cols for fixed row col section
		$.each($('tr', theadTrClone), function (idx, el) {			
			var tdct = 0;
			$(el).find('th').filter( function () {
				tdct += this.colSpan;
				return tdct > r1c1ColSpan;
			}).remove();
		});
		
		//add fixed row col section
		lc.ft_rel_container
			.prepend($(cfg.tableTmpl(), {'class': 'ft_rc ui-widget-header'})
			.append(theadTrClone));
		
		//an instance of fixed row column
		lc.ft_rc = $('.ft_rc', lc.ft_rel_container);
		
		//now clone the fixed row column and append tbody for the remaining rows
		lc.ft_c = lc.ft_rc.clone();
		lc.ft_c[0].className = 'ft_c';
		
		//append tbody
		lc.ft_c.append('<tbody />');
		
		//append row by row while just keeping the frozen cols
		var ftc_tbody = lc.ft_c.find('tbody'); 
		$.each (this.find('tbody > tr'), function (idx, el) {
			var tr = $(el).clone();
			
			tdct = 0;
			tr.find('td').filter(function (){
				tdct += this.colSpan;
				return tdct > r1c1ColSpan;
			}).remove();
			
			ftc_tbody.append(tr);
		});
		
		lc.ft_rc.after(lc.ft_c);
		lc.ft_c.wrap($('<div />', {'class': 'ft_cwrapper'}));
				
		/*set width/height of generated tables*/
		var tw = 0;
		this.add(lc.ft_r).width(cfg.tableWidth);
		
		for (var i = 0; i < cfg.fixedCols; i++) {
			tw += $(this[0].rows[0].cells[i]).outerWidth(true);
		}
		
		lc.ft_c.add(lc.ft_rc).width(tw);
		
		/*for (var i = 0; i < this[0].rows[0].cells.length; i++) {
			var cw = $(this[0].rows[0].cells[i]).width();
			var fcw = $(lc.ft_r[0].rows[0].cells[i]).width();
			
			cw = (cw>fcw)?cw:fcw;

			if (i < cfg.fixedCols) {
				$(lc.ft_c[0].rows[0].cells[i])
					.add(lc.ft_rc[0].rows[0].cells[i])
					.width(cw);
				
				tw += $(lc.ft_c[0].rows[0].cells[i]).outerWidth(true);
			}

			$(lc.ft_r[0].rows[0].cells[i])
				.add(this[0].rows[0].cells[i])
				.width(cw);					
		}*/

		
		lc.ft_c.height(this.height(true));

		//set height of fixed_rc and fixed_c
		for (var i = 0; i < this[0].rows.length; i++) {
			var ch = $(this[0].rows[i]).height();
			var fch = $(lc.ft_c[0].rows[i]).height();
			
			ch = (ch>fch)?ch:fch;
			
			if (i < lc.ft_rc[0].rows.length) {
				$(lc.ft_r[0].rows[i])
					.add(lc.ft_rc[0].rows[i])								
					.height(ch);
			}
			
			$(lc.ft_c[0].rows[i])
				.add(this[0].rows[i])
				.height(ch);
		}		
		
		lc.ft_c
			.parent()
			.css({height: cfg.height-17, width: tw})
			.width(lc.ft_rc.outerWidth());
		
		lc.ft_r
			.parent()
			.css({width: cfg.width-17});
		
		//events (scroll and resize)
		lc.ft_wrapper.scroll(function () {						
			lc.ft_c.css('top', ($(this).scrollTop()*-1));
			lc.ft_r.css('left', ($(this).scrollLeft()*-1));        
		});
	};				
	
})(jQuery);