/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50709
Source Host           : localhost:3306
Source Database       : attendance

Target Server Type    : MYSQL
Target Server Version : 50709
File Encoding         : 65001

Date: 2019-04-21 09:14:44
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for class_table
-- ----------------------------
DROP TABLE IF EXISTS `class_table`;
CREATE TABLE `class_table` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `createTime` datetime DEFAULT NULL,
  `userId` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=75 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for lesson_table
-- ----------------------------
DROP TABLE IF EXISTS `lesson_table`;
CREATE TABLE `lesson_table` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(128) DEFAULT NULL,
  `lesson_code` varchar(64) NOT NULL,
  `teach_time` varchar(256) DEFAULT NULL,
  `area` varchar(64) DEFAULT NULL,
  `createTime` datetime DEFAULT NULL,
  `attend_count` int(11) NOT NULL DEFAULT '0',
  `attend_sum` int(11) NOT NULL DEFAULT '0',
  `userId` int(11) NOT NULL,
  `attend_score` varchar(32) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=49 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for quest_table
-- ----------------------------
DROP TABLE IF EXISTS `quest_table`;
CREATE TABLE `quest_table` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `lesson_id` int(11) NOT NULL,
  `title` text NOT NULL,
  `question` text,
  `answer` text,
  `createTime` datetime NOT NULL,
  `userId` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for record_table
-- ----------------------------
DROP TABLE IF EXISTS `record_table`;
CREATE TABLE `record_table` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `lesson_id` int(11) NOT NULL,
  `series` int(11) NOT NULL,
  `Date` datetime NOT NULL,
  `attend_condition` int(3) NOT NULL,
  `is_quest` bit(1) NOT NULL,
  `userId` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=195 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for students_table
-- ----------------------------
DROP TABLE IF EXISTS `students_table`;
CREATE TABLE `students_table` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `student_code` varchar(16) NOT NULL,
  `name` varchar(32) NOT NULL,
  `class_id` int(11) NOT NULL,
  `lesson_ids` varchar(64) DEFAULT NULL,
  `createTime` datetime DEFAULT NULL,
  `userId` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=910 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for user_table
-- ----------------------------
DROP TABLE IF EXISTS `user_table`;
CREATE TABLE `user_table` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `login_name` varchar(64) NOT NULL,
  `password` varchar(32) NOT NULL,
  `role` int(11) NOT NULL,
  `createTime` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `login_name` (`login_name`)
) ENGINE=MyISAM AUTO_INCREMENT=72 DEFAULT CHARSET=utf8;
