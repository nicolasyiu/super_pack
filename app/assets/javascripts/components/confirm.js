;
(function ($) {
    $.extend({
        miConfirm: function (msg, callback) {
            var $confirm = $(".mi-confirm");
            var _dialog = $confirm.find(".dialog ");
            var show = function () {
                $confirm.show();
                var width = _dialog.width();
                var height = _dialog.height();
                _dialog.css("width", width / 10);
                _dialog.css("height", height / 10);
                _dialog.css("min-height", height / 10);

                _dialog.children().css('opacity', '0');
                _dialog.show().animate({width: width, height: height, 'min-height': height}, 200, function () {
                    _dialog.children().css('opacity', '1');
                });
            };

            var hide = function () {
                _dialog.fadeOut(200, function () {
                    $confirm.hide();
                });
            };

            if (typeof(msg) == 'string') {
                $confirm.find(".dialog .title").html(msg);
            } else {
                $confirm.find(".dialog .title").html(msg['title']);
                $confirm.find(".dialog .body").html(msg['body']);
            }
            show.call(this);
            $confirm.find(".footer button.confirm").unbind('click').click(function () {
                hide.call(this);
                callback.call(this, {action: 'confirm'});
            });
            $confirm.find(".footer button.cancel").unbind('click').click(function () {
                hide.call(this);
            });
        }
    });
})(jQuery);