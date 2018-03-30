(function ($) {
    var OPLAT = window.OPLAT || {},
        CREATE = "insert",
        READ = "query",
        UPDATE = "update",
        DESTROY = "delete",
        DATE_FORMAT = 'yyyy-MM-dd HH:mm:ss',
        PARSE_DATE_FORMAT = 'yyyy/MM/dd HH:mm:ss', // 另一种日期格式的支持


        CSRF_HEADER = {},
        AJAX_OPTIONS = {
            type: 'POST',
            dataType: "json",
            contentType: "application/json",
            headers: CSRF_HEADER
        },
        transport_defaults = {
            read: {
                type: 'GET',
                dataType: "json",
                contentType: "application/json"
            },
            create: {
                type: 'POST',
                dataType: "json",
                contentType: "application/json"
            },
            update: {
                type: 'POST',
                dataType: "json",
                contentType: "application/json"
            },
            destroy: {
                type: 'POST',
                dataType: "json",
                contentType: "application/json"
            },
            parameterMap: function (options, operation) {
                if (operation == "read") {
                    options.filters = kendo.stringify(options.filter);
                }
                return options;
            }
        },
        datasource_defaults,
        grid_defaults,
        GRID_HEIGHT = 550,



        DataSource = kendo.data.DataSource,

        isArray = $.isArray,
        isPlainObject = $.isPlainObject,
        map = $.map,
        each = $.each,
        extend = $.extend;

    kendo.culture("zh-CN");

    /* 简化配置DataSource */
    function _parseDataSource(options) {
        var dataSource;
        if (options.url) {
            // 简化的DataSource配置，只配置了read的URL, 完整的配置使用options.dataSource
            dataSource = new DataSource({
                transport: {
                    read: {
                        url: options.url,
                        type: 'GET',
                        dataType: "json",
                        contentType: "application/json"
                    }
                },
                schema: {
                    data: "rows"
                }
            })
        } else {
            if (options.dataSource instanceof DataSource) {
                dataSource = options.dataSource;

            } else if (isArray(options.dataSource)) {
                dataSource = new DataSource({
                    data: options.dataSource
                });

            } else if (isPlainObject(options.dataSource)) {
                dataSource = new DataSource(options.dataSource);
            }
        }
        return dataSource;
    }


    /**
     * DataSource的options的封装
     *
     * KendoGrid的options的封装
     */

    datasource_defaults = {
        batch: true, // 一次请求提交多条数据
        serverFiltering: true, // 服务端过滤
        serverPaging: true, // 服务端分页
        transport: transport_defaults,
        schema: {
            data: "rows",
            total: "total"
        }
    };

    var validation = {
        rules: {},
        messages: {}
    };


    grid_defaults = {
        // TODO: 宽度自适应的方案
        height: GRID_HEIGHT,
        resizable: true,

        selectable: "multiple,row", // 多行选中
        editable: true,

        pageable: {
            // refresh按钮 input跳转 翻页文字展示 在此配置
            pageSize: 10, // DataSource设置会覆盖此处设置
            pageSizes: [10, 20, 50] // 分页配置
        }
    };

    OPLAT.Grid = function (options) {
        $(options.Id).kendoGrid();

        return gridInstance;

    };


    // 统一封装的Grid 简化配置
    OPLAT.kendoGrid = function (options) {
        // 解析简化后的options，合并为kendo的格式

        var dataSource;
        if (options.strict) {
            // 严格模式，完全遵循kendo的格式配置dataSource
            dataSource = options.dataSource;

        } else {
            // 使用封装的配置,混合使用kendo的配置
            if (options.url) {
                // 配置transport
                dataSource = extend(true, {}, datasource_defaults, {
                    transport: {
                        read: {url: options.url + OPLAT.DATA.READ},
                        create: {url: options.url + OPLAT.DATA.CREATE},
                        update: {url: options.url + OPLAT.DATA.UPDATE},
                        destroy: {url: options.url + OPLAT.DATA.DESTROY}
                    },

                    schema: {
                        model: {
                            id: options.modelId
                        }
                    }
                }, options.dataSource);

            } else {
                dataSource = extend(true, {}, datasource_defaults, options.dataSource);
            }
        }

        // 处理grid的列 校验和数据类型type
        // dataSource.schema.model.fields.

        each(options.columns, function (i, column) {
            // 处理column的type和 校验
            switch (column.type) {
                case 'boolean':
                    ;
                    break;

                case 'date':
                    break;

                case 'datetime':
                    // 注意column的format是个json的字符串,value 最终的格式以DATE_FORMAT为准
                    column.format = "{0:" + DATE_FORMAT + "}";
                    column.editor = function (container, options) {
                        var input = $('<input />');
                        input.attr("name", options.field);
                        input.appendTo(container);

                        input.kendoDateTimePicker({
                            // value: new Date("2016-11-10"),
                            // 在此设置defaultValue没有意义，Grid默认的新增逻辑，只根据schema.model中的defaultValue
                            format: DATE_FORMAT,
                            parseFormats: PARSE_DATE_FORMAT,
                            interval: 1, // 指定小时分钟下拉列表之间的分钟间隔。默认30分钟
                            min: new Date(1950, 0, 1),
                            max: new Date(2049, 11, 31),
                            footer: false, // 隐藏脚部内容（系统日期）
                            animation: {
                                close: {
                                    effects: "fadeOut zoom:out",//关闭时动画特效类型，多个特效用空格隔开。
                                    duration: 400 //关闭时动画持续的时间，单位是毫秒。
                                },
                                open: {
                                    effects: "fadeIn zoom:in",
                                    duration: 400
                                }
                            }
                        });

                    };

                    break;

                case 'dropdown':
                    var _dropDownData = _parseDataSource(column.dropdown);
                    // TODO Promise fail的处理 目前只能是静态的数组 异步=》数据一起返回类似EiInfo的
                    // 多个Block 同步或者后台返回带过来text或者modelparse处理，问题是下拉大数据如何处理
                    _dropDownData.fetch(function () {
                        // 触发dropdown的edit更新
                        var data = this.data().toJSON();
                        // map to text value
                        column.values = map(data, function (e) {
                            return {
                                text: e[column.dropdown.text],
                                value: e[column.dropdown.value]
                            }
                        });


                    });

                    column.editor = function (container, options) {
                        var input = $('<input />');
                        input.attr("name", options.field);
                        input.appendTo(container);

                        input.kendoDropDownList({
                            dataTextField: column.dropdown.text,
                            dataValueField: column.dropdown.value,
                            dataSource: _dropDownData
                        });
                    };


                    break;
                case 'combo':
                    break;
                default:
                    break;
            }

            // 处理校验问题

        });


        delete options.dataSource;

        var w = extend({}, {dataSource: dataSource}, grid_defaults, options);

        var gridInstance = $("#" + options.gridId).kendoGrid(w).data("kendoGrid");

        return gridInstance;

    };


    extend(true, OPLAT, {
        Grid: OPLAT.kendoGrid,

        DATA: {
            READ: READ,
            CREATE: CREATE,
            UPDATE: UPDATE,
            DESTROY: DESTROY
        }
    });

    window.OPLAT = OPLAT;

})(window.jQuery);