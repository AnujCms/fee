USE `schooldb`;
DROP procedure IF EXISTS `SQSP_CreateEntrance`;

DELIMITER $$
USE `schooldb`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `SQSP_CreateEntrance`(
	
        v_fname text,
		v_lname text,
		v_cellno text,
        v_username text,
        v_password text,
		v_dob text,
        v_studenttype int,
        v_class int,
        v_userid int
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
INSERT INTO  student(firstname,lastname,dob,cellnumber,username,password,studenttype,class,teacherid) values(v_fname,v_lname,v_dob,v_cellno,v_username,v_password,v_studenttype,v_class,v_userid);
SET __id:= LAST_INSERT_ID();
SELECT __id AS studentid;


COMMIT;
END$$

DELIMITER ;

