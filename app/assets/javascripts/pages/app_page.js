var AppPage = (function () {
    var _this;

    function AppPage() {
        _this = this;
    }

    AppPage.prototype.start = function () {
        this.onCreate();
        this.onInitData();
        this.onBindEvent();
        this.onResume();
    };

    return AppPage;
})();
/**
 * 接口：dom的创建
 *
 */
AppPage.prototype.onCreate = function () {
};

/**
 * 接口：数据初始化
 *
 */
AppPage.prototype.onInitData = function () {
};

/**
 * 接口：dom的事件绑定
 */
AppPage.prototype.onBindEvent = function () {
};

/**
 * 接口：页面获取焦点
 */
AppPage.prototype.onResume = function () {
};