USE `schooldb`;
DROP procedure IF EXISTS `SQSP_GetStusentsForExamhead`;

DELIMITER $$
USE `schooldb`$$
CREATE DEFINER=`admin`@`%` PROCEDURE `SQSP_GetStusentsForExamhead`(v_teacherid text, v_classid text)
BEGIN
select s.studentid,s.firstname, s.lastname, s.cellnumber, s.dob, e.totalmarks, e.obtainedmarks, e.status from 
		student as s
inner join 
		entranceresult as e
ON s.teacherid = e.teacheridid  	


where s.teacherid = v_teacherid and s.class = v_classid;
END$$

DELIMITER ;
