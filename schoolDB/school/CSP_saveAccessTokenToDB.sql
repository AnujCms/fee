USE `schooldb`;
DROP procedure IF EXISTS `CSP_saveAccessTokenToDB`;

DELIMITER $$
USE `schooldb`$$
CREATE DEFINER=`admin`@`%` PROCEDURE `CSP_saveAccessTokenToDB`(v_studentid integer, v_accesstoken text, v_clientid text)
BEGIN

IF EXISTS(SELECT 1 FROM authentication where studentid = v_studentid) THEN
	UPDATE authentication SET accesstoken = v_accesstoken where studentid = v_studentid;
ELSE 
	INSERT INTO authentication(studentid,accesstoken,clientid) values(v_studentid, v_accesstoken, v_clientid);
END IF;
SELECT ROW_COUNT() as affected_rows;
END$$

DELIMITER ;

