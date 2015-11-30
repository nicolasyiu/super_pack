var RepackDetailPage = (function () {
    var _this;


    var $repackBtn;                     //重新打包按钮

    function RepackDetailPage() {
        _this = this;
    }

    RepackDetailPage.prototype = new AppPage();

    /**
     * 页面元素初始化
     */
    RepackDetailPage.prototype.onCreate = function () {
        $repackBtn = $("#repack-btn");
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
            $.miConfirm("Are you sure?", function () {
                $.miToast("start...");
            });
        });
    };

    /**
     * 页面获取焦点
     */
    RepackDetailPage.prototype.onResume = function () {

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
