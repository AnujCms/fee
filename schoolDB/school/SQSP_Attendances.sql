USE `schooldb`;
DROP procedure IF EXISTS `SQSP_Attendances`;

DELIMITER $$
USE `schooldb`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `SQSP_Attendances`(v_teacherid int, v_studentid int, v_session int)
BEGIN
select * from attendance where teacherid = v_teacherid and studentid = v_studentid and session = v_session;
END$$

DELIMITER ;

