USE `schooldb`;
DROP procedure IF EXISTS `CSP_UpdateStudentData`;

DELIMITER $$
USE `schooldb`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `CSP_UpdateStudentData`(
		v_studentid int,
        v_fname text,
		v_lname text,
		v_mname text,
		v_faname text,
		v_cellnumber text,
		v_dob text,
		v_adharcard int,
		v_gender text,
		v_religion text,
        v_category text,
        v_locality text,
        v_locaddress text,
        v_paraddress text,
        v_teacherid text,
        v_classid text,
        v_section text,
        v_session text
        )
BEGIN
 UPDATE userdetails set firstname = v_fname, lastname = v_lname, mothername = v_mname, fathername = v_faname, cellnumber = v_cellnumber, adharnumber = v_adharcard,
 dob = v_dob, gender = v_gender, religion = v_religion, category = v_category, locality = v_locality, localaddress = v_locaddress, parmanentaddress = v_paraddress where userid = v_studentid and classid = v_classid and section = v_section and session = v_session;
 END$$

DELIMITER ;

