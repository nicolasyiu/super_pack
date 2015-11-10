;
(function ($) {
    $.fn.extend({
        "miRedBag": function (action) {
            var _this = this;

            var _redbag = _this.find(".body");

            var show = function () {
                _this.show();
                _redbag.hide().fadeIn(500);
            };

            var hide = function () {
                _redbag.fadeOut(200, function () {
                    _this.hide();
                });
            };

            if (action == undefined || action == 'show') {
                show.call(this);
            } else if (action == 'hide') {
                hide.call(this);
            }
            //绑定事件
            if (_this.data('bind') != undefined) {
                return;
            }
            _this.find(".bag-close").click(function () {
                hide.call(this);
                _this.trigger('closed', 'close', this);
            });
            _this.data('bind', 'mi');
        }
    });
})(jQuery);