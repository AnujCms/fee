

USE `schooldb`;
DROP procedure IF EXISTS `SQSP_CreateFeeStructure`;

DELIMITER $$
USE `schooldb`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `SQSP_CreateFeeStructure`(
        v_accountid text,
		v_class text,
		v_session text,
        v_january text,
		v_february text,
        v_march text,
        v_april text,
        v_may text,
		v_june text,
        v_july text,
        v_august text,
        v_september text,
        v_october text,
        v_november text,
        v_december text
)
BEGIN
INSERT INTO  feestructure(accountid, class, session, january, february, march, april, may, june, july, august, september, october, november, december) 
values(v_accountid, v_class, v_session, v_january, v_february, v_march, v_april, v_may, v_june, v_july, v_august, v_september, v_october, v_november, v_december);
END$$

DELIMITER ;

