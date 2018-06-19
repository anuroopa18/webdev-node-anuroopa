module.exports = function(app){
app.post('/api/course/:courseId/section', createSection);
app.get('/api/course/:courseId/section', findSectionsForCourse);
app.post('/api/course/:courseId/section/:sectionId/enrollment', enrollStudentInSection);
app.get('/api/student/section', findSectionsForStudent);
app.get('/api/student/course',findCoursesForStudent);
var sectionModel = require('../models/section/section.model.server');
var enrollmentModel = require('../models/enrollment/enrollment.model.server')

function findCoursesForStudent(req,res){
    var currentUser= req.session.user;
    var studentId = currentUser._id;
    enrollmentModel.findSectionsForStudent(studentId)
    .then(function(enrollments){
        res.json(enrollments);
    });
 }

function findSectionsForStudent(req,res){
   var currentUser= req.session.user;
   var studentId = currentUser._id;
   enrollmentModel.findSectionsForStudent(studentId)
   .then(function(enrollments){
       res.json(enrollments);
   });
}

function enrollStudentInSection(req,res){
   var sectionId = req.params.sectionId;
   var courseId = req.params.courseId;
   var currentUser = req.session.user;
   var studentId = currentUser._id;
   var enrollment = {
    student: studentId,
    section: sectionId,
    course: courseId
  };

   sectionModel.decrementSectionSeats(sectionId)
   .then(function(){
    return enrollmentModel
      .enrollStudentInSection(enrollment)
    })
    .then(function(enrollment){
        res.json(enrollment);
   });
  
}

function findSectionsForCourse(req,res){
    var courseId = req.params['courseId'];
    sectionModel.findSectionsForCourse(courseId)
    .then(function(sections){
        res.json(sections);
    })

}

function createSection(req,res){
    var section = req.body;
    sectionModel.createSection(section)
    .then(function(section) {
        res.json(section);
    })
}


};

