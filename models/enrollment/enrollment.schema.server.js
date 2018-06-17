var mongoose = require('mongoose');
var enrollmentSchema = mongoose.Schema({
    sectionId:{type: mongoose.Schema.Types.ObjectId, ref:'SectionModel'},
    studentId:{type: mongoose.Schema.Types.ObjectId, ref:'User'},
    grade:String
});
module.exports = enrollmentSchema;