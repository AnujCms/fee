USE `schooldb`;
DROP procedure IF EXISTS `SQSP_CreateEntranceQuestion`;

DELIMITER $$
USE `schooldb`$$
CREATE PROCEDURE `SQSP_CreateEntranceQuestion` (
v_question text,
v_optiona text,
v_optionb text,
v_optionc text,
v_optiond text,
v_answer text,
v_class text,
v_subject text,
v_userid text
)
BEGIN
insert into entrancequestion(question,optiona,optionb,optionc,optiond,answer,class,subject,userid)
values(v_question,v_optiona,v_optionb,v_optionc,v_optiond,v_answer,v_class,v_subject,v_userid);
END$$

DELIMITER ;
