$(".mi-top-menu").unbind('click').click(function (event) {
    event.stopPropagation();
    var $this = $(this);
    var $menu = $this.find('ul');
    $menu.slideUp(function () {
        $this.hide();
        $("header.mi-header h2 span.glyphicon").removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
    });
}).find("ul li").click(function () {
    var $this = $(this);
    $this.parent().find('li span.check').removeClass("glyphicon").removeClass("glyphicon-ok-circle");
    $this.find("span.check").addClass("glyphicon").addClass("glyphicon-ok-circle");

    var $topMenuView = $(".mi-top-menu");
    var $topMenu = $topMenuView.find('ul');
    $topMenuView.trigger('changed', {text: $this.text().trim(), value: 0}, this);
    $topMenu.slideUp(function () {
        $topMenuView.hide();
        $("header.mi-header h2 span.glyphicon").removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
    });
});