USE `schooldb`;
DROP procedure IF EXISTS `SQSP_GetStudentdetails`;

DELIMITER $$
USE `schooldb`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `SQSP_GetStudentdetails`(v_studentid text)
BEGIN
select * from userdetails where userid = v_studentid;
END$$

DELIMITER ;

