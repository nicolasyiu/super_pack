//查看商品链接
$(".product-share-links").click(function () {
    var $this = $(this);
    var shopId = $this.data('shop');
    var productId = $this.data('product');

    var $select = $("#view-product-shop-select");
    if ($select.find("ul li").length <= 1) {
        window.location.href = "/mobile/products/" + productId + "?show=wap&shop_id=" + shopId;
    } else {
        $select.data('product',productId);
        $select.miSelect('show', shopId);
    }
});
$("#view-product-shop-select").bind('confirmed', function (event, data) {
    var $this = $(this);
    var productId = $this.data('product');
    window.location.href = "/mobile/products/" + productId + "?show=wap&shop_id=" + data['value'];
});