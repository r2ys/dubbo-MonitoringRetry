;(function(){
    /*通用方法*/

    /***进行消息提示模块编写***/
    jQuery(function () {
        //初始化消息提示
        App.initHelpers('notify');
        //初始化全局胡window属性 进行提示框展示
    });

    function msg_top_success (msg) {
        $.notify({
            icon:"fa fa-check",
            message: msg,
        }, {
            type:"success",
            placement: {
                from: "top",
                align: "center"
            }
        });
    }

    function msg_top_failed (msg) {
        $.notify({
                icon:"fa fa-times",
                message: msg,
            },
            {
                type:"danger",
                placement: {
                    from: "top",
                    align: "center"
                }
            });
    }

    function error() {
        $.notify({
            icon:"fa fa-times",
            message: "服务器异常"
        },{
            type:"danger",
            placement: {
                from: "top",
                align: "center"
            }
        });
    }

    /*编辑model 片段*/
    var edittpl = '<form class="kendo-form-1">' +
        '<% for (var i = 0 ; i < data.length ;i++) { %> ' +
            '<% if( data[i]["type"] && data[i]["type"]["name"] == "droplist") { %>'+
                '<p > <span class="edittpl-span">'+'<%=data[i].title%>'+'</span> ' +
                    '<select name="<%=data[i].field%>">' +
                        '<% for (var j = 0 ; j < data[i]["type"]["value"].length ;j++) { %> '+
                            '<option value=<%=data[i]["type"]["value"][j]["name"]%>  '+
                                //是否被选中
                                '<% if (data[i]["type"]["value"][j]["name"] == data[i].value ) {%>'+ 'selected' +'<% } %>' +
                            '><%=data[i]["type"]["value"][j]["name"]%></option>'+
                        '<% } %>' +
                    '</select>' +
                '</p>'+
            '<% continue; } %>' +
            '<% if( data[i]["type"] && data[i]["type"]["name"] == "datetime") { %>'+
                '<p > <span class="edittpl-span">'+'<%=data[i].title%>'+'</span> ' +
                    '<input class="inittime "  name="<%=data[i].field%>" value="<%=data[i].value%>"  >' +
                '</p>'+
            '<% continue; } %>' +
            // 'else { %>' +
                '<p > <span class="edittpl-span">'+'<%=data[i].title%>'+'</span> <input  name="<%=data[i].field%>" type="text" value="<%=data[i].value%>" ></p>'+
            // '<% } %>' +
        ' <% } %>' +
        '</form>'+'' +
        ' <div class="kendo-form-bottom">'+
        '<label><a href="javascript:;" class="query-sure"><%=name0%></a></label>'+
        '<label><a href="javascript:;" class="query-cancel"><%=name1%></a></label>'+
        '</div>';

    var editcompiled = _.template(edittpl); //编译后 model 编辑 模版

    /*删除model 片段*/
    var deltpl = '<div class="kendo-del-message"><%=message%></div>'+
        '<div class="kendo-form-bottom">'+
        '<label><a href="javascript:;" class="query-sure"><%=name0%></a></label>'+
        '<label><a href="javascript:;" class="query-cancel"><%=name1%></a></label>'+
        '</div>';

    var delcompiled = _.template(deltpl);


    //弹出框 使用闭包形成弹出框 让能够重复使用
    var dialog = (function(){
        var mywindow = document.createElement("div");
        mywindow.id = "myWindow";
        document.body.appendChild(mywindow);
        var myWindow = $("#myWindow").kendoWindow({
            title:"未命名",
            visible: false,
            modal: true,
            actions: [
                "Close"
            ],
            animation: {
                close: { duration: 500 },
                open : { duration: 500 }
            }
        });
        var option = {
            title:"未命名",
            content:"",
        };
        var dialog =  myWindow.data("kendoWindow");
        dialog.bind("open",function() {
            var argus = Array.prototype.slice.call(arguments)
            option['init'] && option['init'].apply(myWindow,argus);
        });

        myWindow.on("click",function(e) {
            var argus = Array.prototype.slice.call(arguments)
            var target = e.target || e.srcElement;
            if (target.className.indexOf('query-sure') > -1) {
                option['ok'] && option['ok'].apply(myWindow,argus);
            }
            if (target.className.indexOf('query-cancel') > -1) {
                option['cancel'] && option['cancel'].apply(myWindow,argus);
            }
        });

        myWindow.on('submit',function(e) {
            var argus = Array.prototype.slice.call(arguments)
            option['submit'] && option['submit'].apply(myWindow,argus);
            return false;
        });
        return function(_option) {
            option = $.extend(option,_option);
            dialog.title(option['title']);
            dialog.content(option['content']);
            // 调用初始化方法
            dialog.center().open();
        };
    })();

    //clicks 是处理操作的统一处理函数
    /******自定义处理方法集合 暂时只支持(click)******/
    var clicks = {
        //全选
        checkAll:function(e,dom) {
            var target = e.target || e.srcElement;
            if (target.className.indexOf("kendo-check-all") > -1) {
                var _target = target;
                $(dom).find("table>tbody").find("tr>td>input[type='checkbox']").each(function(index,elem){
                    elem.checked = _target.checked;
                });
                if (_target.checked) {
                    $(dom).find("tr").addClass("k-state-selected");
                } else {
                    $(dom).find("tr").removeClass("k-state-selected");
                }
            }
        },
        // 新增model 处理接口  接着处理
        addModel:function(e,dom) {
            var option = $(dom).data('option');
            var kendoGrid = $(dom).data('kendoGrid');
            var _dataSoucres = kendoGrid.dataSource;
            /**使用window弹窗实现新增**/
            var _needmodels = new Array();
            $.each(option['model'],function(index,elem){
                if (elem['field']) {
                   var obj = {};
                   obj['field'] = elem['field'],
                   obj['title'] = elem['title'],
                   obj['type'] = elem['type'],
                    _needmodels.push(obj);
                }
            });
            var _html = editcompiled({data:_needmodels,name0:'保存',name1:'重置'});
            // dialog 处理
            dialog({
               title:"新增",
                content:_html,
                init:function(e) {
                    this.find(".kendo-form-1").validate({
                        debug:false,
                        rules:option.validation.rules,
                        message:option.validation.message,
                    });
                    var initTime = $(".inittime").kendoDatePicker({
                        format: "yyyy-MM-dd HH:mm:ss",
                        culture: "zh-CN"
                    }).data("kendoDatePicker");
                },
                ok:function(e) {
                    this.find(".kendo-form-1").submit(); //提交请求
                },
                cancel:function(e) {
                    this.find(".kendo-form-1")[0].reset();
                },
                submit:function(e) {
                    var _dialog = this;
                    var target = e.target || e.srcElement;
                    if (target.className.indexOf('kendo-form-1') > -1) {
                        var _array = $(target).serializeArray();
                        var model = new Object();
                        $.each(_array,function(index,elem){
                            console.log(elem);
                            model[elem['name']] = elem['value'];

                        });
                        _dataSoucres.one("requestEnd",function(e){
                            var response = e.response;
                            var type = e.type;
                            if (type === "create")  {
                                if (response.userdata.status === 200) {
                                    msg_top_success("添加成功");
                                    _dialog.data("kendoWindow").close();
                                } else {
                                    msg_top_failed("添加失败");
                                }
                            }
                            return e;
                        });
                        // 提交服务端
                        _dataSoucres.insert(0,model);
                        _dataSoucres.sync();
                    }
                }
            });
        },
        //删除model接口 可实现checbox 多个删除
        removeModel:function(e,dom) {
            var _selected = false;
            var option = $(dom).data('option');
            var kendoGrid = $(dom).data('kendoGrid');
            var _dataSoucres = kendoGrid.dataSource;
            var _html = delcompiled({message:"确认删除此数据么?",name0:'确定',name1:'取消'});
            var checkList = new Array(); //被选中的checkbox 数据列表
            $("input[type='checkbox'].kendo-check-box").each(function(index,elem){
                if (elem.checked) {
                    checkList.push($(elem).val());
                }
            });
            if (checkList.length > 0) {
                _selected = true;
                dialog({
                    title:'删除',
                    content:_html,
                    ok:function() {
                        var _dialog = this;
                        var managers = "";
                        //本地删除
                        for (var k = 0 ; k < checkList.length ; k++) {
                            var _model = _dataSoucres.getByUid(checkList[k]);
                            managers += _model['id']+",";
                        }
                        managers = managers.substr(0,managers.length-1);
                        $.ajax({
                            type: "GET",
                            url: option['operation']['destroy'],
                            data: {delIds:managers},
                            dataType: "json",
                            success: function (data) {
                                for (var k = 0 ; k < checkList.length ; k++) {
                                    var _model = _dataSoucres.getByUid(checkList[k]);
                                    _dataSoucres.remove(_model);
                                }
                                msg_top_success("删除成功");
                                _dialog.data("kendoWindow").close();
                            },
                            error: function (msg) {
                                msg_top_failed("删除失败");
                            }
                        })
                    },
                    cancel:function() {
                        var _dialog = this;
                        _dialog.data("kendoWindow").close();
                    }
                })
            } else {
                dialog({
                    'title':"删除",
                    "content":"<div class='kendo-del-message'>没有选中checkbox</div>",
                });
            }
        },
        updateModel:function(e,dom) {
            var _selected = false;
            var option = $(dom).data('option');
            var kendoGrid = $(dom).data('kendoGrid');
            var _dataSoucres = kendoGrid.dataSource;
            var _dataValue,checked = false;

            // 选择第一个选中的checkbox 默认为第一个
            $("input[type='checkbox'].kendo-check-box").each(function(index,elem){
               if (elem.checked && !checked) {
                   checked = true;
                   _dataValue = $(elem).val();
               }
            });
            if (_dataValue) {
                var _needmodels = new Array();
                var oldModel = _dataSoucres.getByUid(_dataValue);
                $.each(option['model'],function(index,elem){
                    if (elem['field']) {
                            var obj = {};
                            obj['field'] = elem['field'],
                            obj['title'] = elem['title'],
                            obj['value'] = _dataSoucres.getByUid(_dataValue)[elem['field']];
                            obj['type'] = elem['type'],
                            _needmodels.push(obj);
                    }
                });
                var _html = editcompiled({data:_needmodels,name0:'保存',name1:'重置'});
                dialog({
                    title:"编辑",
                    content:_html,
                    init:function(e) {
                        this.find(".kendo-form-1").validate({
                            debug:false,
                            rules:option.validation.rules,
                            message:option.validation.message,
                        });
                    },
                    ok:function(e) {
                        this.find(".kendo-form-1").submit(); //提交请求
                    },
                    cancel:function(e) {
                        this.find(".kendo-form-1")[0].reset();
                    },
                    submit:function(e) {
                        var _dialog = this;
                        var target = e.target || e.srcElement;
                        if (target.className.indexOf('kendo-form-1') > -1) {
                            //_dataSoucres.sync();
                            var _array = $(target).serializeArray();
                            var model = new Object();
                            $.each(_array,function(index,elem){
                                oldModel.set(elem['name'],elem['value']);
                            });
                            _dataSoucres.one("requestEnd",function(e){
                                var response = e.response;
                                var type = e.type;
                                if (type === "update")  {
                                    if (response.userdata.status === 200) {
                                        msg_top_success("编辑成功");
                                        _dialog.data("kendoWindow").close();
                                    } else {
                                        msg_top_failed("编辑失败");
                                    }
                                }
                                return e;
                            });
                            _dataSoucres.sync();
                        }
                    }
                });

            } else {
                if (!_selected) {
                    dialog({
                        'title':"编辑",
                        "content":"<div class='kendo-del-message'>没有选中checkbox</div>",
                    });
                }
            }
        },

    };
    window['g_index'] = 0; //加载一个全局属性 测试时候再修改
    var _defaults= {

    };

    //默认调用kendo初始化方法
    var createkendoGrid = function(option) {
        /*获取filter属性信息*/
        var _modelConfiguration = {
            checkbox:{
                title:"<input type='checkbox' class='kendo-check-all' data-click='checkAll'/>",
                template: '<input type="checkbox" value=#=uid# class="kendo-check-box" />',
                width:'50px',
            },
            order:{
                title: "序号",
                template: "<span class='row-number'>#=++g_index#</span>",
                width:'50px',
            },
        }

        /*创建页面 model 模型*/
        var createModel = function(orginModel) {
            var _newModels = new Array();
            $.each(orginModel,function(index,elem) {
                if (!elem['column']) {
                    _newModels.push(elem);
                } else {
                    var _tmpModel = _modelConfiguration[elem['column']];
                    if (_tmpModel) {
                        _newModels.push(_tmpModel);
                    }
                }
            });
            return _newModels;
        };

        var _datasource = new kendo.data.DataSource({
            transport: {
                error:function() {
                    error(); //服务器异常处理
                },
                read: {
                    url: option['operation']['read'],
                    type: 'GET',
                },
                create:{
                    url: option['operation']['create'],
                    type: 'POST',
                },
                destroy:{
                    url: option['operation']['destroy'],
                    type:'GET',
                    dataType:"json",
                },
                update:{
                    url: option['operation']['update'],
                    type:'POST',
                    dataType:"json",
                },
                parameterMap: function (options, operation) {
                    if (operation === "read") {
                        options['filters'] = options['filter'] ? kendo.stringify(options['filter']) : "{}";
                    }
                    return options;
                },
            },
            schema:{
                model:{
                    id:option['id'],
                },
                data: function(response) {
                    console.log(response);
                    if (response['rows']) {
                        var _rows = response['rows'];
                        // 格式化输出
                        console.log(option['model']);
                        for (var i = 0 ; i < _rows.length ; i++) {
                            _rows[i]['createtime'] = new Date(_rows[i]['createtime']);
                        }
                        return response['rows'];
                    }

                    if (response.userdata['model']) {
                        return response.userdata['model'];
                    }
                    return response;
                },
                total:function(response) {
                    if (response.total) {
                        return response.total;
                    }
                },
            },
           // sort: { field: option['id'], dir: "desc" },
            batch:false,
            serverFiltering:true,
            pageSize: 10,
        });

        var _domId = option.domId; //获取id节点

        //设置配置信息
        $(_domId).data('option',option);

        var kendoGrid = $(_domId).kendoGrid({
            autoBind: true,
            dataSource: _datasource,
            columns:createModel(option['model']),
            dataBound: function(e) {
                // 页面更新后 checkbox 全选更新
                $(".kendo-check-all").get(0).checked = false;
            },
            dataBinding: function(e) {
                /** g_index 序号重新归 0**/
                window['g_index'] = 0;
            },
            sortable: true,
            pageable: {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            },
            toolbar: [
                {
                    template:kendo.template("<div id='toolbar'></div>"),
                }
            ]
        });

        //grid 上节点事件处理
        $(_domId).on("click",function(e){
            var _dom = this;
            var target = e.target || e.srcElement;
            var argus = Array.prototype.slice.call(arguments);
            argus.push(_dom);
            argus.push(option);
            var funcName = $(target).data('click');
            clicks[funcName] && clicks[funcName].apply(null,argus);
        });

        return kendoGrid;
    };

    //kendo查询模块
    // $.kendoquery = function (kendoGrid) {
    //     var _dataSoucres = kendoGrid.dataSource;
    //     // 查询信息处理
    //     $(".query-hubble-bubble").on("click",function(e) {
    //         var target = e.target || e.srcElement;
    //         if (target.className.indexOf("query-sure") > -1) {
    //             var _target = target;
    //             var filters = new Array();
    //             //  val为空不计入filter
    //             $("input.query-need").each(function(index,elem){
    //                 //如果结果不为空
    //                 var _elem = $(elem);
    //                 if (!_elem.val().trim()) {
    //                     filters.push({field:_elem.attr('name'),operator:_elem.data('query'),value:_elem.val()});
    //                 }
    //             });
    //             _dataSoucres.filter(filters);
    //         }
    //     });
    // };

    $.kendoinit = function(options) {
        var options = $.extend(_defaults,options);
        $.each(options,function(name,elem){
            // 获取kendoGrid
            var kendoGrid = createkendoGrid(elem).data('kendoGrid');
            //$.kendoquery(kendoGrid); //注册查询模块
        });
    }

})();