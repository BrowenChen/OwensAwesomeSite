jQuery(document).ready(function($)
{
	
	var page = new Object();
	var i = 0;
	for(i; i<config.link.length; i++)
		page[config["link"][i]] = {tab:"cascade-portfolio-" + config["post_id"][i], active: parseInt(config["active"][i]), main:1};
	
	for(i=0; i<config.link_full_width.length; i++)
		page[config["link_full_width"][i]] = {tab:"cascade-portfolio-" + config["fw_post_id"][i], active: parseInt(config["fw_active"][i]), main:0, color: config["color"][i], full_width: true};
	
	$('.cascade').cascade(page, 1, parseInt(config.lastPage), 1);

	if(config.twitter_login!="" && config.twitts_number>0)
		$('#latest-tweets ul').bxSlider(
		{
			auto: true,
			mode:'vertical',
			nextText:null,
			prevText:null,
			displaySlideQty:1,
			pause:5000
		});
	  
	$('.filter-list li a').live('click',function(e) 
	{   
		var link = $(this); 
		var filter =link.attr('href');
		if(filter!='all-items')
			filter = '.'+filter;
		else
			filter = '';
		
		$('.filter-list li a').removeClass('selected');
		link.addClass('selected');
			
		$('.gallery-list').isotope({ 
			filter: filter,
			animationEngine : 'jquery'
			});
		e.preventDefault(); 
	});
	
});