USE `schooldb`;
DROP procedure IF EXISTS `SQSP_GetQuestionForEntrance`;

DELIMITER $$
USE `schooldb`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `SQSP_GetQuestionForEntrance`(v_teacherid text, v_classid text)
BEGIN
select * from entrancequestion where (userid = v_teacherid and class = v_classid);
END$$

DELIMITER ;

