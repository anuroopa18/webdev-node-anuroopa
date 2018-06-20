var mongoose = require('mongoose');
var sectionSchema = require('./section.schema.server');
var sectionModel = mongoose.model('SectionModel', sectionSchema);

function createSection(section) {
  return sectionModel.create(section);
}

function deleteSection(sectionId){
   return sectionModel.remove({_id: sectionId}, function (err) {
        });
}

function findSectionsForCourse(courseId){
  return sectionModel.find({courseId:courseId});
}

function findSectionById(sectionId){
    return sectionModel.findById(sectionId);
  }

function decrementSectionSeats(sectionId){
    return sectionModel.update({
    _id: sectionId
    },{
        $inc:{availableSeats: -1}
    })
}

function update(section,sectionId){
        return sectionModel.updateOne({_id:sectionId}, 
        { $set: { 
          name : section.name,
          seats: section.seats,
          availableSeats: section.availableSeats        
        }})
      
      
}

function incrementSectionSeats(sectionId){
    return sectionModel.update({
    _id: sectionId
    },{
        $inc:{availableSeats: +1}
    })
}

module.exports = {
    createSection: createSection,
    findSectionsForCourse:findSectionsForCourse,
    decrementSectionSeats:decrementSectionSeats,
    incrementSectionSeats:incrementSectionSeats,
    deleteSection:deleteSection,
    findSectionById:findSectionById,
    update:update
  };