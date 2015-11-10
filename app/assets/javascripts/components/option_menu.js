;
(function ($) {
    $.fn.extend({
        "miOptionMenu": function (action) {
            var _this = this;
            var _body = _this.find(".body");

            var hide = function () {
                _body.animate({
                    bottom: -$(window).height()
                }, 300, function () {
                    _body.css("bottom", 0);
                    _this.hide();
                });
            };

            var show = function () {
                _body.css("bottom", -$(window).height());
                _this.show();
                _body.animate({bottom: 0}, 300);
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
            _this.bind('click', function () {
                hide.call(this);
            });

            //取消按钮
            _this.find("button.cancel").bind('click', function () {
                hide.call(this);
            });
            _this.data('bind', 'mi');
        }
    });
})(jQuery);