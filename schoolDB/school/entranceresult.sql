CREATE TABLE `schooldb`.`entranceresult` (
  `identranceresult` INT NOT NULL AUTO_INCREMENT,
  `studentid` INT NULL,
  `totalmarks` INT NULL,
  `obtainedmarks` INT NULL,
  `status` VARCHAR(45) NULL,
  PRIMARY KEY (`identranceresult`));
