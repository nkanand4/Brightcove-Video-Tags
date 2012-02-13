var namespace=(function(d){"use strict";var e=/^([\$\_a-z][\$\_a-z\d]*\.?)+$/i;return function(a){var b=Array.prototype.slice.call(arguments);var c=[];while(b.length){a=genNS(b.shift());if(a)c.push(a)}if(c.length==0)return;if(arguments.length==1)return c[0];return c};function genNS(a){if(!a.match(e))return;a=a.split('.');var b=d;for(var i=0;i<a.length;i++){b[a[i]]=b[a[i]]||{};b=b[a[i]]}return b}}(this));
namespace('CN.site.code');
/**
 * Brightcove video api
 */
namespace('CN.brightcove.api');
CN.brightcove.api = (function($) {
	var requestURL = 'http://api.brightcove.com/services/library',
		currentPage=1,
		params={
			command: 'search_videos',
			page_size: '40',
			token: function() {
				return $('select').val();
			},
			page_number:function() {
				return currentPage;
			}
		},
		logger=CN.log || window.console,
		changePage = function (pnum) {
			currentPage = pnum;
		},
		composeServiceURL = function () {
			// encodeURIComponent of only what you need.
			// and leave the rest
			var param = [];
			for(var key in params) {
				if(params.hasOwnProperty(key)) {
					param.push(key+'='+(typeof params[key] === 'function' ? params[key].call():params[key]));
				}
			}
			return (
				requestURL + '?' + 
					param.join('&')
			);
		},
		requestBrightcove = function (handler) {
			$('#overlay').fadeIn();
			$.ajax({
				url: composeServiceURL(),
				cache: true,
				complete: function() {
					$('#overlay').fadeOut();
				},
				dataType: 'jsonp',
				global: true,
				success: function(data) {
					if(typeof handler === 'function') {
						handler.call(CN.brightcove.api, data);
					}else {
						logger.info('Handler function not found', data.toString());
					}
				}
			});
		};
	
	return {
		searchVideos: function(handler) {
			//if search criteria provided, use it
			//otherwise search all videos
			requestBrightcove(handler);
		},
		nextPage: function() {
			changePage(++currentPage);
		},
		prevPage: function() {
			changePage(--currentPage);
		},
		resetPage: function() {
			changePage(0);
		}
	};
})(jQuery);