;
(function ($) {
    $.fn.extend({
        "miModalView": function (action, remove) {
            var _this = this;
            if (action == undefined || action == 'show') {
                _this.css("left", $(window).width());
                _this.show();
                _this.animate({left: 0}, 300);
            } else if (action == 'hide') {
                _this.animate({
                    left: $(window).width()
                }, 300, function () {
                    _this.css("left", 0).hide();
                    if (remove) {
                        _this.remove();
                    }
                });
            }
            //绑定事件
            if (_this.data('bind') != undefined) {
                return;
            }
            //返回按钮
            _this.find(".header .left.back").bind('click', function () {
                _this.animate({
                    left: $(window).width()
                }, 300, function () {
                    _this.css("left", 0).hide();
                    if (_this.data('remove')) {
                        _this.remove();
                    }
                });
            });
            _this.data('bind', 'mi');
        }
    });
})(jQuery);