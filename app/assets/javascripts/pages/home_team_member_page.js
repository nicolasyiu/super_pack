var HomeTeamMemberPage = (function () {
    var _this;

    var $team;

    var $headerRightSearchBtn;//顶部的搜索按钮

    var $searchTeamMemberDialog; //搜索成员的输入框


    function HomeTeamMemberPage() {
        _this = this;
    }

    HomeTeamMemberPage.prototype = new AppPage();

    HomeTeamMemberPage.prototype.team_id = '';//team id
    HomeTeamMemberPage.prototype.team_user_id = '';//团队所有者id

    HomeTeamMemberPage.prototype.onCreate = function () {
        $team = $(".team-data");
        $headerRightSearchBtn = $(".right#search-team-member-btn");
        $searchTeamMemberDialog = $("#search-team-member-dialog");
    };

    HomeTeamMemberPage.prototype.onInitData = function () {
        _this.team_id = $team.data('id');
        _this.team_user_id = $team.data('user-id');
    };

    HomeTeamMemberPage.prototype.onBindEvent = function () {
        $headerRightSearchBtn.click(function () {
            $searchTeamMemberDialog.miInputDialog();
        });
        $searchTeamMemberDialog.bind('confirmed', function (event, data) {
            window.location.href = "/mobile/home/team?member_keyword=" + data;
        });
    };
    return HomeTeamMemberPage;
})();