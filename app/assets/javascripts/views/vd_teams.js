//团队成员列表点击事件
$(".team-members li[data-vd-team][data-vd-team-member]").unbind('click').bind('click', function () {
    var $this = $(this);
    var memberId = $this.data('vd-team-member');
    var teamId = $this.data('vd-team');
    $.miLoading();
    $.ajax({
        url: '/mobile/vd_teams/' + teamId + '/members/' + memberId,
        type: 'GET',
        success: function (data) {
            $("body").append(data);
            $.miLoading('hide');
            $("#team-member-info-view").miModalView();
            new TeamMemberInfoView($("#team-member-info-view")).start();
        },
        error: function (data) {
            $.miLoading('hide');
            $.miError(data);
        }
    });
});

//点击编辑店铺名称按钮
$(".team-name:has('.glyphicon-edit')").click(function () {
    var $this = $(this);
    var teamName = $this.text().trim();
    var teamId = $this.data('vd-team');

    var $dialog = $("#edit-team-name-dialog");
    $dialog.data('vd-team', teamId);
    $dialog.find("input").val(teamName);
    $dialog.miInputDialog();
});

$("#edit-team-name-dialog").bind("confirmed", function (event, teamName) {
    var $this = $(this);
    var teamId = $this.data('vd-team');
    var $appForm = $("#app_form");
    var authenticity_token = $appForm.find("input[name=authenticity_token]").val();
    var formData = {name: teamName};
    $.miLoading();
    $.ajax({
        url: "/mobile/vd_teams/" + teamId,
        type: "PUT",
        data: {vd_team: formData, utf8: "✓", authenticity_token: authenticity_token},
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("Accept", "application/json");
        },
        success: function onsuccess(data, status) {
            $.miLoading('hide');
            $.miToast(data.msg, function () {
                window.location.reload();
            });
        },
        error: function onerror(data, status) {
            $.miLoading('hide');
            $.miError(data);
        }
    });
});