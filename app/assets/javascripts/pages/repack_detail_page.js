var RepackDetailPage = (function () {
    var _this;


    var $repackBtn;                     //重新打包按钮
    var $reInitResBtn;                  //重新生成资源文件
    var $deleteSelfBtn;                 //删除此包的按钮

    function RepackDetailPage() {
        _this = this;
    }

    RepackDetailPage.prototype = new AppPage();

    /**
     * 页面元素初始化
     */
    RepackDetailPage.prototype.onCreate = function () {
        $repackBtn = $("#repack-btn");
        $reInitResBtn = $("#re-init-res");
        $deleteSelfBtn = $("#delete-self");
    };

    /**
     * 初始化数据
     */
    RepackDetailPage.prototype.onInitData = function () {
    };

    /**
     * 页面元素的事件绑定开始了
     */
    RepackDetailPage.prototype.onBindEvent = function () {
        $repackBtn.unbind().click(function () {
            var $this = $(this);
            $.miConfirm({title: "Are you sure?", body: "开始打包后将会锁定"}, function () {
               _this.actionRepack($this.data('id'));
            });
        });
        $reInitResBtn.unbind().click(function () {
            var $this = $(this);
            $.miConfirm({title: "Are you sure?", body: "重新生成资源文件将会覆盖之前的资源文件"}, function () {
                _this.actionReinitApk($this.data('path'));
            });
        });

        $deleteSelfBtn.unbind().click(function () {
            var $this = $(this);
            $.miConfirm({title: "Are you sure?", body: "这将删除这个apk对应的所有资源"}, function () {
                _this.actionDeleteSelf($this.data('path'));
            });
        });
    };

    /**
     * 页面获取焦点
     */
    RepackDetailPage.prototype.onResume = function () {

    };


    /**
     * 重新初始化资源文件
     * @param path
     */
    RepackDetailPage.prototype.actionReinitApk = function (path) {
        $.miLoading('show');
        $.ajax({
            url: "/directories/1?path={0}&utf8=√&authenticity_token={1}&force=√".format(path,
                _this.getAuthenticityToken()
            ),
            method: 'delete',
            success: function (data) {
                $.miLoading('hide');
                $.miToast("删除成功", function () {
                    window.location.reload();
                });

            }, error: function (data) {
                $.miLoading('hide');
                console.log(data);
                $.miToast("删除失败:{0}".format(data.responseJSON.error));
            }

        });
    };
    /**
     * 删除自己
     * @param path
     */
    RepackDetailPage.prototype.actionDeleteSelf = function (path) {
        $.miLoading('show');
        $.ajax({
            url: "/directories/1?path={0}&utf8=√&authenticity_token={1}&force=√".format(path,
                _this.getAuthenticityToken()
            ),
            method: 'delete',
            success: function (data) {
                $.miLoading('hide');
                $.miToast("删除成功", function () {
                    window.location = '/repacks';
                });

            }, error: function (data) {
                $.miLoading('hide');
                console.log(data);
                $.miToast("删除失败:{0}".format(data.responseJSON.error));
            }

        });
    };

    /**
     * 开始打包
     */
    RepackDetailPage.prototype.actionRepack = function (id) {
        var data = new FormData();
        data.append("id", id);
        data.append("authenticity_token", _this.getAuthenticityToken());
        data.append("utf8", "√");

        $.miLoading("show");
        $.ajax({
            url: '/repacks',
            type: 'POST',
            processData: false,
            contentType: false,
            data: data,
            success: function (data) {
                $.miLoading("hide");
                $.miToast("启动成功", function () {
                    window.location.reload();
                });
            },
            error: function (data) {
                $.miLoading("hide");
                $.miToast("启动失败");
            }
        });
    };

    return RepackDetailPage;
})();
