var mongoose = require('mongoose');
var userSchema = require('./user.schema.server');
var userModel = mongoose.model('UserModel',userSchema);

function findUserById(userId){
  return userModel.findById(userId);
}

function findUserByUsername(username){
  return userModel.find({username:username});
}

function createUser(user){
    return userModel.create(user);
}

function findAllUsers(){
    return userModel.find();
}

function findUserByCredentials(credentials){
  return userModel.findOne(credentials,{username:1});
}

function update(user,sessionUser){
  return userModel.save({_id:sessionUser._id}, 
  { $set: { 
    username : user.username ,
    firstName: user.firstName,
    lastName: user.lastName,
    email:user.email,
    phone:user.phone,
    address:user.address
  }})

}

var api ={
    createUser:createUser,
    findAllUsers:findAllUsers,
    findUserByCredentials:findUserByCredentials,
    findUserById:findUserById,
    findUserByUsername:findUserByUsername,
    update:update
    
}

module.exports =api;