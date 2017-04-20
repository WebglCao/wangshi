/**
 * Created by Administrator on 2017/3/30 0030.
 */
var myScroll = Vue.extend({
    //����Ĵ���...
    props: ['id'],//����id...

    data: function () {
        return {
            ifNeedAjax: true,
            isAjaxing: false,
            items: [
                //{product_name: 111},
                //{product_name: 222},
                //{product_name: 333},
                //{product_name: 444}
            ],
        }
    },

    template: '<div class="myScrollContainer" v-el:scrollcontainer v-on:scroll=scroll($event)>' +
    '<div class="myScrollContent"  v-el:scrollcontent>' +
    '<template v-for="item in items">' +
    '<div class="myScrollSection">{{item.product_name}}111</div>' +
    '</template>' +
    '</div>' +
    '</div>',


    methods: {
        //��������
        scroll: function (e) {
            e.preventDefault();

            if (!this.ifNeedAjax) {
                return;
            }

            if (this.isAjaxing) {
                return;
            }

            var containerH = this.$els.scrollcontainer.offsetHeight;
            var contentH = this.$els.scrollcontent.offsetHeight;
            var scrollH = this.$els.scrollcontainer.scrollTop;

            if (scrollH >= (contentH - containerH )) { //��̬��-������
                this.getList();
            }
        },

        //һ������action....
        getList: function () {
            var that = this;
            that.isAjaxing = true;
            controller.direct({
                php: '../json/order.json',
                params: {id: that.id},
                jsonpCallback: 'jsonpCallback',
            }, function (json) {
//                        console.log(JSON.stringify(json, null, '\t'));
//                        console.log(json.data);
                that.isAjaxing = false;
                [].forEach.call(json.data, function (e, i, arr) {
                    that.items.push(e);
                });
            })
        }
    },


})
