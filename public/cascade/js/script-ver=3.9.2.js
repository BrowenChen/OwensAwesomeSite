
    /*****************************************************************/

    function getRandom(min,max)
    {
        return((Math.floor(Math.random()*(max-min)))+min);
    }

    /*****************************************************************/

    function clearInput(object,action,defaulValue)
    {
        var object=jQuery(object);
        var value=jQuery.trim(object.val());

        if(action=='focus')
        {
            if(value==defaulValue) object.val('');
        }
        else if(action=='blur')
        {
            if(value=='') object.val(defaulValue);
        }
    }

    /*****************************************************************/

    function blockForm(formId,action)
    {
        if(action=='block')
            jQuery('#'+formId).find('.block').block({message:false,overlayCSS:{opacity:'0.3'}});
        else jQuery('#'+formId).find('.block').unblock();
    }

    /*****************************************************************/