USE `schooldb`;
DROP procedure IF EXISTS `SQSP_StudentLogin`;

DELIMITER $$
USE `schooldb`$$
CREATE DEFINER=`admin`@`%` PROCEDURE `SQSP_StudentLogin`(v_username text,v_password text, v_status text)
BEGIN
select studentid,firstname, lastname, cellnumber, dob, gender,studenttype,status,
 teacherid, class, adharcard

where username = v_username and password= v_password and status = v_status;
END$$

DELIMITER ;

