var ScoreHistoriesPage = (function () {
    var _this;

    var $withdrawalTotal;           //可提现金额
    var $withdrawalHistory;         //已提现金额
    var $withdrawalBtn;             //提现按钮

    function ScoreHistoriesPage() {
        _this = this;
    }

    ScoreHistoriesPage.prototype = new AppPage();

    ScoreHistoriesPage.prototype.onCreate = function () {
        $withdrawalBtn = $("#withdrawal");
        $withdrawalTotal = $("#withdrawal-total");
        $withdrawalHistory = $("#withdrawal-histories");
    };

    ScoreHistoriesPage.prototype.onBindEvent = function () {
        $withdrawalBtn.unbind().click(function () {
            window.location.href = '/mobile/vd_score_to_cashes/new'
        });
        $withdrawalTotal.unbind().click(function () {
            window.location.href = '/mobile/vd_score_to_cashes/new'
        });
        $withdrawalHistory.unbind().click(function () {
            window.location.href = '/mobile/vd_score_to_cashes'
        });

    };

    return ScoreHistoriesPage;
})();