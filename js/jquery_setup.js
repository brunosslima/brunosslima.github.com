jQuery.ajaxSetup(
    (function(){
        var jsc = jQuery.now();
        return {
            jsonpCallback: function() {
                return jQuery.expando + ( jsc++ );
            }
        };
    })()
);
