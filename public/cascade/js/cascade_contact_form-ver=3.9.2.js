
    /*****************************************************************/
    /*****************************************************************/

    function submitContactForm()
    {
        blockForm('contact','block');
        jQuery.post(config.ajaxurl,jQuery('#contact').serialize(),submitContactFormResponse,'json');
    }

    /*****************************************************************/

    function submitContactFormResponse(response)
    {
        blockForm('contact','unblock');
        jQuery('#contact-user-name,#contact-user-email,#contact-message,#contact-send').qtip('destroy');

        var tPosition=
        {
            'contact-send':{'my':'right center','at':'left center'},
            'contact-message':{'my':'right center','at':'left center'},
            'contact-user-name':{'my':'right center','at':'left center'},
            'contact-user-email':{'my':'right center','at':'left center'}
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
            }
        }
    }

    /*****************************************************************/
    /*****************************************************************/