USE `schooldb`;
DROP procedure IF EXISTS `SQSP_CreateEntranceResult`;

DELIMITER $$
USE `schooldb`$$
CREATE PROCEDURE `SQSP_CreateEntranceResult` (
v_studentid text,
v_teacherid text,
v_totalmarks text,
v_obtainedmarks text,
v_status text
)
BEGIN
insert into entranceresult(studentid,teacherid,totalmarks,obtainedmarks,status)
values(v_studentid,v_teacherid,v_totalmarks,v_obtainedmarks,v_status);
END$$

DELIMITER ;