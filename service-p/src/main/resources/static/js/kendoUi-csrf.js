var csrf_header = $("meta[name='_csrf_header']").attr("content");
var _csrf_token = $("meta[name='_csrf_token']").attr("content");
var obj = {};
obj[csrf_header] = _csrf_token;

$.ajaxSetup({
	type: "POST" ,
	headers:obj,
    error: function(jqXHR, textStatus, errorMsg){ // 出错时默认的处理函数
    	alert("服务端发生异常");
    }
});

/* function XSRF_filter(dataSources) {
var _fliter = function(xhr){
    var _csrf_token=$("meta[name='_csrf_token']").attr("content");
    var _csrf_header=$("meta[name='_csrf_header']").attr("content");// any way to get
    xhr.setRequestHeader(_csrf_header, _csrf_token);
};

var _transport = dataSources.transport.options;

$.each(_transport,function(index,elem){
    $.extend(elem,{
        beforeSend: function (xhr) {
            var _csrf_token=$("meta[name='_csrf_token']").attr("content");
            var _csrf_header=$("meta[name='_csrf_header']").attr("content");// any way to get
            xhr.setRequestHeader(_csrf_header, _csrf_token);
        }
    })
})

return dataSources;
}

XSRF_filter(datasources); */