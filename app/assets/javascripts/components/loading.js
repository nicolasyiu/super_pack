;
(function ($) {
    $.extend({
        miLoading: function (action) {
            if (action == undefined || action == 'show') {
                $(".mi-loading").show();
            } else {
                $(".mi-loading").hide();
            }
        }
    });
})(jQuery);