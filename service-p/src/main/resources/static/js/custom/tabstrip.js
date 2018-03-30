;(function(){
    var _lastNumber = /(\d)$/;

    //设置_tabIndex初始值
    var _tabIndex = 0;

    var TabStrip = function (ele) {
        var tabStrip = $(ele).kendoTabStrip({
            collapsible: true,
        }).data("kendoTabStrip");
        tabStrip.select(0);

        $(ele).find(".grid-tabs-guide").on("click",function(e) {
            var _self = this;
            // 获取事件源
            var target = e.target || e.srcElement;
            if (target.className.indexOf("k-grid-tab-delete") > -1) {
                var _number = $(target).closest("li").attr("aria-controls").match(_lastNumber)[1];
                tabStrip.remove(+_number-1);
                tabStrip.select(_number-2);
            }
            return false;
        });
        this._tabStrip = tabStrip;
    }

    TabStrip.prototype.add = function(title) {
        _tabIndex++;
        var tabStrip = this._tabStrip;
        var tabIdName = "tabIndex_"+_tabIndex;
        var index = tabStrip.insertAfter([
            {
                text: '<div class="grid-tab-title"><span>'+ title +'</span> <span class="k-icon k-delete k-grid-tab-delete"></span></div>',
                encoded: false,                             // Allows use of HTML for item text
                content: '<div class="grid-tab"><div id='+tabIdName+'></div></div>'          // Content for the content element
            },
        ], tabStrip.select());
        var _number = tabStrip.select().attr("aria-controls").match(_lastNumber)[1];
        tabStrip.select(_number);
         return tabIdName; //返回domId

    }
    window['TabStrip'] = TabStrip;
})();