var ActivityNewerGiftBagPage = (function () {
    var _this;

    var $giftBag;

    var $buyNowBtn;     //立即购买按钮

    function ActivityNewerGiftBagPage() {
        _this = this;
    }

    ActivityNewerGiftBagPage.prototype = new AppPage();

    ActivityNewerGiftBagPage.prototype.enter_enable = false; //当前登录用户是否有资格参加活动

    /**
     * 页面元素初始化
     */
    ActivityNewerGiftBagPage.prototype.onCreate = function () {
        $giftBag = $(".activity-newer-gift-bag");
        $buyNowBtn = $("button.buy-now:not(.disabled)");
    };

    /**
     * 初始化数据
     */
    ActivityNewerGiftBagPage.prototype.onInitData = function () {
        _this.enter_enable = String($giftBag.data('enter-enable')) == 'true';
    };

    /**
     * 页面元素的事件绑定开始了
     */
    ActivityNewerGiftBagPage.prototype.onBindEvent = function () {
        $buyNowBtn.unbind().click(function () {
            var $this = $(this);
            var product = $this.data('product');
            var href = $this.data('click-href');
            baidu.onEvent('newer_gift_bag_buy_now', product, '0'); //百度统计
            window.location.href = href;
        });
    };

    /**
     * 页面获取焦点
     */
    ActivityNewerGiftBagPage.prototype.onResume = function () {
        baidu.onEvent('newer_gift_bag_page', 'view', '0'); //百度统计
        if (!_this.enter_enable) {
            $.miConfirm({
                title: '温馨提示',
                body: "<p class='text-orange'>您当前没有参加活动的资格</p>"
            });
            baidu.onEvent('newer_gift_bag_no_permission', 'activity', '0'); //百度统计
        }
    };

    return ActivityNewerGiftBagPage;
})();
