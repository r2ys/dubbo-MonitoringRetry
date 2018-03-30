/*
Navicat MySQL Data Transfer

Source Server         : Black
Source Server Version : 50717
Source Host           : localhost:3306
Source Database       : oplat-uflo

Target Server Type    : MYSQL
Target Server Version : 50717
File Encoding         : 65001

Date: 2018-03-30 14:57:35
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for dubboparams
-- ----------------------------
DROP TABLE IF EXISTS `dubboparams`;
CREATE TABLE `dubboparams` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL COMMENT '唯一编码',
  `interface_name` varchar(255) NOT NULL COMMENT '接口',
  `method_name` varchar(255) NOT NULL COMMENT '方法',
  `service_version` varchar(255) DEFAULT NULL,
  `service_group` varchar(255) DEFAULT NULL,
  `param_type` varchar(255) DEFAULT NULL COMMENT '参数类型',
  `params` varchar(255) DEFAULT NULL COMMENT '参数',
  `status` varchar(2) NOT NULL COMMENT '调用状态',
  `exception` longtext COMMENT '异常信息',
  `exception_remark` varchar(255) DEFAULT NULL COMMENT '异常中文',
  `start_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '调用时间',
  `end_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '结束时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dubboparams
-- ----------------------------
INSERT INTO `dubboparams` VALUES ('32', '297e4f06624251c70162425c51990003', 'com.ouyeel.provider.api.DemoApi1', 'test', '0.5', 'service_p', '[\"java.lang.String\",\"java.util.Map\"]', '[\"1\",{\"name\":\"zhangsan\",\"age\":\"25\"}]', '0', '{cause=null, stackTrace=[{methodName=test, fileName=DemoApi1Imp.java, lineNumber=18, className=com.ouyeel.provider.servicep.service.DemoApi1Imp, nativeMethod=false}, {methodName=invokeMethod, fileName=Wrapper1.java, lineNumber=-1, className=com.alibaba.dubbo.common.bytecode.Wrapper1, nativeMethod=false}, {methodName=doInvoke, fileName=JavassistProxyFactory.java, lineNumber=46, className=com.alibaba.dubbo.rpc.proxy.javassist.JavassistProxyFactory$1, nativeMethod=false}, {methodName=invoke, fileName=AbstractProxyInvoker.java, lineNumber=72, className=com.alibaba.dubbo.rpc.proxy.AbstractProxyInvoker, nativeMethod=false}, {methodName=invoke, fileName=InvokerWrapper.java, lineNumber=53, className=com.alibaba.dubbo.rpc.protocol.InvokerWrapper, nativeMethod=false}, {methodName=invoke, fileName=ProviderFilter.java, lineNumber=19, className=com.ouyeel.provider.servicep.filter.ProviderFilter, nativeMethod=false}, {methodName=invoke, fileName=ProtocolFilterWrapper.java, lineNumber=91, className=com.alibaba.dubbo.rpc.protocol.ProtocolFilterWrapper$1, nativeMethod=false}, {methodName=invoke, fileName=ExceptionFilter.java, lineNumber=64, className=com.alibaba.dubbo.rpc.filter.ExceptionFilter, nativeMethod=false}, {methodName=invoke, fileName=ProtocolFilterWrapper.java, lineNumber=91, className=com.alibaba.dubbo.rpc.protocol.ProtocolFilterWrapper$1, nativeMethod=false}, {methodName=invoke, fileName=MonitorFilter.java, lineNumber=75, className=com.alibaba.dubbo.monitor.support.MonitorFilter, nativeMethod=false}, {methodName=invoke, fileName=ProtocolFilterWrapper.java, lineNumber=91, className=com.alibaba.dubbo.rpc.protocol.ProtocolFilterWrapper$1, nativeMethod=false}, {methodName=invoke, fileName=TimeoutFilter.java, lineNumber=42, className=com.alibaba.dubbo.rpc.filter.TimeoutFilter, nativeMethod=false}, {methodName=invoke, fileName=ProtocolFilterWrapper.java, lineNumber=91, className=com.alibaba.dubbo.rpc.protocol.ProtocolFilterWrapper$1, nativeMethod=false}, {methodName=invoke, fileName=TraceFilter.java, lineNumber=78, className=com.alibaba.dubbo.rpc.protocol.dubbo.filter.TraceFilter, nativeMethod=false}, {methodName=invoke, fileName=ProtocolFilterWrapper.java, lineNumber=91, className=com.alibaba.dubbo.rpc.protocol.ProtocolFilterWrapper$1, nativeMethod=false}, {methodName=invoke, fileName=ContextFilter.java, lineNumber=70, className=com.alibaba.dubbo.rpc.filter.ContextFilter, nativeMethod=false}, {methodName=invoke, fileName=ProtocolFilterWrapper.java, lineNumber=91, className=com.alibaba.dubbo.rpc.protocol.ProtocolFilterWrapper$1, nativeMethod=false}, {methodName=invoke, fileName=GenericFilter.java, lineNumber=132, className=com.alibaba.dubbo.rpc.filter.GenericFilter, nativeMethod=false}, {methodName=invoke, fileName=ProtocolFilterWrapper.java, lineNumber=91, className=com.alibaba.dubbo.rpc.protocol.ProtocolFilterWrapper$1, nativeMethod=false}, {methodName=invoke, fileName=ClassLoaderFilter.java, lineNumber=38, className=com.alibaba.dubbo.rpc.filter.ClassLoaderFilter, nativeMethod=false}, {methodName=invoke, fileName=ProtocolFilterWrapper.java, lineNumber=91, className=com.alibaba.dubbo.rpc.protocol.ProtocolFilterWrapper$1, nativeMethod=false}, {methodName=invoke, fileName=EchoFilter.java, lineNumber=38, className=com.alibaba.dubbo.rpc.filter.EchoFilter, nativeMethod=false}, {methodName=invoke, fileName=ProtocolFilterWrapper.java, lineNumber=91, className=com.alibaba.dubbo.rpc.protocol.ProtocolFilterWrapper$1, nativeMethod=false}, {methodName=reply, fileName=DubboProtocol.java, lineNumber=108, className=com.alibaba.dubbo.rpc.protocol.dubbo.DubboProtocol$1, nativeMethod=false}, {methodName=handleRequest, fileName=HeaderExchangeHandler.java, lineNumber=84, className=com.alibaba.dubbo.remoting.exchange.support.header.HeaderExchangeHandler, nativeMethod=false}, {methodName=received, fileName=HeaderExchangeHandler.java, lineNumber=170, className=com.alibaba.dubbo.remoting.exchange.support.header.HeaderExchangeHandler, nativeMethod=false}, {methodName=received, fileName=DecodeHandler.java, lineNumber=52, className=com.alibaba.dubbo.remoting.transport.DecodeHandler, nativeMethod=false}, {methodName=run, fileName=ChannelEventRunnable.java, lineNumber=82, className=com.alibaba.dubbo.remoting.transport.dispatcher.ChannelEventRunnable, nativeMethod=false}, {methodName=runWorker, fileName=ThreadPoolExecutor.java, lineNumber=1142, className=java.util.concurrent.ThreadPoolExecutor, nativeMethod=false}, {methodName=run, fileName=ThreadPoolExecutor.java, lineNumber=617, className=java.util.concurrent.ThreadPoolExecutor$Worker, nativeMethod=false}, {methodName=run, fileName=Thread.java, lineNumber=745, className=java.lang.Thread, nativeMethod=false}], localizedMessage=测试, message=测试, suppressed=[]}', '测试', '2018-03-20 15:42:49', '2018-03-20 15:42:49');
