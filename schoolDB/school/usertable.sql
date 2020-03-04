CREATE TABLE `schooldb`.`userdetails` (
  `userid` INT NOT NULL AUTO_INCREMENT,
  `firstname` VARCHAR(45) NOT NULL,
  `lastname` VARCHAR(45) NOT NULL,
  `cellnumber` VARCHAR(45) NOT NULL,
  `dob` VARCHAR(45) NOT NULL,
  `emailid` VARCHAR(100) NULL,
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `status` INT NOT NULL,
  `userrole` INT NOT NULL,
  `gender` INT NOT NULL,
  `wrongpasswordcount` INT NULL,
  `passwordchangecount` INT NULL,
  `localaddress` VARCHAR(100) NOT NULL,
  `parmanentaddress` VARCHAR(100) NOT NULL,
  `classid` INT NULL,
  `section` INT NULL,
  `session` INT NULL,
  `images` MEDIUMTEXT NULL,
  `adharnumber` VARCHAR(10) NULL,
  `mothername` VARCHAR(45) NULL,
  `religion` INT NULL,
  `category` INT NULL,
  `locality` INT NULL,
  `subject` INT NULL,
  `qualification` INT NULL,
  `createddatetime` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `modifieddatetime` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`userid`));



ALTER TABLE `schooldb`.`userdetails` 
ADD UNIQUE INDEX `adharnumber_UNIQUE` (`adharnumber` ASC) VISIBLE,
ADD UNIQUE INDEX `emailid_UNIQUE` (`emailid` ASC) VISIBLE;
;
ALTER TABLE `schooldb`.`userdetails` 
CHANGE COLUMN `localaddress` `localaddress` VARCHAR(100) NULL ,
CHANGE COLUMN `parmanentaddress` `parmanentaddress` VARCHAR(100) NULL ;

ALTER TABLE `schooldb`.`userdetails` 
CHANGE COLUMN `dob` `dob` VARCHAR(45) NULL ;

ALTER TABLE `schooldb`.`userdetails` 
CHANGE COLUMN `gender` `gender` INT(11) NULL ;
ALTER TABLE `schooldb`.`userdetails` 
CHANGE COLUMN `gender` `gender` VARCHAR(10) NULL DEFAULT NULL ;

alter table userdetails add column mothername varchar(45) after adharnumber;

