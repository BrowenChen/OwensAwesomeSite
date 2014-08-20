
    /*****************************************************************/
    /*****************************************************************/

    function submitCommentForm()
    {
        blockForm('cascade_comment_form','block');
		jQuery("#cascade_comment_form [name='paged']").val(jQuery("#cascade_comments .cascade_pagination .cascade_current").html());
        jQuery.post(config.ajaxurl,jQuery('#cascade_comment_form').serialize(),submitCommentFormResponse,'json');
    }

    /*****************************************************************/

    function submitCommentFormResponse(response)
    {
		jQuery("#cancel_comment").css('display', 'none');
		jQuery("#cascade_comment_form [name='comment_parent_id']").val(0);
        blockForm('cascade_comment_form','unblock');
        jQuery('#comment-user-name,#comment-user-email,#comment-message,#comment-send').qtip('destroy');

        var tPosition=
        {
            'comment-send':{'my':'right center','at':'left center'},
            'comment-message':{'my':'right center','at':'left center'},
            'comment-user-name':{'my':'right center','at':'left center'},
            'comment-user-email':{'my':'right center','at':'left center'}
        };

        if(typeof(response.info)!='undefined')
        {	
            if(response.info.length)
            {	
                for(var key in response.info)
                {
                    var id=response.info[key].fieldId;
                    jQuery('#'+response.info[key].fieldId).qtip(
                    {
                            style:      { classes:(response.error==1 ? 'ui-tooltip-error' : 'ui-tooltip-success')},
                            content: 	{ text:response.info[key].message },
                            position: 	{ my:tPosition[id]['my'],at:tPosition[id]['at'] }
                    }).qtip('show');				
                }
				if(typeof(response.html)!='undefined')
				{
					jQuery("#cascade_comments").html(response.html);
					$(".cascade_pagination a").click(function(event){
						event.preventDefault();
						var url = $(this).attr("href");
						history.pushState("", "title", config.home_url + "/" + url.replace("#!/", "").replace(new RegExp(config.home_url + "/", 'g'), ""));
						$(window).trigger("popstate", 1);
					});
					if(typeof(response.change_url)!='undefined' && !history.pushState)
						window.location.href = response.change_url;
					var api =  jQuery('.cascade-window-content').jScrollPane({maintainPosition:true,autoReinitialise:false}).data('jsp');
					api.reinitialise();
					setTimeout(function(){
						jQuery('#comment-send').qtip('destroy');
					}, 5000);
				}
				if(response.error==0)
					jQuery('#cascade_comment_form')[0].reset();
            }
        }
    }

    /*****************************************************************/
    /*****************************************************************/