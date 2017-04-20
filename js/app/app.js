/**
 * Created by Administrator on 2017/4/13 0013.
 */
onload = function () {

    var vMsearchUser = new Vue({
        el: '#searchUser',
        data: {
            searchStr: '加伟',//v-model
            id: null,//用户id
            index: 0,
            ifAjaxResults: false,
            ajaxResults: [],
            ifFinalResult: false,
            finalResult: {},
        },
        methods: {
            search: function () {
                var that = this;
                this.ifAjaxResults = true;
                this.ifFinalResult = false;
                this.ajaxResults = [
                    {
                        id: 1,
                        userName: '刘加伟',
                        mobile: '13600000000',
                        level: '尊享会员',
                        famliyGroup: ['刘加伟', '刘筱川', '张大山'],
                        right: '美国签证（10年）全产品8.5折 首都机场出入境VIP通道*5',
                    },
                    {
                        id: 2,
                        userName: '王加伟',
                        mobile: '13777777777',
                        level: '普通会员',
                        famliyGroup: ['王加伟'],
                        right: '',
                    }
                ]

            },
            chooseOne: function (e) {
                var that = this;
                this.ifAjaxResults = false;
                this.ifFinalResult = true;
                this.id = e.currentTarget.getAttribute('data-id');
                this.index = e.currentTarget.getAttribute('data-index');
                this.finalResult = this.ajaxResults[that.index];

                //遮罩对象 ...
                vMmask.usedByArray = this.finalResult.famliyGroup;
                //切换用户 的时候右侧订单全部取消...
                vMorderResult.clear();

            }
        },
    });

    var vMsearchProduct = new Vue({
        el: '#searchProduct',
        data: {
            productTypeValue: '全部',
            productTypes: ['全部', '热销', '会员', '白金', '其它'],
            searchStr: '美国',//v-model
            products: [],
        },
        methods: {
            //产品点击搜索...
            search: function () {
                var that = this;
//                    console.log(that.searchStr);
//                    console.log(that.productTypeValue);

                //没有选择用户不能搜索产品...
                if (vMsearchUser.ifFinalResult) {
                    that._getProducts();
                } else {
                    alert('还没有选择用户')
                }

            },

            //select改变的时候搜索...
            change: function () {
                var that = this;
//                    console.log(that.productTypeValue);
                that._getProducts();
            },

            //添加vMmask
            showMask: function () {
                controller.direct({
                    php: '../json/productDetail.json',
                    params: {},
                    jsonpCallback: 'jsonpCallback',
                }, function (json) {
                    //console.log(JSON.stringify(json, null, '\t'));
                    vMmask.show = true;
                    vMmask.productDetail = json;
                });
            },

            //底层添加产品办法...
            _getProducts: function () {
                var that = this;
                controller.direct({
                    php: '../json/product.json',
                    params: {},
                    jsonpCallback: 'jsonpCallback',
                }, function (json) {
//                        console.log(JSON.stringify(json, null, '\t'));
//                        console.log(json.data);
                    that.products = [];
                    [].forEach.call(json.data, function (e, i, arr) {
                        that.products.push(e)
                    });
                })
            }
        },
    });

    var vMmask = new Vue({
        el: '#mask',
        data: {
            show: false,
            usedBy: '',
            usedByArray: [],
            productDetail: {},
        },
        computed: {
            //n选m大于1的情况下才有radio...
            ifRadioShow: function () {
                return (this.productDetail.involvementProductsNumber > 1);
            }
        },
        methods: {

            //radio在修改的时候 需要让其他所有不选中的radio的按钮全部消失选中...
            radioChange: function (e) {
                var that = this;
                var $target = $(e.currentTarget);//按钮...
                var radios = $(that.$el).find('.involvementRadio');

                [].forEach.call(radios, function (radio, i, arr) {
                    if (radio != $target) {
                        //按钮和radio的容器...
                        $(radio).closest('.involvementContainer').find('.btn').addClass('btn-default').removeClass('btn-primary');
                    }
                });
            },

            btnClick: function (e) {
                //console.log()
                var $target = $(e.currentTarget);//按钮...
                var $involvementContainer = $target.closest('.involvementContainer');//按钮和radio的容器...
                var limit = ($involvementContainer.attr('data-involvementLimit'));//限制数量...
                var $curRadio = $involvementContainer.find('.involvementRadio');

                //有radio并且radio被选中能切换按钮...
                //没有radio证明只有一个n选m也能切换按钮...
                if (($curRadio.length == 1 && $curRadio[0].checked == true) || ($curRadio.length == 0)) {
                    //取消选中直接执行...
                    if ($target.hasClass('btn-primary')) {
                        this._changeBtnStyle($target);
                    }
                    //已选中的已经达到极限值 无法选中...
                    else {
                        if ($involvementContainer.find('.btn-primary').length >= limit) {
                            return;
                        } else {
                            this._changeBtnStyle($target);
                        }
                    }
                }


            },

            _changeBtnStyle: function ($obj) {
                $obj.toggleClass('btn-default').toggleClass('btn-primary');
            },
            //点击右上角关闭
            close: function () {
                this.show = false;
            },
            submit: function () {
                var that = this;

                var usedBy = that.$els.usedbyselect.value
                if (usedBy == '') {
                    alert('未选择受益人');
                    return;
                }

                if (that.productDetail.involvementProductsNumber > 1) {

                    var radios = $(that.$el).find('.involvementRadio');
                    var curRadio = null;
                    radios.each(function (i, e) {
                        if (e.checked == true) {
                            curRadio = e;
                        }
                    })

                    var $involvementContainer = $(curRadio).closest('.involvementContainer');
                    var limit = $involvementContainer.attr('data-involvementlimit');


                    if ($involvementContainer.find('.btn-primary').length < limit) {
                        alert('已选签证国家数量少于要求数量');
                        return;
                    }
                }


                vMorderResult.orderResults.push(
                    {
                        productName: that.productDetail.productName,
                        usedBy: usedBy,
                        price: that.productDetail.totalPrice,
                        number: 1
                    }
                );
                that.show = false;


            },
        },
    });

    var vMorderResult = new Vue({
        el: '#orderResult',
        data: {
            orderResults: [
                //{productName: 'aaa', usedBy: '六', price: 11, number: 1},
            ]
        },
        computed: {
            totalPrice: function () {
                var that = this;
                var res = 0;
                [].forEach.call(that.orderResults, function (e, i, arr) {
                    if (e.price)res += parseFloat(e.price);
                })
                return res;
            },
            totalProductNumber: function () {
                return this.orderResults.length;
            },
            ifResultsShow: function () {
                return (this.orderResults.length != 0);
            }
        },
        methods: {
            clear: function () {
                this.orderResults = [];
            },
            createOrder: function () {
                alert('订单已生成');
                this.clear();

                location.href = "AddOrderDetail.html";
            },

            check: function (i) {
                vMmask.show = true;
            },
            delete: function (i) {
                var that = this;
                this.orderResults.$remove(that.orderResults[i]);
            }
        },
    });
}