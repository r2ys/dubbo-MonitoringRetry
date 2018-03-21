/*
Navicat MySQL Data Transfer

Source Server         : Black
Source Server Version : 50717
Source Host           : localhost:3306
Source Database       : oplat-uflo

Target Server Type    : MYSQL
Target Server Version : 50717
File Encoding         : 65001

Date: 2018-03-20 14:57:24
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
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;
