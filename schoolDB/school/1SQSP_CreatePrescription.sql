USE `schooldb`;
DROP procedure IF EXISTS `SQSP_CreatePrescription`;

DELIMITER $$
USE `schooldb`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `SQSP_CreatePrescription`(
	
        v_fname text,
		v_lname text,
		v_mname text,
        v_faname text,
		v_cellno text,
        v_username text,
        v_password text,
        v_st text,
		v_dob text,
        v_adharcard text,
        v_gender text,
        v_religion text,
        v_category text,
        v_locality text,
        v_locaddress text,
        v_paraddress text,
        v_userid int,
        v_class text,
        v_section text,
		v_session text,
        v_status text
        
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
INSERT INTO  student(firstname,lastname,dob,cellnumber,username,password,studenttype,teacherid,mothername,fathername,adharcard,gender,religion,category,locality,locaddress,paraddress,class,section,session,status) 
values(v_fname,v_lname,v_dob,v_cellno,v_username,v_password,v_st,v_userid,v_mname,v_faname,v_adharcard,v_gender,v_religion,v_category,v_locality,v_locaddress,v_paraddress,v_class,v_section,v_session,v_status);
SET __id:= LAST_INSERT_ID();
SELECT __id AS studentid;


COMMIT;
END$$

DELIMITER ;

