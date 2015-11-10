var HomeIndexPage = (function () {
    var _this;

    var $redBag; //红包
    var $useRedBagNowBtn; //立即使用红包

    function HomeIndexPage() {
        _this = this;
    }

    HomeIndexPage.prototype = new AppPage();

    /**
     * 页面元素初始化
     */
    HomeIndexPage.prototype.onCreate = function () {
        $useRedBagNowBtn = $("#use-red-bag-now");
        $redBag = $(".mi-red-bag#red-bag");
    };

    /**
     * 初始化数据
     */
    HomeIndexPage.prototype.onInitData = function () {

    };

    /**
     * 页面元素的事件绑定开始了
     */
    HomeIndexPage.prototype.onBindEvent = function () {
        $useRedBagNowBtn.click(function () {
            _this.actionUserRedBagNow();
        });
        $redBag.bind('closed', function (event, data) {
            console.log('red bag close');
        });
    };

    /**
     * 页面获取焦点
     */
    HomeIndexPage.prototype.onResume = function () {
        if ($redBag[0] && !$.cookie("newer_gift_bag_notify")) {
            setTimeout(function () {
                $redBag.miRedBag();
                $.cookie("newer_gift_bag_notify", true);
            }, 1000);
        }
    };


    /**
     * 动作：
     * 立即使用红包
     */
    HomeIndexPage.prototype.actionUserRedBagNow = function () {
        console.log('use red bag now');
    };

    return HomeIndexPage;
})();
