USE `schooldb`;
DROP procedure IF EXISTS `SQSP_getTeacher`;

DELIMITER $$
USE `schooldb`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `SQSP_getTeacher`( v_classid text)
BEGIN
 select userid from doctor where class = v_classid  and section = 1;
 
 END$$

DELIMITER ;

