var RepacksPage = (function () {
    var _this;

    var $newFileInput;     //上传文件的input

    function RepacksPage() {
        _this = this;
    }

    RepacksPage.prototype = new AppPage();

    /**
     * 页面元素初始化
     */
    RepacksPage.prototype.onCreate = function () {
        $newFileInput = $("#upload-file-input");
    };

    /**
     * 初始化数据
     */
    RepacksPage.prototype.onInitData = function () {
    };

    /**
     * 页面元素的事件绑定开始了
     */
    RepacksPage.prototype.onBindEvent = function () {
        $newFileInput.unbind().change(function (event) {
            console.log("change change change chagne");
            _this.actionFileUpload();
        });
    };

    /**
     * 页面获取焦点
     */
    RepacksPage.prototype.onResume = function () {

    };

    /**
     * 上传文件
     */
    RepacksPage.prototype.actionFileUpload = function () {
        var data = new FormData();
        data.append("file", $newFileInput[0].files[0]);
        data.append("authenticity_token", _this.getAuthenticityToken());
        data.append("utf8", "√");

        $.miLoading("show");
        $.ajax({
            url: '/repacks/upload',
            type: 'POST',
            processData: false,
            contentType: false,
            data: data,
            success: function (data) {
                $.miLoading("hide");
                $.miToast("上传成功", function () {
                    window.location = '/repacks/' + data.id
                });
            },
            error: function (data) {
                $.miLoading("hide");
                $.miToast("上传失败");
            }
        });
    };

    return RepacksPage;
})();
