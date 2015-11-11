var SuperPacksPage = (function () {
    var _this;

    var $chooseProjectSelect;  //选择打包项目
    var $superPackItem;        //超级打包按钮

    function SuperPacksPage() {
        _this = this;
    }

    SuperPacksPage.prototype = new AppPage();

    /**
     * 页面元素初始化
     */
    SuperPacksPage.prototype.onCreate = function () {
        $superPackItem = $("#super-pack-item");
        $chooseProjectSelect = $("#choose-project-select");
    };

    /**
     * 初始化数据
     */
    SuperPacksPage.prototype.onInitData = function () {

    };

    /**
     * 页面元素的事件绑定开始了
     */
    SuperPacksPage.prototype.onBindEvent = function () {
        $superPackItem.unbind().click(function () {
            $chooseProjectSelect.miSelect('show', 'ad_market');
        });
        $chooseProjectSelect.bind('confirmed', function (event, data) {
            console.log(data);
            _this.actionGetFlavors(data.value);
        });
    };

    /**
     * 页面获取焦点
     */
    SuperPacksPage.prototype.onResume = function () {

    };

    /**
     * 获取项目的flavor
     */
    SuperPacksPage.prototype.actionGetFlavors = function (project_name) {
        $.miLoading('show');
        $("#choose-flavors-select").remove();
        $.ajax({
            url: "/super_packs/flavors?project={0}".format(project_name),
            method: 'get',
            success: function (data) {
                $.miLoading('hide');
                $("body").append(data);
                $("#choose-flavors-select").miSelect();
            }, error: function (data) {
                $.miLoading('hide');
                $.miToast("获取flavor列表失败");
            }

        });
    };

    return SuperPacksPage;
})();
