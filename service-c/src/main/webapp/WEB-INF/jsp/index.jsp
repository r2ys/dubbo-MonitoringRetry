<!DOCTYPE html>
<html>
<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>主页</title>
<!--this is for normal upload 如果用到原生态的，请避免引入ace样式-->
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<body>
<a href="${ctx}/uflo/central" target="_blank"><i>控制中心</i></a><br>
<a href="${ctx}/uflo/todo" target="_blank"><i>待办任务</i></a><br>
<a href="${ctx}/uflo/calendar" target="_blank"><i>日历</i></a><br>
<a href="${ctx}/uflo/designer" target="_blank"><i>设计器</i></a>
</body>
</html>