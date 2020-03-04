USE `schooldb`;
DROP procedure IF EXISTS `SQSP_GetResults`;

DELIMITER $$
USE `schooldb`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `SQSP_GetResults`(v_teacherid int, v_studentid int, v_sessionid int, v_examtype int)
BEGIN
select * from result where  teacherid = v_teacherid and studentid = v_studentid and session = v_sessionid and examinationtype = v_examtype;
END$$

DELIMITER ;