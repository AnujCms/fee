const router = require('express').Router();
const eventsDB = require("../database/EventsDB.js");
const UserEnum = require('../lookup/UserEnum');

const isPrincipal = function (req, res, next) {
    if (req.user.role === UserEnum.UserRoles.Principal) {
        return next();
    } else {
        return res.status(200).json({ status: 0, statusDescription: "Unauthenticted user." });
    }
}
const isStudentOrTeacheroraccounttantOrExamHead = function (req, res, next) {
    if (req.user.role === UserEnum.UserRoles.Student || req.user.role === UserEnum.UserRoles.Teacher || req.user.role === UserEnum.UserRoles.ExamHead || req.user.role === UserEnum.UserRoles.FeeAccount) {
        return next();
    } else {
        return res.status(200).json({ status: 0, statusDescription: "Unauthenticted user." });
    }
}
//save school event
router.post("/eventRegistration", isPrincipal, async function (req, res) {
    let eventData = {
        data: JSON.stringify([{ eventstartdate: req.body.eventstartdate, eventenddate: req.body.eventenddate, eventdetails: req.body.eventdetails, eventdescription:req.body.eventdescription }])
    }
    let eventsObjects = {
        eventname: req.body.eventname,
        accountid: req.user.accountid,
        userid: req.user.userid,
        eventData: eventData.data,
        eventtype: req.body.eventtype,
        session:JSON.parse(req.user.configdata).session
    }
    let result = await eventsDB.saveSchoolEvent(eventsObjects);
    if (result) {
        res.status(200).json({ status: 1, statusDescription: 'Event has been created successfully.' });
    } else {
        res.status(200).json({ status: 0, statusDescription: 'Event not created.' });
    }
});

//get events by event id
router.get("/geteventbyid/:eventid", isPrincipal, async function (req, res) {
let eventData = await eventsDB.getSchoolEventsById(req.params.eventid, req.user.accountid, req.user.userid, JSON.parse(req.user.configdata).session);
if(eventData.length>0){
    res.status(200).json({ status: 1, statusDescription: eventData });
}else{
    res.status(200).json({ status: 0, statusDescription: 'Not able to get the events details' });
}
})
//update school event
router.put("/updateevents/:eventid", isPrincipal, async function (req, res) {
    let eventData = {
        data: JSON.stringify([{ eventstartdate: req.body.eventstartdate, eventenddate: req.body.eventenddate, eventdetails: req.body.eventdetails, eventdescription:req.body.eventdescription }])
    }
    let eventsObjects = {
        eventname: req.body.eventname,
        eventtype: req.body.eventtype,
        accountid: req.user.accountid,
        userid: req.user.userid,
        eventData: eventData.data
    }
    let result = await eventsDB.updateSchoolEvent(eventsObjects,req.params.eventid, JSON.parse(req.user.configdata).session);
    if (result) {
        res.status(200).json({ status: 1, statusDescription: 'Event has been updated successfully.' });
    } else {
        res.status(200).json({ status: 0, statusDescription: 'Event not updated.' });
    }
});
//get school events
router.get("/getschoolevents", isPrincipal, async function (req, res) {
    let eventData = await eventsDB.getSchoolEvents(req.user.userid, req.user.accountid, JSON.parse(req.user.configdata).session);
    if(eventData.length>0){
        res.status(200).json({ status: 1, statusDescription: eventData });
    }else{
        res.status(200).json({ status: 0, statusDescription: 'Not able to get the events details' });
    }
    })

//get school events for student
router.get("/getschooleventsforstudent", isStudentOrTeacheroraccounttantOrExamHead, async function (req, res) {
    let eventData = await eventsDB.getSchoolEventsForStudent(req.user.accountid);
    if(eventData.length>0){
        res.status(200).json({ status: 1, statusDescription: eventData });
    }else{
        res.status(200).json({ status: 0, statusDescription: 'Not able to get the events details' });
    }
    })
//delete school events 
router.delete("/deleteevents/:eventid", isPrincipal, async function (req, res) {
    let eventData = await eventsDB.deleteSchoolEvents(req.user.userid, req.user.accountid, req.params.eventid, JSON.parse(req.user.configdata).session);
    if(eventData.affectedRows){
        res.status(200).json({ status: 1, statusDescription: "Selected event has been deleted successfully" });
    }else{
        res.status(200).json({ status: 0, statusDescription: 'Not able to delete event.' });
    }
    })
module.exports = router;