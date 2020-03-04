USE `schooldb`;
DROP procedure IF EXISTS `SQSP_pramoteStudent`;

DELIMITER $$
USE `schooldb`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `SQSP_pramoteStudent`( v_studentid text, v_teacherid text, v_classteacherid text)
BEGIN
 update student set teacherid = v_classteacherid, section = 1, studenttype =1 where studentid = v_studentid and teacherid = v_teacherid ;
 
 END$$

DELIMITER ;

