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
  `id` SMALLINT NULL AUTO_INCREMENT DEFAULT NULL,
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
  `id` SMALLINT NULL AUTO_INCREMENT DEFAULT NULL,
  `id_Teachers` SMALLINT NULL DEFAULT NULL,
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
  `id` SMALLINT NULL AUTO_INCREMENT DEFAULT NULL,
  `id_Assignments` INT NULL DEFAULT NULL,
  `QuestionText` BLOB NULL DEFAULT NULL,
  `QuestionAnswer` VARCHAR(10) NULL DEFAULT NULL,
  `paragraph_id` VARCHAR(30) NULL DEFAULT NULL,

  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `Paragraphs`;
    
CREATE TABLE `Paragraphs` (
  `id` SMALLINT NULL AUTO_INCREMENT DEFAULT NULL,
  `id_Assignments` SMALLINT NULL DEFAULT NULL,
  `text` BLOB NULL DEFAULT NULL,
  `paragraph_id` VARCHAR(30) NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'Student_Questions'
-- 
-- ---

DROP TABLE IF EXISTS `Student_Questions`;
    
CREATE TABLE `Student_Questions` (
  `id` SMALLINT NULL AUTO_INCREMENT DEFAULT NULL,
  `id_Questions` SMALLINT NULL DEFAULT NULL,
  `id_Students` SMALLINT NULL DEFAULT NULL,
  `LastAttempted` TIMESTAMP NULL DEFAULT NULL,
  `TimesAnswered` INT NULL DEFAULT NULL,
  `TimesCorrect` SMALLINT NULL DEFAULT NULL,
  `TimesIncorrect` SMALLINT NULL DEFAULT NULL,
  `NextScheduledAttempt` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'Students'
-- 
-- ---

DROP TABLE IF EXISTS `Students`;
    
CREATE TABLE `Students` (
  `id` SMALLINT NULL AUTO_INCREMENT DEFAULT NULL,
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

DROP TABLE IF EXISTS `Student_Teachers`;
    
CREATE TABLE `Student_Teachers` (
  `id` SMALLINT NULL AUTO_INCREMENT DEFAULT NULL,
  `id_Teachers` SMALLINT NULL DEFAULT NULL,
  `id_Students` SMALLINT NULL DEFAULT NULL,
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
ALTER TABLE `Student_Teachers` ADD FOREIGN KEY (id_Teachers) REFERENCES `Teachers` (`id`);
ALTER TABLE `Student_Teachers` ADD FOREIGN KEY (id_Students) REFERENCES `Students` (`id`);
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

-- INSERT INTO `Teachers` (`name`,`email`,`password_hash`,`password_salt`) VALUES
-- ('teacher','teacher','teacher','');
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

