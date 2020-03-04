USE `schooldb`;
DROP procedure IF EXISTS `SQSP_GetPatientlist`;

DELIMITER $$
USE `schooldb`$$
CREATE DEFINER=`admin`@`%` PROCEDURE `SQSP_GetPatientlist`(IN v_class text, v_section text, v_session text, v_userid text)
BEGIN 
select * from student where class = v_class and section = v_section and session = v_session and teacherid = v_userid;
 
 
END$$

DELIMITER ;

