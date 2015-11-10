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
//= require pages/directory_page
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

var page_url = window.location.pathname;
var page;
if (/directories\/\d/.test(page_url)) {
    page = new DirectoryPage();
}

if (page != undefined) {
    page.start();
}
