(function(){

    /***进行消息提示模块编写***/
    jQuery(function () {
        //初始化消息提示
        App.initHelpers('notify');
    });

    // _- 划线命名转化为驼峰命名 比如abc—abc => abcAbc
    var replaceWireToUpcase = function(str) {
        return str.replace(/[-_](\w)/g,function(match,name){
            if (match.length >1) {
                return name.toUpperCase();
            }
            return name;
        })
    }

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

    var deltpl = '<div class="kendo-del-message"><%=message%></div>'+
        '<div class="kendo-form-bottom">'+
        '<label><a href="javascript:;" class="query-sure"><%=name0%></a></label>'+
        '<label><a href="javascript:;" class="query-cancel"><%=name1%></a></label>'+
        '</div>';

    var delcompiled = _.template(deltpl);

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

    // 默认处理toolbar 处理函数
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
        //删除model接口 可实现checbox 多个删除
        kendoDeleteAction:function(e,dom) {
            var _selected = false;
            var option = $(dom).data('option');
            var kendoGrid = $(dom).data('kendoGrid');
            var _dataSoucres = kendoGrid.dataSource;
            var _html = delcompiled({message:"确认删除此数据么?",name0:'确定',name1:'取消'});
            var checkList = new Array(); //被选中的checkbox 数据列表
            $(dom).find(".kendo-check-box").each(function(index,elem){
                if (elem.checked) {
                    checkList.push($(elem).val());
                }
            });
            if (checkList.length > 0) {
                _selected = true;
                dialog({
                    title:"删除",
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
                                    _dataSoucres.pushDestroy(_model);
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
        /*kendoSaveChangesAction:function(e,dom) {
            var kendoGrid = $(dom).data('kendoGrid');
            var _dataSoucres = kendoGrid.dataSource;
            if (_dataSoucres.hasChanges()) {
                _dataSoucres.unbind("requestEnd");

            }
            return false;
        },*/
        kendoCancelChangesAction:function (e,dom) {
            var kendoGrid = $(dom).data('kendoGrid');
            var _dataSoucres = kendoGrid.dataSource;
            kendoGrid.cancelChanges();
            _dataSoucres.fetch();

        }
        // 从表回调信息
    };

    var _modelConfiguration = {
        checkbox:{
            title:"<input type='checkbox' class='kendo-check-all ' data-click='checkAll' /> ",
            template: '<input type="checkbox" value=#=uid# class="kendo-check-box win-none" style="text-align:center" />',
            width:'50px',
            attributes: {
                style: "text-align: center;"
            }
        },
        order:{
            title: "序号",
            template: "<label class='row-number win-none'>#=++g_index#</label>",
            width:'50px',
            attributes: {
                style: "text-align: center;"
            }
        },
    }


    var createkendoGrid = function(option) {

        /*创建页面 model 模型*/
        var createColumns = function(orginModel) {
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

        //实现 datasource
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
                    // contentType: "application/json",
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
                    if (operation === "update") {
                        $.each(option['model'],function(index,elem) {
                            if (elem['type']&&elem['type']['name'] === "datetime") {
                                options[elem['field']] = new Date( options[elem['field']]).getTime();
                            }
                        });
                    }

                    if (operation === "create") {
                        $.each(option['model'],function(index,elem) {
                            if (elem['type']&&elem['type']['name'] === "datetime") {
                                options[elem['field']] = new Date( options[elem['field']]).getTime();
                            }
                        });
                    }
                    return options;
                },
            },
            schema:{
                model:{
                    id:option['id'],
                    fields:option['fields'],
                },
                data: function(response) {
                    if (response['rows']) {
                        var _rows = response['rows'];

                        return _rows;
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
            batch:false,
            serverFiltering:true,
            serverPaging:option['serverPaging'],
            pageSize: 10,
        });

        var _domId = option.domId; //获取id节点

        //设置配置信息
        $(_domId).data('option',option);
        var _nowTime = new Date().getTime();
        var kendoGrid = $(_domId).kendoGrid({
            autoBind: true,
            dataSource: _datasource,
            columns:createColumns(option['model']),
            dataBound: function(e) {
                // 页面更新后 checkbox 全选框重置为空
                $(_domId +" .kendo-check-all").get(0).checked = false;
            },
            dataBinding: function(e) {
                /** g_index 序号重新归 0**/
                window['g_index'] = 0;
                $.each(option['model'],function(index,elem) {
                    if (elem['type']&&elem['type']['name'] === "datetime") {
                        for (var j = 0 ; j < e.items.length ; j++) {
                            var _time = e.items[j][elem['field']];
                            e.items[j][elem['field']] = _time ? new Date(_time) : new Date();
                        }
                    }
                });
            },
            sortable: true,
            scrollable:true,
            reorderable: true,
            resizable: true,
            pageable: {
                refresh: true,
                pageSizes: true,
                buttonCount: 5,
                pageSize:10,
            },
            toolbar: [
                {
                    template:kendo.template("<div id='grid_toolbar_"+_nowTime+"' class='grid_toolbar '></div>"),
                }
            ],
            editable: option['editable'],
        });


        //grid 上节点事件处理
        $(_domId).on("click",function(e){
            var _dom = $(_domId);
            var _target = e.target || e.srcElement;
            var argus = Array.prototype.slice.call(arguments);
            argus.push(_dom);
            argus.push(option);
            var funcName = $(_target).data('click');
            if (option[funcName]) {
                option[funcName].apply(null,argus);
            } else {
                clicks[funcName] && clicks[funcName].apply(null, argus);
            }
        });



        $(_domId).on("click",function(e) {
            var target = e.target || e.srcElement;
            if (target.className.indexOf("kendo-check-box") > -1) {
                if (target.checked) {
                    $(target).closest("tr").addClass("k-state-selected");
                } else {
                    $(target).closest("tr").removeClass("k-state-selected");
                }
            }
        });

        // $(_domId).find(".grid_toolbar").children().remove();
        // 初始化 toolbar
        setTimeout(function(){
            var toolbarItems = new Array(); //创建toolbar button
            if (option['toolbar']) {
                $.each(option['toolbar'],function(elem,value){
                   var clickFun = replaceWireToUpcase('kendo_'+elem+'_action');
                   var toolbarItem = { type: "button",attributes:{ "class":"kendo-xplat-"+elem}, template:kendo.template("<a class='k-button k-button-icontext k-grid-"+elem+"'  data-click='"+clickFun+"'  href='javascript:;' ><span class='k-icon k-"+value['icon']+"'></span>"+value['name']+"</a>")};
                    toolbarItems.push(toolbarItem);
                })
            }
            if (option['export']) {
                toolbarItems.push({
                    type:"button",
                        text:"导出PDF",
                    overflow:"always",
                    enable:true,
                    id:"export-pdf-grid",
                    icon: "pdf",
                    attributes:{"data-target":_domId},
                    click: function (e) {
                        var target = e.target;
                        var gridId = $(target).data('target');
                        $(gridId).data("kendoGrid").saveAsPDF();
                    }
                });
                toolbarItems.push({
                    type:"button",
                    text: "导出 EXCEL",
                    overflow:"always",
                    id:"export-excel-grid",
                    icon: "excel",
                    attributes:{"data-target":_domId},
                    click: function (e) {
                        var target = e.target;
                        var gridId = $(target).data('target');
                        $(gridId).data("kendoGrid").saveAsExcel();
                    }
                });
            }
         // toolBar 事件


            //$(".k-grid-toolbar").data("kendoToolBar").destroy();

            $(_domId).find('#grid_toolbar_' + _nowTime ).kendoToolBar({
                items:toolbarItems,
            });

            var _kendoGrid = $(_domId).data("kendoGrid");

            var _dataSoucres = _kendoGrid.dataSource;
            _dataSoucres.bind("requestEnd", function (e) {
                var response = e.response;
                var type = e.type;
                if (type === "create") {
                    if (response.userdata.status === 200) {
                        msg_top_success("添加成功");
                    } else {
                        msg_top_failed("添加失败");
                        _kendoGrid.cancelChanges();
                    }
                }
                return e;
            });

            _dataSoucres.bind("requestEnd", function (e) {
                var response = e.response;
                var type = e.type;
                if (type === "update") {
                    if (response.userdata.status === 200) {
                        msg_top_success("保存成功");
                    } else {
                        msg_top_failed("保存失败");
                        _kendoGrid.cancelChanges();
                    }
                }
                return e;
            });


            $(".k-grid-toolbar .k-icon").on("click",function(e){
                var _this = $(this);
                _this.closest("a").trigger("click");
            });
        },100);
    };

    var _defaults = {
        domId:"#grid1", //绑定节点
        // 配置进行展示, 不配置的类型不进行展示
        id:"id", //唯一的标识
        model:[
            {
                column:"checkbox",  //如果是checkbox  不进行数据查询  只需要配置{type:checkbox}
            },
            {
                column:"order",     //字段序号
            },
        ],
        // toolbar 所需要的功能toolbar
        toolbar:{
            add: {
                name:"新增",
                icon:"add",
            },
            // 保存toolbar
            "save-changes":{
                name:"保存",
                icon:'update',
            },
            // 取消 toolbar
            "cancel-changes":{
                name:"取消",
                icon:"cancel",
            },
            // 导出 toobar
            delete:{
                name:"删除",
                icon:"delete"
            }
        },
        export:true,  //导出excel 或者 PDF
        serverPaging:false,
        editable:"incell",
    };
    $.kendoinit = function(options) {
        $.each(options,function(name,elem){
            var option = $.extend({},_defaults,elem);
            // 获取kendoGrid
           createkendoGrid(option);
        });
    }

})();