var $blockMeInfo = $("#me-info");

//积分兑现
$blockMeInfo.find("#score2money").bind('click', function () {
    var $this = $(this);
    var userId = $("#me-info").data('user');
    var setting = $this.data('score2money') + '';
    var $switch = $this.find(".mi-switch");

    var confirmMsg = {
        title: '温馨提示',
        body: "确定要" + (setting == 'true' ? "关闭" : "开启") + "积分抵货款开关？"
    };
    $.miConfirm(confirmMsg, function () {
        $.miLoading();
        $.ajax({
            url: "/mobile/users/" + userId,
            type: "PUT",
            data: {user: {vd_user_info: {score2money: setting == 'true' ? 'false' : 'true'}}},
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function onsuccess(data, status) {
                $.miLoading('hide');
                if (setting == 'true') {
                    $switch.removeClass('active');
                } else {
                    $switch.addClass('active');
                }
                $.miToast("修改成功", function () {
                    window.location.reload();
                });
            },
            error: function onerror(data, status) {
                $.miLoading('hide');
                $.miToast(data.status + ":" + data.statusText);
            }
        });
    });

});

//退出登录
$blockMeInfo.find("#logout").bind('click', function () {
    var confirmMsg = {
        title: '温馨提示',
        body: "确定要退出登录吗？"
    };
    $.miConfirm(confirmMsg, function () {
        $.miLoading();
        $.ajax({
            url: '/mobile/logout',
            type: 'GET',
            success: function () {
                $.miLoading('hide');
                window.location.href = "/mobile/login?auto_login=x"
            }
        });

    });
});

//解除微信绑定微信
$blockMeInfo.find("#unbind_wx").bind('click', function () {
    var confirmMsg = {
        title: '请注意请注意！',
        body: "<p class='text-orange'>解除微信绑定后，绑定的微信将不再会收到订单变化、积分变动等提醒信息！</p>"
    };
    $.miConfirm(confirmMsg, function () {
        $.miLoading();
        $.ajax({
            url: '/mobile/unbind_wx',
            type: 'GET',
            success: function () {
                $.miLoading('hide');
                $.miToast("解除成功", function () {
                    window.location.reload();
                });
            },
            error: function (data) {
                $.miLoading('hide');
                $.miToast(data.status + ":" + data.statusText);
            }
        });

    });
});

//绑定微信
$blockMeInfo.find("#bind_wx").bind('click', function () {
    var $this = $(this);
    var confirmMsg = {
        title: '请注意请注意！',
        body: "<p class='text-orange'>确定要将当前登录微信与当前首趣账号「" + $this.data('phone') + "」绑定吗？<br>绑定后当前登录微信将会收到订单变化、积分变动等提醒信息！</p>"
    };
    $.miConfirm(confirmMsg, function () {
        $.miLoading();
        $.ajax({
            url: '/mobile/bind_wx',
            type: 'GET',
            success: function () {
                $.miLoading('hide');
                $.miToast("绑定成功", function () {
                    window.location.reload();
                });
            },
            error: function (data) {
                $.miLoading('hide');
                $.miToast(data.status + ":" + data.statusText);
            }
        });
    });
});

//基本信息的修改
var userBasicAttrs = {
    'wechat': '微信号',
    'qq': 'QQ号',
    'username': '真实姓名',
    'alipay': '支付宝',
    'alipay_relate_user': '支付宝真实姓名',
    'backup_contact_way': '备用联系方式'
};
for (var key in userBasicAttrs) {
    $blockMeInfo.find("li[data-user-" + key + "]").data('key', key).click(function () {
        var myKey = $(this).data('key');
        var label = userBasicAttrs[myKey];
        var value = $(this).data('user-' + myKey);
        var $dialog = $("#update-me-info-dialog");

        $dialog.data('attr-name', myKey);

        $dialog.find(".title").html("请输入" + label);
        $dialog.find(".body input").attr('placeholder', "请输入" + label).val(value);
        $dialog.miInputDialog();
    });
}
$("#update-me-info-dialog").bind('confirmed', function (event, data) {
    var userId = $("#me-info").data('user');
    var $this = $(this);
    var attrName = $this.data('attr-name');
    var putData = {'user': {}};
    putData.user[attrName] = data;

    $this.miInputDialog('hide');
    $.miLoading();
    if (attrName != 'password') {
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
    } else {
        $.ajax({
            url: "/mobile/users/" + userId + "/reset_pwd?" + attrName + "=" + data,
            type: "PUT",
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            data: putData,
            success: function onsuccess(data, status) {
                $.miLoading('hide');
                $.miToast('修改成功', function () {
                    window.location.href = "/mobile/login?auto_login=x";
                });
            },
            error: function onerror(data, status) {
                $.miLoading('hide');
                $.miToast(data.status + ":" + data.statusText);
            }
        });
    }

});

$("header .right:has('.option-menu')").click(function () {
    $("#reset-mypwd-option-menu").miOptionMenu();
});
$("#reset-mypwd-option-menu").find(".btn-reset-pwd").click(function () {
    var $dialog = $("#update-me-info-dialog");
    $dialog.data('attr-name', 'password');

    $dialog.find(".title").html("请输入新的密码");
    $dialog.find(".body input").attr('placeholder', "请输入新的密码").val('');
    $dialog.miInputDialog();
});


//性别的修改
$blockMeInfo.find('li[data-user-sex]').click(function () {
    var sex = $(this).data('user-sex');
    $("#update-me-info-sex-select").miSelect('show', sex);
});
$("#update-me-info-sex-select").bind('confirmed', function (event, data) {
    var $this = $(this);
    var userId = $("#me-info").data('user');
    $this.miSelect('hide');
    $.miLoading();
    $.ajax({
        url: "/mobile/users/" + userId + ".json?user[sex]=" + data['value'],
        type: "PUT",
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("Accept", "application/json");
        },
        data: {user: {sex: data['value']}},
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
});
