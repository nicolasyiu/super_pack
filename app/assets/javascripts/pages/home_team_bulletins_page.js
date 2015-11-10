var VdTeamBulletinsPage = (function () {
    var _this;

    var $team;
    var $headerRightBtn;//顶部右边菜单按钮

    var $bulletInCreateDialog;//创建公告的对话框
    var $bulletInEditDialog;//编辑公告的对话框

    var $bulletItems;//公告列表

    function VdTeamBulletinsPage() {
        _this = this;
    }

    VdTeamBulletinsPage.prototype = new AppPage();

    VdTeamBulletinsPage.prototype.team_id = '';//team id
    VdTeamBulletinsPage.prototype.team_user_id = '';//团队所有者id

    /**
     * 页面元素初始化
     */
    VdTeamBulletinsPage.prototype.onCreate = function () {
        $team = $(".team-data");
        $headerRightBtn = $(".right#create-team-bulletin-btn");

        $bulletInCreateDialog = $("#create-team-bulletin-dialog");
        $bulletInEditDialog = $("#edit-team-bulletin-dialog");

        $bulletItems = $(".team-bulletins li[data-vd-team-bulletin]");
    };

    /**
     * 初始化数据
     */
    VdTeamBulletinsPage.prototype.onInitData = function () {
        _this.team_id = $team.data('id');
        _this.team_user_id = $team.data('user-id');
    };

    /**
     * 页面元素的事件绑定开始了
     */
    VdTeamBulletinsPage.prototype.onBindEvent = function () {
        $headerRightBtn.click(function () {
            $bulletInCreateDialog.miInputDialog();
        });
        $bulletInCreateDialog.bind('confirmed', function (event, data) {
            actionCreateTeamBulletIn(data.input, data.textarea);
        });
        $bulletItems.each(function (index, item) {
            var $item = $(item);
            var bulletInId = $item.data('vd-team-bulletin');
            var bulletInTitle = $item.find("#title").html();
            var bulletInBody = $item.find("#body").html();
            $item.find("#edit-btn").click(function () {
                $bulletInEditDialog.data('vd-team-bulletin', bulletInId);
                $bulletInEditDialog.find(".body input").val(bulletInTitle);
                $bulletInEditDialog.find(".body textarea").val(bulletInBody);
                $bulletInEditDialog.miInputDialog();
            });
            $item.find("#remove-btn").click(function () {
                $.miConfirm({title: '温馨提示', body: '确定要删除吗？'}, function () {
                    actionDeleteTeamBulletIn(bulletInId);
                });
            });
        });
        $bulletInEditDialog.bind('confirmed', function (event, data) {
            actionSaveTeamBulletIn($(this).data('vd-team-bulletin'), data.input, data.textarea);
        })
    };

    /**
     * 动作：创建团队公告
     * @param title
     * @param body
     */
    function actionCreateTeamBulletIn(title, body) {
        var $appForm = $("#app_form");
        var authenticity_token = $appForm.find("input[name=authenticity_token]").val();

        var formData = {
            title: title,
            body: body,
            user_id: _this.team_user_id
        };
        $.miLoading('show');
        $.ajax({
            url: "/mobile/vd_teams/" + _this.team_id + "/bulletins",
            type: 'POST',
            data: {vd_team_bulletin: formData, utf8: "✓", authenticity_token: authenticity_token},
            success: function (data) {
                console.log(data);
                $.miLoading('hide');
                $.miToast('创建成功', function () {
                    window.location.reload();
                });
            },
            error: function (data) {
                $.miLoading('hide');
                $.miError(data);
            }
        });
    };

    /**
     * 动作：编辑团队公告
     * @param id    integer     公告id
     * @param title string      公告标题
     * @param body  string      公告内容
     */
    function actionSaveTeamBulletIn(id, title, body) {
        var $appForm = $("#app_form");
        var authenticity_token = $appForm.find("input[name=authenticity_token]").val();

        var formData = {
            title: title,
            body: body,
            user_id: _this.team_user_id
        };
        $.miLoading('show');
        $.ajax({
            url: "/mobile/vd_teams/{0}/bulletins/{1}".format(_this.team_id, id),
            type: 'PUT',
            data: {vd_team_bulletin: formData, utf8: "✓", authenticity_token: authenticity_token},
            success: function (data) {
                console.log(data);
                $.miLoading('hide');
                $.miToast('更新成功', function () {
                    window.location.reload();
                });
            },
            error: function (data) {
                $.miLoading('hide');
                $.miError(data);
            }
        });
    };

    /**
     * 动作：删除团队公告
     * @param id    integer     公告id
     */
    function actionDeleteTeamBulletIn(id) {
        var $appForm = $("#app_form");
        var authenticity_token = $appForm.find("input[name=authenticity_token]").val();

        $.miLoading('show');
        $.ajax({
            url: "/mobile/vd_teams/{0}/bulletins/{1}".format(_this.team_id, id),
            type: 'DELETE',
            data: {utf8: "✓", authenticity_token: authenticity_token},
            success: function (data) {
                console.log(data);
                $.miLoading('hide');
                $.miToast('删除成功', function () {
                    window.location.reload();
                });
            },
            error: function (data) {
                $.miLoading('hide');
                $.miError(data);
            }
        });
    };

    return VdTeamBulletinsPage;
})();