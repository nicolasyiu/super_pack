var BaseView = (function () {
    var _this;

    function BaseView() {
        _this = this;
    }

    BaseView.prototype.start = function () {
        this.onCreate();
        this.onInitData();
        this.onBindEvent();
        this.onResume();
    };

    return BaseView;
})();
/**
 * 接口：dom的创建
 *
 */
BaseView.prototype.onCreate = function () {
};

/**
 * 接口：数据初始化
 *
 */
BaseView.prototype.onInitData = function () {
};

/**
 * 接口：dom的事件绑定
 */
BaseView.prototype.onBindEvent = function () {
};

/**
 * 接口：页面获取焦点
 */
BaseView.prototype.onResume = function () {
};