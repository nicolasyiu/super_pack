;
(function ($) {
    $.extend({
        miToast: function (action,callback) {
            $(".mi-toast").html(action).show();
            setTimeout(function () {
                $(".mi-toast").hide();
                if(callback){
                    callback.call(this);
                }
            }, 2000);
        }
    });
})(jQuery);