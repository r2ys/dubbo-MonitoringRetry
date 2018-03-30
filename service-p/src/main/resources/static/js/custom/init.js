;(function(){
    // 模版引擎
    var _ = {};
    _.templateSettings = {
        evaluate    : /<%([\s\S]+?)%>/g,
        interpolate : /<%=([\s\S]+?)%>/g,
        escape      : /<%-([\s\S]+?)%>/g
    };

    // When customizing `templateSettings`, if you don't want to define an
    // interpolation, evaluation or escaping regex, we need one that is
    // guaranteed not to match.
    var noMatch = /(.)^/;

    // Certain characters need to be escaped so that they can be put into a
    // string literal.
    var escapes = {
        "'":      "'",
        '\\':     '\\',
        '\r':     'r',
        '\n':     'n',
        '\u2028': 'u2028',
        '\u2029': 'u2029'
    };

    var escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '`': '&#x60;'
    };

    _.keys = function(obj) {
        if (Object.keys) return Object.keys(obj);
        var keys = [];
        for (var key in obj) if (_.has(obj, key)) keys.push(key);
        return keys;
    };

    var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

    var escapeChar = function(match) {
        return '\\' + escapes[match];
    };

    var createEscaper = function(map) {
        var escaper = function(match) {
            return map[match];
        };
        // Regexes for identifying a key that needs to be escaped
        var source = '(?:' + _.keys(map).join('|') + ')';
        var testRegexp = RegExp(source);
        var replaceRegexp = RegExp(source, 'g');
        return function(string) {
            string = string == null ? '' : '' + string;
            return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
        };
    };
    _.escape = createEscaper(escapeMap);


    _.template = function(text, settings, oldSettings) {
        if (!settings && oldSettings) settings = oldSettings;
        settings = $.extend({}, settings, _.templateSettings);

        // Combine delimiters into one regular expression via alternation.
        var matcher = RegExp([
                (settings.escape || noMatch).source,
                (settings.interpolate || noMatch).source,
                (settings.evaluate || noMatch).source
            ].join('|') + '|$', 'g');

        // Compile the template source, escaping string literals appropriately.
        var index = 0;
        var source = "__p+='";
        text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
            source += text.slice(index, offset).replace(escaper, escapeChar);
            index = offset + match.length;

            if (escape) {
                source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
            } else if (interpolate) {
                source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
            } else if (evaluate) {
                source += "';\n" + evaluate + "\n__p+='";
            }

            // Adobe VMs need the match returned to produce the correct offest.
            return match;
        });
        source += "';\n";

        // If a variable is not specified, place data values in local scope.
        if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

        source = "var __t,__p='',__j=Array.prototype.join," +
            "print=function(){__p+=__j.call(arguments,'');};\n" +
            source + 'return __p;\n';

        try {
            var render = new Function(settings.variable || 'obj', '_', source);
        } catch (e) {
            e.source = source;
            throw e;
        }

        var template = function(data) {
            return render.call(this, data, _);
        };

        // Provide the compiled source as a convenience for precompilation.
        var argument = settings.variable || 'obj';
        template.source = 'function(' + argument + '){\n' + source + '}';

        return template;
    };

    window._ = _;


    // 查询处理


    var _querytpl ='<div class="pre-content">' +
                       '<div class="">' +
                            '<div class="block-time-filter">'+
                                '<a href="javascript:;" class="block-type-li"><i class="si si-trash query-cancel"></i></a>'+
                                '<a href="javascript:;" class="block-type-li"><button class="k-primary-query k-button query-sure">查询</button></a>'+
                            '</div>'+
                        '</div>'+
                       '<div class="pre-loadding"></div>' +
                   '</div>';

    var _defaults = {};

    $.kendoInitQuery = function(option) {
        // 第一步创建查询块
        // 第二步绑定查询方法
        var option = $.extend({},option);
        $.each(option,function(index,elem) {
             new CreateQuery(elem);
        });

    };

    var clicks = {
        queryGrid:function(e,query,grid){
            var filters = new Array();
            var query_needs =  $(query).find("input.query-need");

            for (var index = 0 ; index < query_needs.length ; index++ ) {
                var elem = query_needs[index];
                var _elem = $(elem);
                if (_elem.val().trim() === "") {
                    continue;
                }
                if (_elem.data('role') === "datetimepicker") {
                    filters.push({field:_elem.attr('name'),operator:_elem.data('query'),value:new Date(_elem.val()).getTime()});
                    continue;
                }
                filters.push({field:_elem.attr('name'),operator:_elem.data('query'),value:_elem.val()});
            }
            grid.dataSource.filter(filters);
        },
        clearAll:function (e,query) {
            $(query).find("input.query-need").val("");
        }
    };


    // 创建一个query
    var CreateQuery = function (query){
        //查询块
        var _queryId = query.queryId;
        // grid块
        var _gridId = query.gridId;
        // 获取datasources
        // 处理时间信息
        var $starttime = $(_queryId).find(".starttime");
        var kendoStarttime = $starttime.kendoDateTimePicker({
            change: function(e) {
                var startDate = kendoStarttime.value();
                var endDate = kendoEndtime.value();
                if (startDate) {
                    startDate = new Date(startDate);
                    startDate.setDate(startDate.getDate());
                    kendoEndtime.min(startDate);
                } else {
                    kendoStarttime.max(new Date(endDate));
                }
            },
            format: "yyyy-MM-dd HH:mm:ss",
            culture: "zh-CN",
        }).data("kendoDateTimePicker");

        var $endtime = $(_queryId).find(".endtime");
        var kendoEndtime = $endtime.kendoDateTimePicker({
            format: "yyyy-MM-dd HH:mm:ss",
            culture: "zh-CN",
        }).data("kendoDateTimePicker");

        // 查询操作 处理口
        $(_queryId).on("click",function(e) {
            var _self = this;
            // 获取事件源
            var target = e.target || e.srcElement;
            var argus = Array.prototype.slice.call(arguments);
            var _kendoGrid = $(_gridId).data('kendoGrid');
            argus.push(_self);
            argus.push(_kendoGrid);
            var _click = $(target).data("click");
            clicks[_click] && clicks[_click].apply(null,argus);
        });
    };

    // 页面延迟加载
    $(document).ready(function(){
        setTimeout(function(){
            $(".pre-content .pre-loadding").hide();
        },500);
    });

    // 初始化查询数据



})();