USE `schooldb`;
DROP procedure IF EXISTS `SQSP_DeleteEntranceQuestion`;

DELIMITER $$
USE `schooldb`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `SQSP_DeleteEntranceQuestion`( v_questionid text, v_userid text )
BEGIN
 delete from entrancequestion where qid = v_questionid and userid = v_userid;
 END$$

DELIMITER ;