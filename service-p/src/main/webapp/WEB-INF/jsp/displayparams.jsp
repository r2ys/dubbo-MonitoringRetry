<!DOCTYPE html>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%--<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>--%>
<head>
    <meta charset="UTF-8">
    <title>数据展示</title>

    <meta name="description" content="display of data">
    <meta name="author" content="jxy">
    <%--<meta name="robots" content="noindex, nofollow">--%>
    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1.0,user-scalable=no">
    <meta name="_csrf" content="${_csrf.token}" />
    <meta name="_csrf_header" content="${_csrf.headerName}" />
    <c:set var="ctx" value="${pageContext.request.contextPath}"/>
    <%--<base href=" <%=basePath%>">--%>

    <!-- Bootstrap and OneUI CSS framework -->
    <link rel="stylesheet" href="/static/assets/css/bootstrap.min.css">
    <link rel="stylesheet" id="css-main" href="/static/assets/css/oneui.css">

    <link rel="stylesheet" href="/static/kendo/css/kendo.common.min.css" />
    <link rel="stylesheet" href="/static/kendo/css/kendo.default.min.css" />
    <link rel="stylesheet" href="/static/kendo/css/kendo.default.mobile.min.css" />

    <script src="/static/kendo/js/jquery.min.js"></script>
    <script src="/static/kendo/js/kendo.all.min.js"></script>

    <style>
        .block-header{
            padding:10px 10px;
            background-color:#DCDCDC;
        }
        .nav-main a.nav-submenu:before{
            color:black;
        }

        #Conframe {
            height:530px;
            width: 100%;
        }
        .block-header{
            padding:10px 10px;
            background-color:#DCDCDC;
        }
        #dialog .form-control{
            height:20px;
        }

        #dialog .form-group{
            margin-bottom:10px;
        }

        #dialog .btn{
            padding:4px 12px;
        }
        .book,.search{
            color:#646464;
        }
        #search,#book{
            border-top-left-radius:5px;
            border-top-right-radius:5px;
        }
        #searchInfo{
            padding-bottom:0px;
            padding:5px 5px 5px;
            border-bottom-left-radius:5px;
            border-bottom-right-radius:5px;
        }
        #bookInfo{
            border-bottom-left-radius:5px;
            border-bottom-right-radius:5px;
        }

    </style>
</head>
<body>

<div id="container" class="sidebar-o side-scroll header-navbar-fixed">
   <div class="content content-boxed" style="padding:5px 5px 5px;">
       <%--<iframe name="Conframe" id="Conframe" frameborder="0"></iframe>--%>
       <%--查询条件--%>
       <div class="block block-opt-refresh-icon4" style="margin-bottom:7px;">
           <div class="block-header bg-gray-lighter" id="search">
               <a href="#" class="search"><i class="fa fa-caret-down fa-1x"></i>
                   <span class="block-title">查询条件</span></a>
           </div>
           <div class="block-content block-content-full" id="searchInfo">
               <div class="row form-horizontal" style="width:90%;">
                   <div>
                       <label class="col-md-1 control-label" style="width:8.5%;">唯一编码:</label>
                       <div class="col-md-2" style="padding-left:0px">
                           <input type="text" class="form-control" id="code"/>
                       </div>
                   </div>
                   <div>
                       <label class="col-md-1 control-label" style="width:8.5%;">接口名:</label>
                       <div class="col-md-2" style="padding-left:0px">
                           <input type="text" class="form-control" id="interface_name"/>
                       </div>
                   </div>
                   <div>
                       <label class="col-md-1 control-label" style="width:8.5%;">方法名:</label>
                       <div class="col-md-2" style="padding-left:0px">
                           <input type="text" class="form-control" id="method_name"/>
                       </div>
                   </div>
                   <div>
                       <div class="col-md-2" style="padding-left:0px">
                           <button class="btn btn-minw btn-info" type="button" id="searchBook">查询</button>
                       </div>
                   </div>
                   <div>
                       <div class="col-md-4">
                       </div>
                   </div>
               </div>
           </div>
       </div>
       <%-- END 查询条件--%>
       <%--grid start--%>
       <%--<input type="hidden" value="${ctx}" class="loadPath"/>--%>

       <div class="block block-opt-refresh-icon4">
           <div class="block-header bg-gray-lighter" id="book">
               <a href="#" class="book"><i class="fa fa-caret-down fa-1x"></i>
                   <span class="block-title">数据展示</span></a>
           </div>
           <div class="block-content block-content-full" id="bookInfo" style="padding:0px;">
               <div id="example">
                   <!-- 用于显示数据库中表的信息 -->
                   <div id="grid"></div>

                   <!-- updatedialog 修改弹窗   START-->
                   <div id="updatedialog" style="display:none;">
                       <div class="block-content block-content-narrow">
                           <form id="updateform" class="form-horizontal" action="#" method="post" onsubmit="return false;">
                               <div class="form-group">
                                   <label class="col-md-3 control-label">编号:</label>
                                   <div class="col-md-4">
                                       <input class="form-control" type="text" name="id" id="id_update" disabled="disabled"/>
                                   </div>
                               </div>
                               <div class="form-group">
                                   <label class="col-md-3 control-label">接口:</label>
                                   <div class="col-md-4">
                                       <input class="form-control" type="text" name="interface_name" id="interface_name_update" disabled="disabled"/>
                                   </div>
                               </div>
                               <div class="form-group">
                                   <label class="col-md-3 control-label">方法:</label>
                                   <div class="col-md-4">
                                       <input class="form-control" type="text" name="method_name" id="method_name_update" disabled="disabled"/>
                                   </div>
                               </div>
                               <div class="form-group">
                                   <label class="col-md-3 control-label">参数类型:</label>
                                   <div class="col-md-4">
                                       <input class="form-control" type="text" name="param_type" id="param_type_update" disabled="disabled"/>
                                   </div>
                               </div>
                               <div class="form-group">
                                   <label class="col-md-3 control-label">参数:</label>
                                   <div class="col-md-4">
                                       <input class="form-control" type="text" name="params" id="params_update" placeholder="请输入参数" required />
                                   </div>
                               </div>
                               <div class="form-group">
                                   <div class="col-md-4 col-md-offset-4">
                                       <button class="btn btn-info" type="submit" id="updateandsave">保存</button>
                                       <button class="btn btn-warning" type="button" id="cancelupdate" style="margin-left:5px;">取消</button>
                                   </div>
                               </div>
                           </form>
                       </div>
                   </div>
                   <!-- updatedialog 修改弹窗   END -->

               </div>
           </div>
       </div>
       <%--grid end--%>
   </div>
</div>
<!-- END Page Container -->

<!-- OneUI Core JS: jQuery, Bootstrap, slimScroll, scrollLock, Appear, CountTo, Placeholder, Cookie and App.js -->
<script src="/static/assets/js/core/bootstrap.min.js"></script>
<script src="/static/assets/js/core/jquery.slimscroll.min.js"></script>
<script src="/static/assets/js/core/jquery.scrollLock.min.js"></script>
<script src="/static/assets/js/core/jquery.appear.min.js"></script>
<script src="/static/assets/js/core/jquery.countTo.min.js"></script>
<script src="/static/assets/js/core/jquery.placeholder.min.js"></script>
<script src="/static/assets/js/core/js.cookie.min.js"></script>
<script src="/static/assets/js/app.js"></script>

<!-- Page JS Plugins -->
<script src="/static/assets/js/plugins/chartjs/Chart.min.js"></script>
<script src="/static/js/displayData/displayparams.js"></script>
<script>
    $(function(){

        $(".block").css('background','none');
        $(".nav-main").find("a i").css("color","black");
        $(".nav-main-heading").css("color","black");
        $(".nav-main").find("a").css("color","black");
        $(".block-title").css("text-transform",'none');
        $("#searchInfo").css('background','#fff');
        $("#bookInfo").css('background','#fff');

        //查询栏  展开/收起
        $("#search").click(function(){
            var state = $("#searchInfo").is(":hidden");
            if(state){
                $("#searchInfo").show();
                $(this).find("i").attr("class","fa fa-caret-down fa-1x");
            }else{
                $("#searchInfo").hide();
                $(this).find("i").attr("class","fa fa-caret-right fa-1x");
            }
        });
        //grid栏   展开/收起
        $("#book").click(function(){
            var state = $("#bookInfo").is(":hidden");
            if(state){
                $("#bookInfo").show();
                $(this).find("i").attr("class","fa fa-caret-down fa-1x");
            }else{
                $("#bookInfo").hide();
                $(this).find("i").attr("class","fa fa-caret-right fa-1x");
            }
        });
    });

</script>
</body>
</html>
