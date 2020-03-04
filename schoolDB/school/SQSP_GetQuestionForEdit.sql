USE `schooldb`;
DROP procedure IF EXISTS `SQSP_GetQuestionForEdit`;

DELIMITER $$
USE `schooldb`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `SQSP_GetQuestionForEdit`(v_teacherid text, v_questionid text)
BEGIN
select * from entrancequestion where (userid = v_teacherid and qid = v_questionid);
END$$

DELIMITER ;

