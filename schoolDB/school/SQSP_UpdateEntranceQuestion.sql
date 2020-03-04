USE `schooldb`;
DROP procedure IF EXISTS `SQSP_UpdateEntranceQuestion`;

DELIMITER $$
USE `schooldb`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `SQSP_UpdateEntranceQuestion`(
		v_question text,
v_optiona text,
v_optionb text,
v_optionc text,
v_optiond text,
v_optione text,
v_answer text,
v_class text,
v_subject text,
v_userid text,
v_questionid text)
BEGIN
 UPDATE entrancequestion set question = v_question, optiona = v_optiona, optionb = v_optionb, optionc = v_optionc, optiond = v_optiond,
 optione = v_optione, answer = v_answer, class = v_class, subject = v_subject where userid = v_userid and qid = v_questionid;
 END$$

DELIMITER ;