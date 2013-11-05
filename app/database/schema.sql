
--might need to drop the whole database and then redo it


-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table 'Teachers'
-- 
-- ---

DROP TABLE IF EXISTS `Teachers`;
    
CREATE TABLE `Teachers` (
  `id` TINYINT NULL AUTO_INCREMENT DEFAULT NULL,
  `name` VARCHAR(30) NULL DEFAULT NULL,
  `email` VARCHAR(30) NULL DEFAULT NULL,
  `password_hash` VARCHAR(30) NULL DEFAULT NULL,
  `password_salt` VARCHAR(30) NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'Assignments'
-- 
-- ---

DROP TABLE IF EXISTS `Assignments`;
    
CREATE TABLE `Assignments` (
  `id` TINYINT NULL AUTO_INCREMENT DEFAULT NULL,
  `id_Teachers` TINYINT NULL DEFAULT NULL,
  `FileName` VARCHAR(30) NULL DEFAULT NULL,
  `assignmentName` VARCHAR(30),
  PRIMARY KEY (`id`)
);
  
-- ---
-- Table 'Questions'
-- 
-- ---

DROP TABLE IF EXISTS `Questions`;
    
CREATE TABLE `Questions` (
  `id` TINYINT NULL AUTO_INCREMENT DEFAULT NULL,
  `id_Assignments` TINYINT NULL DEFAULT NULL,
  `QuestionText` BLOB NULL DEFAULT NULL,
  `QuestionAnswer` VARCHAR(10) NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `Paragraphs`;
    
CREATE TABLE `Paragraphs` (
  `id` TINYINT NULL AUTO_INCREMENT DEFAULT NULL,
  `id_Assignments` TINYINT NULL DEFAULT NULL,
  `text` BLOB NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'Student_Questions'
-- 
-- ---

DROP TABLE IF EXISTS `Student_Questions`;
    
CREATE TABLE `Student_Questions` (
  `id` TINYINT NULL AUTO_INCREMENT DEFAULT NULL,
  `id_Questions` TINYINT NULL DEFAULT NULL,
  `id_Students` TINYINT NULL DEFAULT NULL,
  `LastAttempted` TIMESTAMP NULL DEFAULT NULL,
  `TimesAnswered` INT NULL DEFAULT NULL,
  `TimesCorrect` TINYINT NULL DEFAULT NULL,
  `TimesIncorrect` TINYINT NULL DEFAULT NULL,
  `NextScheduledAttempt` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'Students'
-- 
-- ---

DROP TABLE IF EXISTS `Students`;
    
CREATE TABLE `Students` (
  `id` TINYINT NULL AUTO_INCREMENT DEFAULT NULL,
  `name` VARCHAR(30) NULL DEFAULT NULL,
  `email` VARCHAR(30) NULL DEFAULT NULL,
  `password_hash` VARCHAR(30) NULL DEFAULT NULL,
  `password_salt` VARCHAR(30) NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'Classes (SS_Teachers)'
-- 
-- ---

DROP TABLE IF EXISTS `Classes (SS_Teachers)`;
    
CREATE TABLE `Classes (SS_Teachers)` (
  `id` TINYINT NULL AUTO_INCREMENT DEFAULT NULL,
  `id_Teachers` TINYINT NULL DEFAULT NULL,
  `id_Students` TINYINT NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Foreign Keys 
-- ---

ALTER TABLE `Assignments` ADD FOREIGN KEY (id_Teachers) REFERENCES `Teachers` (`id`);
ALTER TABLE `Paragraphs` ADD FOREIGN KEY (id_Assignments) REFERENCES `Assignments` (`id`);
ALTER TABLE `Questions` ADD FOREIGN KEY (id_Assignments) REFERENCES `Assignments` (`id`);
ALTER TABLE `Student_Questions` ADD FOREIGN KEY (id_Questions) REFERENCES `Questions` (`id`);
ALTER TABLE `Student_Questions` ADD FOREIGN KEY (id_Students) REFERENCES `Students` (`id`);
ALTER TABLE `Classes (SS_Teachers)` ADD FOREIGN KEY (id_Teachers) REFERENCES `Teachers` (`id`);
ALTER TABLE `Classes (SS_Teachers)` ADD FOREIGN KEY (id_Students) REFERENCES `Students` (`id`);
-- ---
-- Table Properties
-- ---

-- ALTER TABLE `Teachers` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `Assignments` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `Questions` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `Student_Questions` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `Students` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `Classes (SS_Teachers)` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO `Teachers` (`id`,`name`,`email`,`password_hash`,`password_salt`) VALUES
-- ('','','','','');
-- INSERT INTO `Assignments` (`id`,`id_Teachers`,`FileName`) VALUES
-- ('','','');
-- INSERT INTO `Questions` (`id`,`id_Assignments`,`QuestionText`,`QuestionAnswer`) VALUES
-- ('','','','');
-- INSERT INTO `Student_Questions` (`id`,`id_Questions`,`id_Students`,`LastAttempted`,`TimesAnswered`,`TimesCorrect`,`TimesIncorrect`,`NextScheduledAttempt`) VALUES
-- ('','','','','','','','');
-- INSERT INTO `Students` (`id`,`name`,`email`,`password_hash`,`password_salt`) VALUES
-- ('','','','','');
-- INSERT INTO `Classes (SS_Teachers)` (`id`,`id_Teachers`,`id_Students`) VALUES
-- ('','','');

