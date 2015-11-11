var SuperPacksPage = (function () {
    var _this;

    var $chooseProjectSelect;  //选择打包项目
    var $superPackItem;        //超级打包按钮

    function SuperPacksPage() {
        _this = this;
    }

    SuperPacksPage.prototype = new AppPage();

    SuperPacksPage.prototype.select_pack_project = '';//选中要打包的应用
    SuperPacksPage.prototype.select_pack_project_label = '';//选中要打包的应用
    SuperPacksPage.prototype.select_pack_flavor = '';//选中要打包的应用的flavor

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
            _this.select_pack_project = data.value;
            _this.select_pack_project_label = data.extra;
            _this.actionGetFlavors(data.value);
        });
    };

    /**
     * 页面获取焦点
     */
    SuperPacksPage.prototype.onResume = function () {

    };

    /**
     * 初始化flavor选择器
     * @param html
     */
    SuperPacksPage.prototype.actionInitFlavorSelect = function (html) {
        $("#choose-flavors-select").remove();
        $("body").append(html);
        var $select = $("#choose-flavors-select");
        $select.miSelect();
        $select.unbind().bind('confirmed', function (event, data) {
            _this.select_pack_flavor = data.value;
            $.miConfirm({
                title: '确定要启动打包吗?',
                body: "<span class='text text-warning'>启动后项目将被暂时锁定，直至打包结束！</span>{0}-{1}".format(_this.select_pack_project_label, _this.select_pack_flavor)
            }, function () {
                _this.actionCreateSuperPack();
            });

        });
    };

    /**
     * 创建超级打包任务
     */
    SuperPacksPage.prototype.actionCreateSuperPack = function () {
        $.miLoading('show');
        $.ajax({
            url: "/super_packs",
            method: 'post',
            data: {
                project: _this.select_pack_project,
                flavor: _this.select_pack_flavor,
                utf8: "√",
                authenticity_token: _this.getAuthenticityToken()
            },
            success: function (data) {
                $.miLoading('hide');
                $.miToast("启动打包成功", function () {
                    window.location.reload();
                });
            }, error: function (data) {
                $.miLoading('hide');
                $.miToast("启动失败：" + data.responseJSON.error);
            }

        });
    };

    /**
     * 获取项目的flavor
     */
    SuperPacksPage.prototype.actionGetFlavors = function (project_name) {
        $.miLoading('show');
        $.ajax({
            url: "/super_packs/flavors?project={0}".format(project_name),
            method: 'get',
            success: function (data) {
                $.miLoading('hide');
                _this.actionInitFlavorSelect(data);
            }, error: function (data) {
                $.miLoading('hide');
                $.miToast("获取flavor列表失败");
            }

        });
    };

    return SuperPacksPage;
})();
