CREATE DEFINER=`root`@`localhost` PROCEDURE `CSP_CreateResult`(
v_studentid int,
v_teacherid int,
v_maths int,
v_science int, 
v_hindi int, 
v_english int, 
v_physics int, 
v_chemistry int, 
v_history int, 
v_totalMarks int,
v_sum int,
v_persentage float)
BEGIN
insert into result(studentid, teacherid, math, science, hindi, english, physics, chemistry, history, totalMarks, obtainedmarks, persentage) values
(v_studentid, v_teacherid, v_maths, v_science, v_hindi, v_english, v_physics, v_chemistry, v_history, v_totalMarks , v_sum, v_persentage);
END

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
DECLARE __id integer;
DECLARE exit handler for sqlexception , sqlwarning
BEGIN 
    -- ERROR
    
ROLLBACK; 
RESIGNAL;
    
END;
  START TRANSACTION;
  -- insert into patient table 
INSERT INTO  feestructure(accountid, class, session, january, february, march, april, may, june, july, august, september, october, november, december) 
values(v_accountid, v_class, v_session, v_january, v_february, v_march, v_april, v_may, v_june, v_july, v_august, v_september, v_october, v_november, v_december);
SET __id:= LAST_INSERT_ID();
SELECT __id AS studentid;


COMMIT;
END



USE `schooldb`;
DROP procedure IF EXISTS `SQSP_CreateFeeStructure`;

DELIMITER $$
USE `schooldb`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `CSP_CreateResult`(
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

