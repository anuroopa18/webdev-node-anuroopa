module.exports = function (app){
app.get('/api/user', findAllUsers);
app.post('/api/user', createUser);
app.get('/api/profile',profile);
app.post('/api/logout',logout);
app.post('/api/login',login);
app.get('/api/user/:userId',findUserById);
app.get('/api/users/:username',findUserByUsername);
app.put('/api/user',update)
var userModel = require('../models/user/user.model.server');


function update(req,res){
  var user = req.body;
  var sessionUser= req.session['currentUser'];
  if(sessionUser !== "undefined"){
  userModel.update(user,sessionUser).then(function(user){
    req.session['currentUser'] = user;
    res.send(user);
})}
}

function findUserById(req,res){
    var id = req.params['userId'];
    userModel.findUserById(id)
    .then(function(user){
        res.json(user);
    })
}

function login(req,res){
    var credentials =req.body;
    userModel.findUserByCredentials(credentials)
    .then(function(user){
        req.session['currentUser'] = user;
        res.json(user);
    })
}

function logout(req,res){
    req.session.destroy();
    res.send(200);
}

function profile(req,res) {
   res.send(req.session['currentUser']);
}

function findAllUsers(req,res){
  userModel.findAllUsers().then(function(users){
      res.send(users);
  })
}

function findUserByUsername(req,res){
    var username = req.params;
  userModel.findUserByUsername(username).then(function(user){
    res.send({
        errorMsg:"Username exists"
    });  
  })
}

function createUser(req,res){
    var user = req.body;
    userModel.createUser(user).then(function(user){
        req.session['currentUser'] = user;
        res.send(user);
    })

  }

}