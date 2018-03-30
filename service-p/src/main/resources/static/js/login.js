//刷新验证码
    var contextPath = getContextPath();

    $("#yzm").unbind("click").click(function () {
        $("#yzmpic").attr("src", "");
        $("#yzmpic").attr("src", contextPath+"/imagecode?"+new Date().getTime() );
    });

    $(function () {
        var authz = $('#authz_exception').val();
        var captcha = $('#captcha_exception').val();
        if(captcha){
           $("#showerrorId").attr("style", "display: block;");
           $("#showerrorTextId").text(captcha);
           return false;
        }
        if(authz){
           $("#showerrorId").attr("style", "display: block;");
           $("#showerrorTextId").text("用户名或者密码错误！");
        }
    });