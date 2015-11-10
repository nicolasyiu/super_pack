//返回按钮
$("header.mi-header .left.back").bind('click',function () {
    window.history.back();
});

$("header.mi-header .left.back-home").unbind('click').bind('click',function () {
    window.location.href='/mobile/home';
});


//点击顶部标题
$("header.mi-header h2").unbind('click').click(function () {
    var $this = $(this);
    var $arrow = $this.find("span.glyphicon");
    var $topMenuView = $(".mi-top-menu");
    var $topMenu = $topMenuView.find('ul');
    if ($topMenuView.css('display') == 'none') {
        $topMenuView.show();
        $topMenu.slideDown(function () {
            $arrow.removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
        });
    } else {
        $topMenu.slideUp(function () {
            $topMenuView.hide();
            $arrow.removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
        });

    }
});
