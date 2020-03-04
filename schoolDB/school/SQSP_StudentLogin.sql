USE `schooldb`;
DROP procedure IF EXISTS `SQSP_StudentLogin`;

DELIMITER $$
USE `schooldb`$$
CREATE DEFINER=`admin`@`%` PROCEDURE `SQSP_StudentLogin`(v_username text,v_password text, v_status text)
BEGIN
select s.studentid,s.firstname, s.lastname, s.cellnumber, s.dob, s.gender,s.studenttype,s.status,
s.teacherid,s.class,s.adharcard, d.userid as doctor_userid, d.firstname as doctor_firstname, d.lastname as doctor_lastname from 
		student as s
inner join 
		doctor as d
ON s.teacherid = d.userid  	

where s.username = v_username and s.password= v_password and s.status = v_status;
END$$

DELIMITER ;
