var RepackDetailPage = (function () {
    var _this;


    var $repackBtn;                     //重新打包按钮
    var $reInitResBtn;                  //重新生成资源文件

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
            $.miConfirm({title: "Are you sure?", body: "开始打包后将会锁定"}, function () {
                $.miToast("start...");
            });
        });
        $reInitResBtn.unbind().click(function () {
            var $this = $(this);
            $.miConfirm({title: "Are you sure?", body: "重新生成资源文件将会覆盖之前的资源文件"}, function () {
                _this.actionReinitApk($this.data('path'));
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
     * 开始打包
     */
    RepackDetailPage.prototype.actionRepack = function () {
        //var data = new FormData();
        //data.append("file", $newFileInput[0].files[0]);
        //data.append("authenticity_token", _this.getAuthenticityToken());
        //data.append("utf8", "√");
        //
        //$.miLoading("show");
        //$.ajax({
        //    url: '/repacks/upload',
        //    type: 'POST',
        //    processData: false,
        //    contentType: false,
        //    data: data,
        //    success: function (data) {
        //        $.miLoading("hide");
        //        $.miToast("上传成功", function () {
        //            window.location = '/repacks/' + data.id
        //        });
        //    },
        //    error: function (data) {
        //        $.miLoading("hide");
        //        $.miToast("上传失败");
        //    }
        //});
    };

    return RepackDetailPage;
})();
