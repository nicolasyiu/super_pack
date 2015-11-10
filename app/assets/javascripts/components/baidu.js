var baidu = {
    onEvent: function (category, action, opt_label, opt_value) {
        if (typeof(_hmt) != 'undefined' && _hmt != undefined) {
            _hmt.push(['_trackEvent', category, action, opt_label, opt_value]);
        }
    }
};