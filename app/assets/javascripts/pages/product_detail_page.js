var ProductDetailPage = (function () {
    var _this;
    var $images;
    function ProductDetailPage() {
        _this = this;
    }

    ProductDetailPage.prototype = new AppPage();
    ProductDetailPage.prototype.images = [];
    /**
     * 页面元素初始化
     */
    ProductDetailPage.prototype.onCreate = function () {
      $images = $('.vd_productimg');
      swiper_init();
    };

    /**
     * 初始化数据
     */
    ProductDetailPage.prototype.onInitData = function () {
      $images.each(function(){
        _this.images.push($(this).attr('src'));
      });
    };

    /**
     * 页面元素的事件绑定开始了
     */
    ProductDetailPage.prototype.onBindEvent = function () {
      wx_image_click();
    };

    /**
     * 页面获取焦点
     */
    ProductDetailPage.prototype.onResume = function () {

    };

    function wx_image_click(){
      if (typeof(wx) != 'undefined') {
          wx.ready(function () {
            $(".vd_productimg").click(function () {
                var src = $(this).attr("src");
                wx.previewImage({
                    current: src,
                    urls: _this.images
                });
            });
          });
      }
    }

    function swiper_init(){
      var w = $(window).width();
      h = w * 720 / 720;
      $(".swiper-container").css("height", h);
      $(".swiper-container img").css("height", h);
      var mySwiper = new Swiper('.swiper-container',{
          pagination: '.swiper-pagination',
          paginationClickable: true,
          loop:true,
          autoplay: 2000,
          autoplayDisableOnInteraction: false
      });
    }

    return ProductDetailPage;
})();
