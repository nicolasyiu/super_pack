;
(function ($) {
    $.fn.extend({
        "miInputDialog": function (action, defaultValue) {
            var _this = this;
            var _input = _this.find(".body input");
            var _textarea = _this.find(".body textarea");
            var _dialog = _this.find(".dialog ");

            var show = function () {
                _this.show();
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
                    _this.hide();
                });
            };

            if (action == undefined || action == 'show') {
                if (defaultValue) {
                    _input.val(defaultValue);
                    _textarea.val(defaultValue);
                }
                show.call(this);
            } else if (action == 'hide') {
                hide.call(this);
            }
            //绑定事件
            if (_this.data('bind') != undefined) {
                return;
            }
            _this.find(".footer button.confirm").click(function () {
                var value = _input.val() || _textarea.val();

                if (value) {
                    var data = value;
                    if (_input.length > 0 && _textarea.length > 0) {
                        data = {input: _input.val(), textarea: _textarea.val()}
                    }
                    _this.trigger('confirmed', data, this);
                    hide.call(this);
                } else {
                    $.miToast('内容不能为空');
                }
            });
            _this.find(".footer button.cancel").click(function () {
                hide.call(this);
                _this.trigger('canceled', _input.val() || _textarea.val(), this);
            });
            _this.data('bind', 'mi');
        }
    });
})(jQuery);