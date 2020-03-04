
var UsersEnum = {};

    UsersEnum.UserRoles = {
        "SuperAdmin": 1,
        "Principal": 2,     
        "Teacher": 3,
        "ExamHead": 4,
        "FeeAccount": 5,
        "Student": 6,
        "EntranceStudent" : 7,
        "FirstTime": 8,
        "EntranceCompleted": 9
    }

    UsersEnum.UserStatus = {
        "Created":0,
        "Active": 1,
        "Inactive": 2,
        "Removed":3,
        "Locked": 4,
        "UnLocked": 5
    }

    UsersEnum.AccountStatus = {
        "Active": 1,
        "Inactive": 2,
        "Removed":3
    }

    UsersEnum.StudentStatusEnum = {
        "active": 1,
        "inactive": 2,
        "delete": 3
    }

 module.exports = UsersEnum;