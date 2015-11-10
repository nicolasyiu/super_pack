;
(function ($) {
    $.fn.extend({
        "miSelect": function (action, selectValue) {
            var _this = this;
            var _select = _this.find(".select");
            if (action == undefined || action == 'show') {
                _this.show();
                _select.slideDown();
                if (selectValue != undefined) {
                    _this.find('ul li span.check').removeClass("glyphicon").removeClass("glyphicon-ok-circle");
                    _this.find("ul li[data-value=" + selectValue + "] span.check").addClass("glyphicon").addClass("glyphicon-ok-circle");
                }
            } else if (action == 'hide') {
                _select.slideUp(function () {
                    _this.hide();
                });
            }
            //绑定事件
            if (_this.data('bind') != undefined) {
                return;
            }

            _this.find("ul li").click(function () {
                var $this = $(this);
                $this.parent().find('li span.check').removeClass("glyphicon").removeClass("glyphicon-ok-circle");
                $this.find("span.check").addClass("glyphicon").addClass("glyphicon-ok-circle");
            });
            _this.find(".header button.confirm").click(function () {
                var $current = _this.find(".body ul li span.check.glyphicon-ok-circle").parent();
                _this.trigger('confirmed', {text: $current.text().trim(), value: $current.data('value'),extra: $current.data('extra')}, this);
                _select.slideUp(function () {
                    _this.hide();
                });
            });
            _this.find(".header button.cancel").click(function () {
                _select.slideUp(function () {
                    _this.hide();
                });
            });
            _this.data('bind', 'mi');
        }
    });
})(jQuery);