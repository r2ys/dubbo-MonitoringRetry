;(function(){
    var _lastNumber = /(\d)$/;

    //设置_tabIndex初始值
    var _tabIndex = 0;
    var TabStrip = function (ele) {

        var tabStrip = $(ele).kendoTabStrip({
            collapsible: true,
        }).data("kendoTabStrip");
        tabStrip.select(0);

        this._tabStrip = tabStrip;

    }

    TabStrip.prototype.change = function(des) {
        var tabStrip = this._tabStrip;
        tabStrip.select(des);
    }



    window['TabStrip'] = TabStrip;
})();