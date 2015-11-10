var DirectoriesPage = (function () {
    var _this;

    var $path;

    var $itemTD;            //文件item表格
    var $itemActionBtn;     //文件操作按钮
    var $fileActionsMenu;   //文件操作对话框
    var $fileActionsMenuHeader;   //文件操作对话框
    var $actionRenameBtn;   //重命名按钮
    var $actionDeleteBtn;   //删除按钮
    var $renameDialog;      //重命名文件夹

    function DirectoriesPage() {
        _this = this;
    }

    DirectoriesPage.prototype = new AppPage();

    DirectoriesPage.prototype.dir_root_path = ''; //文件路径
    DirectoriesPage.prototype.dir_extra_path = ''; //文件路径

    /**
     * 页面元素初始化
     */
    DirectoriesPage.prototype.onCreate = function () {
        $itemTD = $("td[data-item_path][data-item_name]");
        $path = $("[data-extra_path][data-root_path]");
        $fileActionsMenu = $("#file-actions-menu");
        $itemActionBtn = $(".file-actions-btn");
        $fileActionsMenuHeader = $fileActionsMenu.find(".body>.header");
        $actionRenameBtn = $fileActionsMenu.find("button.rename");
        $actionDeleteBtn = $fileActionsMenu.find("button.delete");
        $renameDialog = $("#rename-dialog");
    };

    /**
     * 初始化数据
     */
    DirectoriesPage.prototype.onInitData = function () {
        _this.dir_root_path = $path.data('root_path');
        _this.dir_extra_path = $path.data('extra_path');
    };

    /**
     * 页面元素的事件绑定开始了
     */
    DirectoriesPage.prototype.onBindEvent = function () {
        $itemActionBtn.unbind().click(function (event) {
            var $this = $(this);
            $fileActionsMenuHeader.text($this.data('item_name'));
            $fileActionsMenu.data("item_name", $this.data("item_name"));
            $fileActionsMenu.data("item_path", $this.data("item_path"));
            $fileActionsMenu.miOptionMenu('show');
        });
        $actionRenameBtn.click(function () {
            $renameDialog.find(".dialog>.title").text("重命名{0}".format($fileActionsMenu.data("item_name")));
            $renameDialog.miInputDialog('show');
        });
        $actionDeleteBtn.click(function () {
            $.miConfirm("确定要删除{0}吗".format($fileActionsMenu.data("item_name")), function () {
                $.miToast("确认删除文件！！！");
            });
        });
        $renameDialog.bind('confirmed', function (data) {
            $.miToast(data.input);
        });
    };

    /**
     * 页面获取焦点
     */
    DirectoriesPage.prototype.onResume = function () {

    };

    ///**
    // * 保存文件内容
    // */
    //DirectoriesPage.prototype.actionSaveModify = function () {
    //    $.miLoading('show');
    //    $.ajax({
    //        url: "/directories/1?root_path={0}&extra_path={1}".format(_this.file_root_path, _this.file_extra_path),
    //        method: 'put',
    //        data: {content: $contentArea.val()},
    //        success: function (data) {
    //            $.miLoading('hide');
    //            $.miToast("保存成功", function (data) {
    //                window.location.reload();
    //            });
    //        }, error: function (data) {
    //            $.miLoading('hide');
    //            $.miToast("保存失败");
    //        }
    //
    //    });
    //};

    return DirectoriesPage;
})();
