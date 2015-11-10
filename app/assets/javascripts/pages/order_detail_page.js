var OrderDetailPage = (function () {
    var _this;

    var $order;

    var $headerRightBtn; //顶部菜单按钮
    var $optMenusView; //订单操作选项菜单

    var $optPriceBtn;//调整价格按钮（选项菜单）
    var $optProductBtn;//发放赠品按钮（选项菜单）
    var $optCommentBtn;//编辑留言按钮（选项菜单）
    var $optDeliveryBtn;//选择快递按钮（选项菜单）

    var $deliverySelView; //选择快递的选择框
    var $commentInputView;//输入留言的输入框
    var $priceInputView;//让利/提价 输入框

    var $cancelOrderBtn; //取消订单
    var $confirmOrderBtn; //确认订单


    var $presentView;//发送赠品modalview

    var $scoreRequestInfoView; //求积分打赏

    function OrderDetailPage() {
        _this = this;
    }

    OrderDetailPage.prototype = new AppPage();

    OrderDetailPage.prototype.order_id = ''; //订单id
    OrderDetailPage.prototype.order_comment = ''; //买家留言
    OrderDetailPage.prototype.can_send_product = ''; //发放赠品
    OrderDetailPage.prototype.can_select_shipping = ''; //选择快递
    OrderDetailPage.prototype.can_change_price = ''; //修改价格

    /**
     * 页面元素初始化
     */
    OrderDetailPage.prototype.onCreate = function () {
        $order = $(".order-data[data-id]");

        $headerRightBtn = $("header .right:has(.order-detail-option-menu)");
        $optMenusView = $("#order-detail-option-menus");

        $optPriceBtn = $optMenusView.find("button#edit-price");
        $optProductBtn = $optMenusView.find("button#send-product");
        $optCommentBtn = $optMenusView.find("button#edit-comment");
        $optDeliveryBtn = $optMenusView.find("button#edit-delivery");

        $deliverySelView = $("#select-delivery-select");
        $commentInputView = $("#edit-order-comment-dialog");
        $priceInputView = $("#edit-order-price-dialog");

        $cancelOrderBtn = $("button.cancel-order:not(.disabled)");
        $confirmOrderBtn = $("button.confirm-order:not(.disabled)");

        $scoreRequestInfoView = $("#score-request-info-view");
    };

    /**
     * 初始化数据
     */
    OrderDetailPage.prototype.onInitData = function () {
        _this.order_id = $order.data('id');
        _this.order_comment = $order.data('comment');
        //选择快递,发放赠品
        _this.can_send_product = $("#can_send_product").val();
        _this.can_select_shipping = $("#can_select_shipping").val();
        _this.can_change_price = $("#can_change_price").val();

    };

    /**
     * 页面元素的事件绑定开始了
     */
    OrderDetailPage.prototype.onBindEvent = function () {
        $headerRightBtn.click(function () {
            $optMenusView.miOptionMenu();
        });

        $optDeliveryBtn.click(function () {
            if ("yes" == _this.can_select_shipping) {
                $deliverySelView.miSelect();
            } else {
                alert("包邮产品根据收货地址随机选择快配送快递");
            }
        });

        $optCommentBtn.click(function () {
            $commentInputView.miInputDialog('show', _this.order_comment);
        });

        $optPriceBtn.click(function () {
            if ("yes" == _this.can_change_price) {
                $priceInputView.miInputDialog();
            } else {
                alert("支付完成订单不允许修改价格!");
            }
        });

        $cancelOrderBtn.click(function () {
            $.miConfirm('取消订单吗？', function () {
                _this.actionCancelConfirm('cancel');
            });
        });

        $confirmOrderBtn.click(function () {
            $.miConfirm('确认订单吗？', function () {
                _this.actionCancelConfirm('confirm');
            });
        });

        $commentInputView.bind('confirmed', function (event, comment) {
            _this.actionSaveComment(comment);
        });

        $deliverySelView.bind('confirmed', function (event, data) {
            _this.actionSaveDelivery(data['extra'], data['value']);
        });

        $priceInputView.bind('confirmed', function (event, data) {
            var priceType = $(this).find("[name=editPriceType]:checked").val();
            checkOrderAdjustPrice(data, priceType);
        });

        $optProductBtn.click(function () {
            if ("no" == _this.can_send_product) {
                alert("本产品为包邮产品，不能同时享受赠品优惠，不能添加赠品");
            } else {
                openPresentView();
            }
        });
    };

    OrderDetailPage.prototype.onResume = function () {

        if ($scoreRequestInfoView[0] != undefined) {
            setTimeout(function () {
                $scoreRequestInfoView.miModalView('show');
                new ScoreRequestDialogView($scoreRequestInfoView).start();
            }, 2000);
        }

    };
    /**
     * 动作：保存订单数据
     * @param formData
     */
    OrderDetailPage.prototype.actionSaveOrder = function (formData, contentType) {
        $.miLoading();
        var url = "/mobile/jms_orders/{0}".format(_this.order_id);
        $.ajax({
            url: url,
            type: "PUT",
            data: formData,
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
                if (contentType) {
                    XMLHttpRequest.setRequestHeader("Content-Type", contentType);
                }
            },
            success: function onsuccess(data, status) {
                $.miLoading('hide');
                $.miToast("操作成功", function () {
                    window.location.reload();
                }, 500);
            },
            error: function onerror(data) {
                $.miLoading('hide');
                $.miError(data);
            }
        });
    };

    /**
     * 动作：
     * 取消订单或者确认订单
     * @param event enum: 'cancel','confirm'
     */
    OrderDetailPage.prototype.actionCancelConfirm = function (event) {
        _this.actionSaveOrder({update_action: event});
    };

    /**
     * 动作：
     * 更新订单留言
     * @param comment 留言内容
     */
    OrderDetailPage.prototype.actionSaveComment = function (comment) {
        _this.actionSaveOrder({comment: comment});
    };

    /**
     * 动作：
     * 更新快递
     * @param express 快递公司
     * @param fee 运费
     */
    OrderDetailPage.prototype.actionSaveDelivery = function (express, fee) {
        _this.actionSaveOrder({express: express, shipping_charge: fee});
    };

    /**
     * 动作：
     * 调整订单价格
     * @param price_down 调整的价格
     */
    OrderDetailPage.prototype.actionAdjustPrice = function (price_down) {
        _this.actionSaveOrder({price_down: price_down});
    };


    /**
     * 打开赠品页面
     */
    function openPresentView() {
        $.miLoading();
        $.ajax({
            url: "/mobile/jms_orders/{0}/present_products".format(_this.order_id),
            type: "GET",
            success: function onsuccess(data, status) {
                $.miLoading('hide');
                $("body").append(data);
                $presentView = $("#order-presents-view");
                $presentView.miModalView();
                checkPresents();
            },
            error: function onerror(data) {
                $.miLoading('hide');
                $.miError(data);
            }
        });
    }

    /**
     *  检查调整的订单价格
     * @param price_down
     * @param priceType
     * @returns {*}
     */
    function checkOrderAdjustPrice(price_down, priceType) {
        var $input = $priceInputView.find('.body input[type=number]');

        var floatPrice = parseFloat(price_down);
        var maxPrice = $input.data("max"); //最高优惠
        var discountPrice = $input.data("discount"); //已经减免

        console.log(priceType);
        console.log(floatPrice);
        console.log(maxPrice);
        console.log(discountPrice);

        if (!floatPrice || floatPrice <= 0) {
            $.miToast("让利/提价金额必须是大于0的数字。");
            return null;
        }

        //不能低于最低折扣
        if (priceType == 'down' && parseFloat(maxPrice) < parseFloat(floatPrice)) {
            $.miToast("对不起，您本次最多让利{0}元。".format(maxPrice));
            return null;
        }

        //不能给订单涨价！！！
        if (priceType == 'up' && parseFloat(discountPrice) < parseFloat(floatPrice)) {
            $.miToast("对不起，你本次最多提价{0}元。".format(discountPrice));
            return null;
        }
        _this.actionAdjustPrice((priceType == "down" ? floatPrice : -floatPrice));
        return floatPrice;
    }


    //验证赠品并且提交
    function checkPresents() {
        $presentView.find("button.btn-commit-present").click(function () {
            var confirmMsg = {title: '温馨提示', body: '<p class="text text-orange">确认要给此单添加赠品吗？</p>'};
            $.miConfirm(confirmMsg, function () {
                var items = [];
                $presentView.find("[id^='num_props_']").each(function () {
                    var $btn = $(this);
                    var productId = $btn.data('product');
                    var productPropId = $btn.data('product-prop');
                    var productPropPrice = $btn.data('product-prop-price');
                    var quantity = $btn.val();

                    items[items.length] = {
                        product_id: productId,
                        product_prop_id: productPropId,
                        price: productPropPrice,
                        quantity: quantity
                    };
                });
                _this.actionSaveOrder(JSON.stringify({items: items, present: true}), 'application/json');
            });
        });
    }

    return OrderDetailPage;
})();
