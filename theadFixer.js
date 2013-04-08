﻿/*
 * theadFixer
 * 
 * https://github.com/Mystist/theadFixer
 *
 */
 
(function ($) {

	var methods = {

		init : function(options) {
			var defaults = {
				"bindResize" : true,
				"overflow_x" : "auto"
			};
			var settings = $.extend(defaults, options);
			var theadFixer = new TheadFixer();
			theadFixer.$this = this;
			theadFixer.initialize(settings);
			return theadFixer;
		}

	};
	
	function TheadFixer() {
		this.$this = null;
		this.resizeTimer = null;
		this.overflow_x = null;
		this.t1 = null;
		this.t2 = null;
		this.t3 = null;
	}
	
	TheadFixer.prototype = {
	
		constructor: TheadFixer,
		
		initialize: function(st) {
			this.overflow_x = st.overflow_x;
			this.built();
			if(st.bindResize) {
				this.bindResize();
			}
		},
		
		built: function() {
			this.setTdWidth();
			this.builtHtml();
			this.setWidth();
			this.syncScrollBar();
		},
		
		setTdWidth: function() {
		
			var tThis = this;
			
			tThis.$this.find("thead tr").children().each(function(i) {
				var tWidth = "";
				if($(this).attr("width")) {
					tWidth = $(this).attr("width");
					$(this).attr("thewidth", tWidth);
				} else {
					tWidth = $(this).width()+"px";
					$(this).attr("thewidth", "none").attr("width", tWidth);
				}
				tThis.$this.find("tbody tr:first td").eq(i).attr("width", tWidth);
			});
			
			
			this.t3 = tThis.$this.find("table").css("table-layout");
			tThis.$this.find("table").css("table-layout", "fixed");
		
		},
		
		builtHtml: function() {
		
			var tThis = this;
		
			this.t1 = tThis.$this.find("table").attr("style");
			this.t2 = tThis.$this.find("table").attr("class");
			
			tThis.$this.find("table").wrap('<div class="m_innerwrapper"></div>');
		
			tThis.$this.find("thead").unwrap().wrap('<table style="'+this.t1+' table-layout: fixed;" class="'+this.t2+'"></table>');
			tThis.$this.find("tbody").wrap('<table style="'+this.t1+' table-layout: fixed; border-top:none;" class="'+this.t2+'"></table>');
			
			tThis.$this.find("thead").parent().wrap('<div class="m_wrap" style="overflow:hidden;"></div>');
			
			var height = tThis.$this.children().height() - tThis.$this.find("table:first").outerHeight(true);
			tThis.$this.find("tbody").parent().wrap('<div class="m_wrapper" style="height:'+height+'px; overflow-y:auto; overflow-x:'+tThis.overflow_x+'">');
		
		},
		
		setWidth: function() {
		
			var tThis = this;
			
			var fixNumber = 0;
			if(tThis.$this.find(".m_wrapper").height()<tThis.$this.find("table:last").outerHeight(true)) {
				fixNumber = 17;
			}			
			tThis.$this.find("table").css("width", tThis.$this.find(".m_wrapper").width()-fixNumber+"px");
			
			var fixNumber2 = 0;
			if(tThis.$this.find(".m_wrapper").width()<tThis.$this.find("table:last").outerWidth(true)) {
				fixNumber2 = 17;
			}			
			tThis.$this.find(".m_wrap").css("width", tThis.$this.find(".m_wrapper").width()-fixNumber2+"px");
		
		},
		
		revertHtml: function() {
		
			var tThis = this;
		
			tThis.$this.find("tbody").parent().unwrap();
			tThis.$this.find("tbody").unwrap();
			tThis.$this.find("thead").parent().unwrap();
			tThis.$this.find("thead").unwrap();
			tThis.$this.find(".m_innerwrapper").wrapInner('<table style="'+this.t1+'" class="'+this.t2+'"></table>');
			tThis.$this.find("table").unwrap();
		
		},
		
		revertTdWidth: function() {
		
			var tThis = this;

			tThis.$this.find("thead tr").children().each(function(i) {
				if($(this).attr("thewidth")=="none") {
					$(this).removeAttr("thewidth").removeAttr("width");
				} else {
					$(this).attr("width", $(this).attr("thewidth")).removeAttr("thewidth");
				}
				tThis.$this.find("tbody tr:first td").eq(i).removeAttr("width");
			});
			
			tThis.$this.find("table").css("table-layout", this.t3);
		
		},
		
		syncScrollBar: function() {
		
			var tThis = this;
			
			tThis.$this.find(".m_wrapper").bind("scroll", function() {
				var first = tThis.$this.find(".m_wrap");
				var last = tThis.$this.find(".m_wrapper");
				if(first.scrollLeft()!=last.scrollLeft()) {
					first.scrollLeft(last.scrollLeft());
				}
			});
		
		},
		
		bindResize: function() {
		
			var tThis = this;
			
			$(window).unbind("resize").resize(function() {
				clearTimeout(tThis.resizeTimer);
				tThis.resizeTimer = setTimeout(function() {
					tThis.revert();
					tThis.built();
				}, 200);
			});
		
		},
		
		revert: function() {
			
			this.revertHtml();
			this.revertTdWidth();
			
		}
	
	};
	 
	$.fn.theadFixer = function(method) {
		if(methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error( 'No '+method+' method.' );
		}
	};

})(jQuery);