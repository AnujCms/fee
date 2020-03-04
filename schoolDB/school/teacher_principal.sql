CREATE TABLE `schooldb`.`teacher_principal` (
  `accountid` INT NOT NULL AUTO_INCREMENT,
  `userid` INT NOT NULL,
  `createddatetime` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `modifieddatetime` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`accountid`));

  ALTER TABLE `schooldb`.`teacher_principal` 
CHANGE COLUMN `accountid` `accountid` VARCHAR(100) NOT NULL ;
