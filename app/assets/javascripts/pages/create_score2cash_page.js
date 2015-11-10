var CreateScore2CashPage = (function () {
    var _this;

    var $userBasicAlipay;           //支付宝按钮
    var $userBasicAlipayRelateUser; //支付宝账户姓名

    var $updateMeInfoDialog;        //更新个人信息的对话框
    var $updateMeInfoDialogTitle;   //更新个人信息的对话框
    var $updateMeInfoDialogInput;   //更新个人信息的对话框

    var $score2cashScoreNumInput;   //转出金额的输入框

    var $createScore2cashBtn;       //确认转出按钮

    function CreateScore2CashPage() {
        _this = this;
    }

    CreateScore2CashPage.prototype = new AppPage();

    CreateScore2CashPage.prototype.score_money_rate = 1; //1积分 = 1元

    CreateScore2CashPage.prototype.user_id = '';
    CreateScore2CashPage.prototype.bank = 'alipay';
    CreateScore2CashPage.prototype.bank_account_no = '';
    CreateScore2CashPage.prototype.bank_account_name = '';

    CreateScore2CashPage.prototype.onCreate = function () {
        $userBasicAlipay = $("li[data-user-alipay]");
        $userBasicAlipayRelateUser = $("li[data-user-alipay_relate_user]");

        $updateMeInfoDialog = $("#update-me-info-dialog");
        $updateMeInfoDialogTitle = $updateMeInfoDialog.find(".title");
        $updateMeInfoDialogInput = $updateMeInfoDialog.find(".body input");

        $score2cashScoreNumInput = $(".score2cash-score-num input");

        $createScore2cashBtn = $("#create-score2cash-btn");
    };


    CreateScore2CashPage.prototype.onInitData = function () {
        _this.user_id = $("[data-me-id]").data('me-id');
        _this.bank_account_no = $userBasicAlipay.data('user-alipay');
        _this.bank_account_name = $userBasicAlipayRelateUser.data('user-alipay_relate_user');
    };

    CreateScore2CashPage.prototype.onBindEvent = function () {

        $userBasicAlipay.unbind().click(function () {
            $updateMeInfoDialog.data('attr-name', 'alipay');
            $updateMeInfoDialogTitle.html("请输入支付宝账号");
            $updateMeInfoDialogInput.attr('placeholder', "请输入支付宝账号").val($(this).data('user-alipay'));
            $updateMeInfoDialog.miInputDialog();
        });

        $userBasicAlipayRelateUser.unbind().click(function () {
            $updateMeInfoDialog.data('attr-name', 'alipay_relate_user');
            $updateMeInfoDialogTitle.html("请输入支付宝真实姓名");
            $updateMeInfoDialogInput.attr('placeholder', "请输入支付宝真实姓名").val($(this).data('user-alipay_relate_user'));
            $updateMeInfoDialog.miInputDialog();
        });

        $updateMeInfoDialog.unbind('confirmed').bind('confirmed', function (event, data) {
            var $this = $(this);
            $this.miInputDialog('hide');
            _this.actionUpdateMeInfo(_this.user_id, $this.data('attr-name'), data);
        });

        $score2cashScoreNumInput.unbind().change(function (event) {
            var value = Math.decimal_point($(this).val(), 2);
            var money = Math.decimal_point(_this.score_money_rate * value, 2);
            if (value && value > 0) {
                if (!_this.actionCheckTransferValid()) {
                    return;
                }
                $createScore2cashBtn.html("确认转出{0}元".format(money)).removeClass('disabled');
            } else {
                $createScore2cashBtn.html("确认转出").removeClass('disabled').addClass('disabled');
            }
        });

        $createScore2cashBtn.unbind().click(function (event) {
            if (_this.actionCheckTransferValid() && _this.actionCheckBankInfo()) {
                var value = Math.decimal_point($score2cashScoreNumInput.val(), 2);
                var money = Math.decimal_point(_this.score_money_rate * value, 2);
                $.miConfirm("确定要兑换积分到支付宝账户{0}吗？".format(_this.bank_account_no), function () {
                    _this.actionCreateScore2Cash(money, value);
                });
            }
        });
    };


    CreateScore2CashPage.prototype.onResume = function () {
        _this.actionCheckBankInfo();
    };

    /**
     * 检查银行信息是否完整
     */
    CreateScore2CashPage.prototype.actionCheckBankInfo = function () {
        if (!_this.bank_account_no || _this.bank_account_no.length < 1) {
            $userBasicAlipay.click();
            return false;
        }
        if (!_this.bank_account_name || _this.bank_account_name.length < 1) {
            $userBasicAlipayRelateUser.click();
            return false;
        }
        return true;
    };

    /**
     * 验证转出积分是否合法
     * @returns {boolean}
     */
    CreateScore2CashPage.prototype.actionCheckTransferValid = function () {
        var inputScore = Math.decimal_point($score2cashScoreNumInput.val(), 2);
        var maxScore = Math.decimal_point($score2cashScoreNumInput.attr('max'), 2);
        if (inputScore > maxScore) {
            $.miToast("最多可转出{0}积分".format(maxScore));
            return false;
        }
        if (inputScore <= 0) {
            $.miToast("转出积分必须大于0");
            return false;
        }

        return true;
    };

    /**
     *  创建积分转换记录
     */
    CreateScore2CashPage.prototype.actionCreateScore2Cash = function (money, score) {
        var $appForm = $("#app_form");
        var authenticity_token = $appForm.find("input[name=authenticity_token]").val();

        $.miLoading('show');
        $.ajax({
            url: "/mobile/vd_score_to_cashes.json",
            type: 'POST',
            data: {
                score_to_cash: {
                    user_id: _this.user_id,
                    money: money,
                    score: score,
                    bank: _this.bank,
                    bank_account_name: _this.bank_account_name,
                    bank_account_no: _this.bank_account_no
                },
                utf8: "✓",
                authenticity_token: authenticity_token
            },
            success: function (data) {
                console.log(data);
                $.miLoading('hide');
                $.miToast('创建成功', function () {
                    window.location = '/mobile/vd_score_to_cashes/' + data.vd_score_to_cash.id;
                });
            },
            error: function (data) {
                console.log(data);
                $.miLoading('hide');
                if (data.responseJSON && data.responseJSON.hasOwnProperty('msg')) {
                    $.miToast(data.responseJSON.msg);
                } else {
                    alert(data.responseText + ":" + data.status);
                }
            }
        });
    };


    /**
     * action 更新个人信息
     * @param userId
     * @param attrName
     * @param data
     */
    CreateScore2CashPage.prototype.actionUpdateMeInfo = function (userId, attrName, data) {
        var putData = {'user': {}};
        putData.user[attrName] = data;
        $.miLoading();
        $.ajax({
            url: "/mobile/users/" + userId + ".json?user[" + attrName + "]=" + data,
            type: "PUT",
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            data: putData,
            success: function onsuccess(data, status) {
                $.miLoading('hide');
                $.miToast('修改成功', function () {
                    window.location.reload();
                });
            },
            error: function onerror(data, status) {
                $.miLoading('hide');
                $.miToast(data.status + ":" + data.statusText);
            }
        });
    };

    return CreateScore2CashPage;
})();