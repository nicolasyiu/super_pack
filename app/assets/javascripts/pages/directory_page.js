var DirectoryPage = (function () {
    var _this;

    var $path;

    var $contentArea;       //文件内容区域

    var $saveModifyBtn;     //保存修改按钮

    function DirectoryPage() {
        _this = this;
    }

    DirectoryPage.prototype = new AppPage();

    DirectoryPage.prototype.file_root_path = ''; //文件路径
    DirectoryPage.prototype.file_extra_path = ''; //文件路径
    DirectoryPage.prototype.file_org_content = ''; //文件原来内容

    /**
     * 页面元素初始化
     */
    DirectoryPage.prototype.onCreate = function () {
        $contentArea = $("#file_content");
        $saveModifyBtn = $("#save_modify");
        $path = $("[data-extra_path][data-root_path]");
    };

    /**
     * 初始化数据
     */
    DirectoryPage.prototype.onInitData = function () {
        _this.file_root_path = $path.data('root_path');
        _this.file_extra_path = $path.data('extra_path');
        _this.file_org_content = $contentArea.val();
    };

    /**
     * 页面元素的事件绑定开始了
     */
    DirectoryPage.prototype.onBindEvent = function () {
        $contentArea.unbind().change(function () {
            console.log("change...");
            var $this = $(this);
            if ($this.val() != _this.file_org_content) {
                $saveModifyBtn.removeClass("disabled");
            } else {
                $saveModifyBtn.addClass("disabled");
            }
        });
        $saveModifyBtn.unbind().click(function () {
            $.miConfirm("确定要保存当前修改吗？", function (data) {
                console.log(data);
                _this.actionSaveModify();
            });
        });
    };

    /**
     * 页面获取焦点
     */
    DirectoryPage.prototype.onResume = function () {

    };

    /**
     * 保存文件内容
     */
    DirectoryPage.prototype.actionSaveModify = function () {
        $.miLoading('show');
        $.ajax({
            url: "/directories/1?root_path={0}&extra_path={1}".format(_this.file_root_path, _this.file_extra_path),
            method: 'put',
            data: {
                content: ($contentArea.val() || $contentArea.text()),
                utf8: "√",
                authenticity_token: _this.getAuthenticityToken()
            },
            success: function (data) {
                $.miLoading('hide');
                $.miToast("保存成功", function (data) {
                    window.location.reload();
                });
            }, error: function (data) {
                $.miLoading('hide');
                $.miToast("保存失败");
            }

        });
    };

    return DirectoryPage;
})();
