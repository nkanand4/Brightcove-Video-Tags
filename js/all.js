jQuery(document).ready(function($) {
	var diff = 100;
	var template = '<li><span>@@title@@:</span>&nbsp;&nbsp;<span class="red">@@tags@@</span></li>';
	
	function fetchData() {
		$(window).unbind('scroll');
		CN.brightcove.api.searchVideos(function(data) {
			$(window).scroll(lazyLoad);
			$.each(data.items, function() {
				var str = template;
				str = template.replace(/@@title@@/, this.name);
				str = str.replace(/@@tags@@/, this.tags ? this.tags.join(', ') : '--No tag--');
				$('#video-info').append(str);
			});
		});
		
	}
	
	function lazyLoad() {
		var newDiff = $(document).height() - ($(window).height()+$(window).scrollTop());
		if(diff > newDiff) {
			diff = newDiff;
			if(diff < 50) {
				CN.brightcove.api.nextPage();
				fetchData();
			}
		}
	}
	
	function reset() {
		$('#video-info').empty();
		CN.brightcove.api.resetPage();
		diff = 100;
	}
	
	$('select').change(function() {
		if(this.value) {
			reset();
			CN.site.code = this.value;
			fetchData();
		} else {
			alert('Token not provided for the selected site. Try another one.');
		}
	});
	
	$(window).scroll(lazyLoad);
});

jQuery(function($) {
	var allSites = '';
	for(name in sites) {
		if(sites.hasOwnProperty(name)) {
			allSites += '<option value="'+sites[name]+'">'+name+'</option>';
		}
	}
	if(allSites) {
		$(allSites).appendTo($('select'));
	}
});