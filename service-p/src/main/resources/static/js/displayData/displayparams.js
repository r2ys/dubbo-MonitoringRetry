var header = $("meta[name='_csrf_header']").attr("content");
var token = $("meta[name='_csrf']").attr("content");
//var readurl = $(".loadPath").val();
var code;   //定义为全局变量
var interface_name;
var method_name;
var list = new Array();     //该集合用来存放选中的复选框中的数据

$(document).ready(function() {

    //kendoDataSource部分
    var dataSource = new kendo.data.DataSource({
        transport:{
            read:{
                url:"query",
                contentType:"application/json",
                dataType:"json",
                type:"POST"
            },
            parameterMap: function(options,optionions) {
                ifcheckbox();      //因为增加了复选框，所以要在进行操作之前先获取到选中的复选框
                var checkedvalue =  JSON.stringify(list);
                console.info("********"+checkedvalue);
                if(optionions=="destroy"){
                    return kendo.stringify(options.models);
                }
                if(optionions=="read"){
                    var parameter = {
                        code:code,
                        interface_name:interface_name,
                        method_name:method_name,
                        page:options.page,
                        pageSize:options.pageSize
                    }
                    return kendo.stringify(parameter);
                }
            }
        },
        requestEnd: function(e) {
            list=new Array();    //相当于每次请求之后将list集合清空（采用同样的变量名，相当于覆盖了前一个list集合）
            if (e.type != "read") {
                dataSource.read();
            }
        },
        batch: true,//开启批量操作
        pageSize:10,
        serverFiltering: false,
        serverPaging:true,      //开启服务端分页
        serverSorting:false,
        schema: {
            /*data:"data",
            total:"counts",*/      //如果这里的数量没有拿到，就不会显示表格下面的页码（上次total单词写错）
            model: {
                id:"id",
                fields: {
                    id: {
                        type:"int"
                    },
                    code: {
                        type: "string",
                        validation:{required:true}
                    },
                    interface_name:{
                        type:"string",
                        validation:{required:true}
                    },
                    method_name:{
                        type:"string",
                        validation:{required:true}
                    },
                    service_version: {
                        type:"string",
                        validation:{required:true}
                    },
                    service_group: {
                        type:"string",
                        validation:{required:true}
                    },
                    param_type: {
                        type:"string",
                        validation:{required:true}
                    },
                    params: {
                        type:"string",
                        validation:{required:true}
                    },
                    status: {
                        type:"string",
                        validation:{required:true}
                    },
                    exception: {
                        type:"string",
                        validation:{required:true}
                    },
                    exception_remark: {
                        type:"string",
                        validation:{required:true}
                    },
                    start_time: {
                        type:"data",
                        validation:{required:true},
                        filterable: false,
                        template: function (dataItem) {
                            return new Date(dataItem.start_time).toLocaleString()
                        }
                    },
                    end_time: {
                        type:"data",
                        validation:{required:true},
                        filterable: false,
                        template: function (dataItem) {
                            return new Date(dataItem.end_time).toLocaleString()
                        }
                    }
                }
            }
        }
    });
    //kendoDataSource部分   END

    //对grid表格进行初始化
    $("#grid").kendoGrid({
        dataSource:dataSource,
        navigatable:false, //开启回车暂存功能 (该属性只有列编辑功能开启了才有效)
        resizable:false, //用户是否可以通过拖拽列头的边缘调整列的宽度大小
        reorderable:true, //可以拖拽列重排序列
        sortable:true, //用户可以点击列头对列进行排序
        pageable: {
            //分页信息设置
            input: true,
            numeric: false,
            pageSizes:[5,10,20],
            //pageSizes:true,    //all,5,10,20
            //buttonCount: 3,    //设置最多显示的页数
            refresh: true,    //开启刷新按钮
            messages: {
                display: "{0} - {1} 共 {2} 条数据",
                empty: "没有数据",
                page: "页",
                of: "/ {0}",
                itemsPerPage: "条每页",
                first: "第一页",
                previous: "前一页",
                next: "下一页",
                last: "最后一页",
                refresh: "刷新"
            }
            // pageSize:10
        },
        selectable:"multiple row", //选中行时出现颜色，允许选中多行
        detailInit: detailInit,
        toolbar: [
            {id:"update",text:"修改"}
        ],
        columns: [
            {
                template:"<input type='checkbox' class='checkbox' />",
                title:"<input type='checkbox' id='checkboxIds' />",
                width:30
            },
            {   field: "id",
                title: "编号",
                width: "50px" },
            {
                field: "code",
                title: "唯一编码",
                width: "80px"
            },
            {
                field: "interface_name",
                title: "接口",
                width: "50px"
            },
            {
                field: "method_name",
                title: "方法",
                width: "50px"
            },
            {
                field: "service_version",
                title: "版本",
                width: "50px"
            },
            {
                field: "service_group",
                title: "分组",
                width: "50px"
            },
            {
                field: "param_type",
                title: "参数类型",
                width: "70px"
            },
            {
                field: "params",
                title: "参数",
                width: "50px"
            },
            {
                field: "status",
                title: "调用状态",
                width: "60px",
                template: function (dataItem) {
                    if (dataItem.status=="1")
                        return "成功";
                    else
                        return "失败";
                },
                height: 20
            },
            // {
            //     field: "exception",
            //     title: "异常信息",
            //     width: "60px"
            // },
            {
                field: "exception_remark",
                title: "异常中文",
                width: "60px"
            },
            {
                field: "start_time",
                title: "调用时间",
                width: "60px"
            },
            {
                field: "end_time",
                title: "结束时间",
                width: "60px"
            },
            {
                title: "操作",
                width: 100,
                command: [
                    {id:"retry",text:"重试", iconClass:"fa fa-refresh", click:function (e) {
                        var retry=e.currentTarget;
                        var tr=$(retry).parents("tr");
                        var tds = $(tr).children('td');
                        var code = tds.eq(3).text();
                        var param = JSON.stringify({code:code});
                        $.ajax({
                            url:"invoke?code="+code,
                            type:"GET",
                            contentType: 'application/json',
//                            beforeSend:beforeSend,
                            success:function(data){
                                //成功以后刷新数据
                                dataSource.read();
                                alert("执行成功");
                            }
                        });

                    } } ]

            }
        ],
        editable:false    //行编辑模式是否开启,只有设定为true，同一行的默认操作按钮才会生效  设定为false也会禁用了行编辑
    }).data("kendoGrid");

    //表示选中checkbox的全选按钮，下面的checkbox依次被选中
    $("#checkboxIds").on("click", function(){
        if($(this).is(":checked")){
            $("#grid table tr td input:checkbox").each(function(){
                $(this).prop("checked", true); //此处设置每行的checkbox选中，必须用prop方法
                //$(this).attr("value")  记录好每行的id
                $(this).closest("tr").addClass("k-state-selected");  //设置grid 每一行选中  //增加高亮
            });
        }else{
            $("#grid table tr td input:checkbox").each(function(){
                $(this).prop("checked", false); //此处设置每行的checkbox不选中，必须用prop方法
                //$(this).attr("value")  移除每行的id
                $(this).closest("tr").removeClass("k-state-selected");  //设置grid 每一行不选中
            });
        }
    });

    $("#searchBook").click(function(){
        dataSource.read();
    });


    //修改--弹窗   动作事件
    var upd = $("#updatedialog");

    //修改弹窗的取消按钮   动作事件
    $("#cancelupdate").click(function(){
        var updatedialog = upd.data("kendoWindow");
        updatedialog.close();
    });
    if (!upd.data("kendoWindow")) {
        upd.kendoWindow({
            modal:true,
            title: "修改数据信息",
            resizable: false,
            position:{
                top:100
            },
            width:"35%",
            height:"80%",
            pinned: true,
            visible: false
        })
    }

    //修改表单验证
    $("#updateform").kendoValidator({
        messages: {
            required: "字段不能为空",
        }
    });

    var grid = $("#grid").data("kendoGrid");
    grid.setDataSource(dataSource);    //将数据源绑定到grid上

    $("#code").kendoMaskedTextBox({
        change: function() {    //当内容发生变化时，所要执行的操作
            code = this.value();
            console.log(code); //value is the selected date in the maskedtextbox
        }
    });

    $("#interface_name").kendoMaskedTextBox({
        change:function(){
            interface_name = this.value();
            console.log(interface_name);
        }
    });

    $("#method_name").kendoMaskedTextBox({
        change:function(){
            method_name = this.value();
            console.log(method_name);
        }
    });

    //新增信息（自定义方法）
    $("#btn_save").kendoButton({
        click:function(){
            var bookname1 = $("#bookname1").val().trim();
            var price1 = $("#price1").val().trim();
            var author1 = $("#author1").val().trim();
            var press1 = $("#press1").val().trim();
            $.ajax({
                url:"${ctx}/bookstore/create",
                type:"POST",
                contentType:"application/json",
                data:JSON.stringify({bookname:bookname1,price:price1,author:author1,press:press1}),
                success:function(data){
                    $("#myform")[0].reset();
                    var dialog = wnd.data("kendoWindow");
                    dialog.close();
                    dataSource.read();
                }
            });
        }
    });

    //删除数据    动作事件
    $(".k-button:eq(2)").click(function(){
        ifcheckbox();     //查看是否有选中的复选框
        if(list.length>0){   //如果有选中的行才会进行删除
            deleteData();    //进行删除数据
        }
        dataSource.read();
    });

    //修改数据    动作事件
    $(".k-button:eq(1)").click(function(){
        ifcheckbox();
        //  判断是否有行被选中
        if(list.length==0 | list.length>1){
            alert("请选择一条记录!");
        }else{
            // 有行被选中，弹出修改数据框
            var updatedialog = upd.data("kendoWindow");
            var validator = $("#updateform").kendoValidator().data("kendoValidator");
            validator.hideMessages();
            updatedialog.open();
            updatedialog.center();
            $("#id_update").val(list[0].id);
            $("#bookname_update").val(list[0].bookname);
            $("#price_update").val(list[0].price);
            $("#author_update").val(list[0].author);
            $("#press_update").val(list[0].press);
        }
        dataSource.read();
    });

    //修改表单  提交数据
    $("#updateandsave").kendoButton({
        click:function(){
            var idupdatevalue = $("#id_update").val();
            var booknameupdatevalue = $("#bookname_update").val().trim();
            var priceupdatevalue = $("#price_update").val().trim();
            var authorupdatevalue = $("#author_update").val().trim();
            var pressupdatevalue = $("#press_update").val().trim();
            $.ajax({
                url:"${ctx}/bookstore/update",
                contentType:"application/json",
                type:"POST",
                data:JSON.stringify({id:idupdatevalue,bookname:booknameupdatevalue,price:priceupdatevalue,author:authorupdatevalue,press:pressupdatevalue}),
                success:function(data){
                    var updateandsavedialog = upd.data("kendoWindow");
                    updateandsavedialog.close();
                    dataSource.read();
                }

            })
        }
    })

});

//检查复选框是否被选中
function ifcheckbox(){
    $("input[type='checkbox']:checked").each(function(i){    //通过each方法遍历被选中的复选框
        var row = $(this).closest("tr"),    //$(this).closest("tr")表示选取离当前元素最近的tr元素（即该元素本身）
            grid = $("#grid").data("kendoGrid"),//获取表格数据
            dataItem = grid.dataItem(row);//获取选中行的数据
        list.push(dataItem);
    });
    console.info(list);
}
//删除数据  （自定义方法）
function deleteData(){
    $.ajax({
        url:"${ctx}/bookstore/delete",
        type:"POST",
        contentType:"application/json",
        data:JSON.stringify(list),
        success:function(){
            alert("删除成功！");
        },
        error:function(xhr, ajaxOptions, thrownError){
            alert("删除失败："+thrownError);
        }
    })
}

function detailInit(e) {
    $("<div/>").appendTo(e.detailCell).kendoGrid({
        dataSource: {
            transport: {
                read:{
                    url:"queryE",
                    contentType:"application/json",
                    dataType:"json",
                    type:"POST"
                },
                parameterMap: function(options,optionions) {
                    if(optionions=="read"){
                        var parameter = {
                            code:e.data.code
                        }
                        return JSON.stringify(parameter);
                    }
                }
            },
            pageSize: 1,
        },
        scrollable: true,
        height: 150,
        columns: [
            { field: "exception", title: "详细异常信息"}
        ]
    });
}
