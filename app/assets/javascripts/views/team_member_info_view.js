var TeamMemberInfoView = (function () {
    var _this;

    var $root;

    var $headerOptionMenu;          //顶部更多按钮

    var $editTeamMemberNameLi;      //编辑群名片按钮
    var $editTeamMemberNameDialog;  //编辑群名片对话框
    var $memberSpaceBtn;            //查看群空间按钮
    var $transferItBtn;             //打赏他积分
    var $scoreTransferDialog;       //积分转让对话框
    var $transferNowBtn;            //立即转让积分

    var $removeFromTeamBtn;         //移除群按钮

    function TeamMemberInfoView($root_element) {
        _this = this;
        $root = $root_element;
    }

    TeamMemberInfoView.prototype = new BaseView();


    TeamMemberInfoView.prototype.onCreate = function () {
        $headerOptionMenu = $root.find(".header .right:has('.option-menu')");

        $editTeamMemberNameLi = $root.find("li.edit-team-member-name");
        $editTeamMemberNameDialog = $root.find("#edit-team-member-name-dialog");
        $memberSpaceBtn = $root.find("button.btn-member-space");
        $transferItBtn = $root.find("#btn-score-transfer");
        $scoreTransferDialog = $root.find("#score-transfer-dialog");
        $transferNowBtn = $root.find("#btn-transfer-score-now");

        $removeFromTeamBtn = $root.find("button.btn-remove-from-team");
    };

    TeamMemberInfoView.prototype.onBindEvent = function () {
        $headerOptionMenu.unbind().click(function () {
            $("#remove-member-option-menu").miOptionMenu();
        });
        $removeFromTeamBtn.unbind().click(function () {
            _this.actionRemoveMember($(this).data("vd-user-info"));
        });
        $editTeamMemberNameLi.unbind().click(function () {
            var $this = $(this);
            _this.actionEditMemberName($this.data('vd-team'), $this.data('vd-team-member'));
        });
        $editTeamMemberNameDialog.bind('confirmed', function (event, name) {
            var $this = $(this);
            _this.actionUpdateMemberName($this.data('vd-team'), $this.data('vd-team-member'), name);
        });
        $memberSpaceBtn.unbind('click').click(function () {
            var $this = $(this);
            window.location.href = "/mobile/vd_teams/{0}/members/{1}/space".format($this.data('vd-team'), $this.data('vd-team-member'));
        });
        $transferItBtn.unbind('click').click(function () {
            $scoreTransferDialog.miRedBag();
        });
        $transferNowBtn.unbind('click').click(function () {
            var $select = $scoreTransferDialog.find("select.select");
            _this.actionTransferScore($transferItBtn.data('me'), $transferItBtn.data('user'), $select.val());
        });
    };

    /**
     * 移除团队成员
     * @param vd_user_info_id
     */
    TeamMemberInfoView.prototype.actionRemoveMember = function (vd_user_info_id) {
        var confirmMsg = {
            title: '温馨提示！',
            body: '确认要移除成员吗？不可恢复！！！'
        };
        $.miConfirm(confirmMsg, function () {
            $.miLoading();
            var formData = $("#app_form").serialize() + "&vd_user_info[supervisor_id]=";
            $.ajax({
                url: "/mobile/vd_user_infos/" + vd_user_info_id,
                type: "PUT",
                data: formData,
                success: function onsuccess(data, status) {
                    $.miLoading('hide');
                    $.miToast("移除成功", function () {
                        window.location.reload();
                    });

                },
                error: function onerror(data, status) {
                    $.miLoading('hide');
                    $.miError(data);
                }
            });
        });
    };

    /**
     * 编辑群名片
     * @param vd_team_id
     * @param team_member_id
     */
    TeamMemberInfoView.prototype.actionEditMemberName = function (vd_team_id, team_member_id) {
        $editTeamMemberNameDialog.data('vd-team', vd_team_id);
        $editTeamMemberNameDialog.data('vd-team-member', team_member_id);
        $editTeamMemberNameDialog.find("input").val($editTeamMemberNameLi.find("span.name").text().trim());
        $editTeamMemberNameDialog.miInputDialog();
    };

    /**
     * 修改群名片
     * @param vd_team_id
     * @param team_member_id
     * @param member_name
     */
    TeamMemberInfoView.prototype.actionUpdateMemberName = function (vd_team_id, team_member_id, member_name) {
        $.miLoading();
        var formData = $("#app_form").serialize() + "&vd_team_member[name]=" + member_name;
        $.ajax({
            url: "/mobile/vd_teams/" + vd_team_id + "/members/" + team_member_id,
            type: "PUT",
            data: formData,
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function onsuccess(data, status) {
                $.miLoading('hide');
                $editTeamMemberNameDialog.miInputDialog('hide');
                $("li.edit-team-member-name span.name").text(name);
                $.miToast("修改成功");
            },
            error: function onerror(data, status) {
                $.miLoading('hide');
                $.miError(data);
            }
        });
    };


    /**
     * 转让积分
     * @param from
     * @param to
     * @param score
     */
    TeamMemberInfoView.prototype.actionTransferScore = function (from, to, score) {
        $scoreTransferDialog.miRedBag('hide');//隐藏红包

        var $appForm = $("#app_form");
        var authenticity_token = $appForm.find("input[name=authenticity_token]").val();
        $.miLoading('show');
        $.ajax({
            url: '/mobile/score_transfer',
            type: 'PUT',
            data: {
                from_user: from,
                to_user: to,
                score: score,
                utf8: "✓",
                authenticity_token: authenticity_token
            },
            success: function (data) {
                $.miLoading('hide');
                console.log(data);
                $.miToast('转让成功');
                $root.miModalView('hide', true);
            },
            error: function (data) {
                $.miLoading('hide');
                var obj = data.responseJSON.msg;
                if (obj.hasOwnProperty('name')) {
                    $.miToast(obj.name);
                } else if (typeof (obj) == 'string') {
                    $.miToast(obj);
                }
                console.log(obj);
            }
        });
    };

    return TeamMemberInfoView;
})();