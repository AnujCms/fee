USE `schooldb`;
DROP procedure IF EXISTS `SQSP_GetQuestionByClass`;

DELIMITER $$
USE `schooldb`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `SQSP_GetQuestionByClass`(v_classid text, v_stydenttype text)
BEGIN
select * from entrancequestion where class = v_classid and studenttype = v_studenttpye ;
END$$

DELIMITER ;

