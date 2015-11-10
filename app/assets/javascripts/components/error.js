;
(function ($) {
    $.extend({
        miError: function (data) {
            if (data.status == 0 || !navigator.onLine) {
                $.miToast("网络断开，请稍后再试");
                return;
            }
            $.miToast(data.status + ":" + data.statusText);
        }
    });
})(jQuery);