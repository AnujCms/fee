CREATE TABLE `schooldb`.`entrancequestion` (
  `qid` INT NOT NULL AUTO_INCREMENT,
  `questionnumber` INT NULL,
  `question` VARCHAR(300) NULL,
  `optiona` VARCHAR(45) NULL,
  `optionb` VARCHAR(45) NULL,
  `optionc` VARCHAR(45) NULL,
  `optiond` VARCHAR(45) NULL,
  `answer` VARCHAR(45) NULL,
  `userid` VARCHAR(45) NULL,
  PRIMARY KEY (`qid`));
