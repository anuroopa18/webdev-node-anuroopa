module.exports = function (app) {
    app.post('/api/course/:courseId/section', createSection);
    app.get('/api/course/:courseId/section', findSectionsForCourse);
    app.post('/api/course/:courseId/section/:sectionId/enrollment', enrollStudentInSection);
    app.get('/api/student/section', findSectionsForStudent);
    app.get('/api/student/course', findCoursesForStudent);
    app.delete('/api/section/:sectionId', deleteSection);
    app.delete('/api/enrollment/:sectionId', deleteEnrollmentForSection);
    app.get('/api/sections/:sectionId', findSectionById);
    app.put('/api/section/update/:sectionId', update);
    app.delete('/api/unenroll/:sectionId',unenroll);
    var sectionModel = require('../models/section/section.model.server');
    var enrollmentModel = require('../models/enrollment/enrollment.model.server')

    section={};
    availableSeats=0;
    

    function update(req, res) {
        var section = req.body;
        var sectionId = req.params.sectionId;
        if (sectionId !== undefined) {
            if ((section.name !== null && section.name.length !== 0) &&
                (section.seats !== null && section.seats !== 0)) {
                    sectionModel.update(section,sectionId).then(function (section) {
                    res.send(section);
                })
            }

        }

    }

    function deleteEnrollmentForSection(req, res) {
        var sectionId = req.params.sectionId;
        enrollmentModel.deleteEnrollmentForSection(sectionId).
            then(() => res.send(200));
    }

    function findSectionById(req, res) {
        var sectionId = req.params.sectionId;
        sectionModel.findSectionById(sectionId)
            .then(function (section) {
                res.json(section);
            })

    }

    function deleteSection(req, res) {
        var sectionId = req.params.sectionId;
        sectionModel.deleteSection(sectionId).
            then(() => res.send(200));
    }

    function findCoursesForStudent(req, res) {
        var currentUser = req.session.user;
        var studentId = currentUser._id;
        enrollmentModel.findSectionsForStudent(studentId)
            .then(function (enrollments) {
                res.json(enrollments);
            });
    }

    function findSectionsForStudent(req, res) {
        var currentUser = req.session.user;
        var studentId = currentUser._id;
        enrollmentModel.findSectionsForStudent(studentId)
            .then(function (enrollments) {
                res.json(enrollments);
            });
    }

    function enrollStudentInSection(req, res) {
        var sectionId = req.params.sectionId;
        var courseId = req.params.courseId;
        var currentUser = req.session.user;
        var studentId = currentUser._id;
        var enrollment = {
            student: studentId,
            section: sectionId,
            course: courseId
        };

        sectionModel.findSectionById(sectionId)
        .then( section => this.section = section)
        .then( section => {
            this.availableSeats = section.availableSeats;
            if(availableSeats !== 0) {
                sectionModel.decrementSectionSeats(sectionId)
                .then(function () {
                    return enrollmentModel
                        .enrollStudentInSection(enrollment)
                })
                .then(function (enrollment) {
                    res.json(enrollment);
                })
            }
            else{
                res.send({msg:"Cannot enroll"})
            }
        })
        

    }

    function unenroll(req,res){
       var sectionId = req.params.sectionId;
       var currentUser = req.session.user;
       var studentId = currentUser._id;
       sectionModel.incrementSectionSeats(sectionId).
       then(function() {
           return enrollmentModel.unenroll(sectionId,studentId)
           .then(() => res.sendStatus(200))
       })

    }

    function findSectionsForCourse(req, res) {
        var courseId = req.params['courseId'];
        sectionModel.findSectionsForCourse(courseId)
            .then(function (sections) {
                res.json(sections);
            })

    }

    function createSection(req, res) {
        var section = req.body;
        sectionModel.createSection(section)
            .then(function (section) {
                res.json(section);
            })
    }


};

