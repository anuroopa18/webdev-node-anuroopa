var mongoose = require('mongoose');
var enrollmentSchema = require('./enrollment.schema.server');
var enrollmentModel = mongoose.model('EnrollmentModel', enrollmentSchema);

function enrollStudentInSection(enrollment){
   return enrollmentModel.create(enrollment);
}

function deleteEnrollmentForSection(sectionId){
    return enrollmentModel.remove({section:sectionId}, function (err) {
    });
}

function findSectionsForStudent(studentId){
  return enrollmentModel.find({
      student:studentId
  }).populate('section')
  .exec();
}

function findCoursesForStudent(studentId){
    return enrollmentModel.find({
        student:studentId
    }).populate('course')
    .exec();
  }

module.exports ={
    enrollStudentInSection:enrollStudentInSection,
    findSectionsForStudent:findSectionsForStudent,
    findCoursesForStudent:findCoursesForStudent,
    deleteEnrollmentForSection:deleteEnrollmentForSection
};