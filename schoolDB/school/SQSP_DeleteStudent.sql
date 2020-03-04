USE `schooldb`;
DROP procedure IF EXISTS `SQSP_DeleteStudent`;

DELIMITER $$
USE `schooldb`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `SQSP_DeleteStudent`( v_studentid text, v_userid text )
BEGIN
 delete from student where teacherid = v_userid and studentid = v_studentid;
 
 END$$

DELIMITER ;

