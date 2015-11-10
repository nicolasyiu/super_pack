//= require jquery
//= require bootstrap-sprockets
//= require bootstrap
//= require jextend
//= require components/baidu
//= require components/string
//= require components/header
//= require components/input_dialog
//= require components/top_menu
//= require components/loading
//= require components/toast
//= require components/select
//= require components/modal_view
//= require components/confirm
//= require components/error
//= require components/option_menu
//= require components/red_bag
//= require views/base_view
//= require views/users
//= require views/products
//= require views/vd_teams
//= require views/team_member_info_view
//= require views/score_request_dialog_view
//= require pages/app_page
//= require pages/home_index_page
//= require pages/home_team_member_page
//= require pages/home_team_bulletins_page
//= require pages/order_detail_page
//= require pages/product_detail_page
//= require pages/score_histories_page
//= require pages/create_score2cash_page
//重写alert
window.alert = function (msg) {
    $.miToast(msg);
};

//连接
$("[data-href]").unbind('click').click(function () {
    var href = $(this).data('href');
    if (href) {
        window.location.href = href;
    }
});

//订单选择器发生变化
$("#home-orders-top-menu").bind('changed', function (event, data) {
    console.log(data);
    $("#title").text(data['text']);
    window.location.href = '/mobile/home/order?process=' + data['text'];
});

//创建店铺
$("#create-shop-icon").click(function () {
    $("#create-shop-input-dialog").miInputDialog('show');
});
$("#create-shop-input-dialog").bind('confirmed', function (event, data) {
    console.log(data);
    var shopKind = $(this).data('kinds');
    var $appForm = $("#app_form");
    var authenticity_token = $appForm.find("input[name=authenticity_token]").val();
    $.miLoading('show');
    $.ajax({
        url: '/mobile/jms_shops',
        type: 'POST',
        data: {
            application: {name: data, description: '首趣微店'},
            kinds: shopKind,
            utf8: "✓",
            authenticity_token: authenticity_token
        },
        success: function (data) {
            console.log(data);
            window.location.href = '/mobile/home/shop?kinds=adult';
        },
        error: function (data) {
            $.miLoading('hide');
            var obj = data.responseJSON.msg;
            if (obj.hasOwnProperty('name')) {
                $.miToast("店铺名已存在");
            } else if (typeof (obj) == 'string') {
                $.miToast(obj);
            }
            console.log(obj);
        }
    })
});

//修改店铺名称
$(".shops-info li.shop_name").click(function () {
    var $this = $(this);
    var shopId = $this.parent().data('shop');
    var $dialog = $("#update-shop-name");
    $dialog.miInputDialog();
    $dialog.data('shop', shopId);
    $dialog.find("input").val($this.find(".right").text());
});
$("#update-shop-name").bind('confirmed', function (event, data) {
    var $this = $(this);
    var $appForm = $("#app_form");
    var authenticity_token = $appForm.find("input[name=authenticity_token]").val();
    var shopId = $this.data('shop');

    $.miLoading('show');
    $.ajax({
        url: "/mobile/my_shop/" + shopId + "/rename",
        type: 'PUT',
        data: {name: data, utf8: "✓", authenticity_token: authenticity_token},
        success: function (data) {
            console.log(data);
            $.miLoading('hide');
            $.miToast('修改成功', function () {
                window.location.reload();
            });
        },
        error: function (data) {
            console.log(obj);
            $.miLoading('hide');
            var obj = data.responseJSON.msg;
            if (obj.hasOwnProperty('name')) {
                $.miToast("店铺名已存在");
            }
        }
    });
});

//修改店铺微信
$(".shops-info li.shop_wechat").click(function () {
    var $this = $(this);
    var shopId = $this.parent().data('shop');
    var $dialog = $("#update-shop-wechat");
    $dialog.miInputDialog();
    $dialog.data('shop', shopId);
    var input_txt = $this.find(".right").text();
    if ('未设置' == input_txt) {
        input_txt = '';
    }
    $dialog.find("input").val(input_txt);
});
$("#update-shop-wechat").bind('confirmed', function (event, data) {
    var $this = $(this);
    var $appForm = $("#app_form");
    var authenticity_token = $appForm.find("input[name=authenticity_token]").val();
    var shopId = $this.data('shop');

    $.miLoading('show');
    $.ajax({
        url: "/mobile/my_shop/" + shopId + "/update_setting",
        type: 'PUT',
        data: {name: 'shop_owner_wechat_number', value: data, utf8: "✓", authenticity_token: authenticity_token},
        success: function (data) {
            console.log(data);
            $.miLoading('hide');
            $.miToast('修改成功', function () {
                window.location.reload();
            });
        },
        error: function (data) {
            console.log(obj);
            $.miLoading('hide');
            alert('error');
        }
    });
});

//修改店铺描述
$(".shops-info li.shop_desc").click(function () {
    var $this = $(this);
    var shopId = $this.parent().data('shop');
    var $dialog = $("#update-shop-desc");
    $dialog.miInputDialog();
    $dialog.data('shop', shopId);
    $dialog.find("textarea").val($this.data('desc'));
});
$("#update-shop-desc").bind('confirmed', function (event, data) {
    var $this = $(this);
    var $appForm = $("#app_form");
    var authenticity_token = $appForm.find("input[name=authenticity_token]").val();
    var shopId = $this.data('shop');
    $.miLoading('show');
    $.ajax({
        url: "/mobile/my_shop/" + shopId + "/rename",
        type: 'PUT',
        data: {description: data, utf8: "✓", authenticity_token: authenticity_token},
        success: function (data) {
            console.log(data);
            $.miLoading('hide');
            $.miToast('修改成功', function () {
                window.location.reload();
            });
        },
        error: function (data) {
            console.log(obj);
            $.miLoading('hide');
            var obj = data.responseJSON.msg;
            if (obj.hasOwnProperty('name')) {
                $.miToast("店铺名已存在");
            }
        }
    });
});

//经营类型
$(".shops-info li.shop_kind").click(function () {
    var $this = $(this);
    var shopId = $this.parent().data('shop');
    var homepageId = $this.data('homepage');
    var $select = $("#update-shop-kind-select");
    $select.data('shop', shopId);
    $select.miSelect('show', homepageId);

    //$select.find("textarea").val($this.data('desc'));
});
$("#update-shop-kind-select").bind('confirmed', function (event, data) {
    var $this = $(this);
    var shopId = $this.data('shop');
    console.log(data);

    $.miLoading();
    $.ajax({
        url: "/mobile/my_shop/" + shopId + "/select_homepage?homepage_id=" + data['value'],
        type: "PUT",
        data: {homepage_id: data['value']},
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


var page_url = window.location.pathname;
var page;
if (/mobile\/home\/team/.test(page_url)) {
    if (/info=bulletin/.test(location.search)) {
        page = new VdTeamBulletinsPage();
    } else if (/info=news/.test(location.search)) {

    } else {
        page = new HomeTeamMemberPage();
    }
} else if (/mobile\/jms_orders/.test(page_url)) {
    page = new OrderDetailPage();
} else if (/mobile\/home/.test(page_url)) {
    page = new HomeIndexPage();
} else if (/mobile\/vd_activities\/newer_gift_bag/.test(page_url)) {
    page = new ActivityNewerGiftBagPage();
} else if (/mobile\/products/.test(page_url)) {
    page = new ProductDetailPage();
} else if (/mobile\/my_scores/.test(page_url) || /mobile\/vd_user_scores\/histories/.test(page_url)) {
    page = new ScoreHistoriesPage();
} else if (/mobile\/vd_score_to_cashes\/new/.test(page_url)) {
    page = new CreateScore2CashPage();
}

if (page != undefined) {
    page.start();
}
