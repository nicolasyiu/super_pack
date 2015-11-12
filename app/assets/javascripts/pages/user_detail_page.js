/**
 * Created by saxer on 11/12/15.
 */
var UserDetailPage = (function () {
    var _this;
    var $logoutBtn;

    function UserDetailPage() {
        _this = this;
    }

    UserDetailPage.prototype = new AppPage();

    UserDetailPage.prototype.onCreate = function () {
        $logoutBtn = $("#logout");
    };

    UserDetailPage.prototype.onBindEvent = function () {
        $logoutBtn.unbind().click(function () {
            $.miConfirm("确定要退出吗？", function () {
                window.location.href = '/logout';
            });
        });
    };

    return UserDetailPage;
})();