module.exports = function (app){
app.get('/api/user', findAllUsers);
app.post('/api/user', createUser);
app.get('/api/profile',profile);
app.post('/api/logout',logout);
app.post('/api/login',login);
app.get('/api/user/:userId',findUserById);
app.get('/api/users/:username',findUserByUsername);
app.put('/api/user',update);
app.get('/api/checkUserLogin',checkUserLogin)
var userModel = require('../models/user/user.model.server');

function checkUserLogin(req,res){
    var user = req.session.user;
    if(user !== undefined){
        res.send({msg:"User is logged in"});
    }
    else{
        res.send({msg:"User not logged in"});
    }
}

function update(req,res){
  var user = req.body;
  var sessionUser= req.session.user;
  if(sessionUser !== undefined){
    if((user.username!==null && user.username.length !== 0)  &&
       (user.firstName !== null && user.firstName.length !== 0) && 
       (user.lastName !==null && user.lastName.length !== 0 )&& 
       (user.email !== null && user.email.length !== 0 ) && 
       (user.phone !== null && user.phone.length !== 0 )
       && (user.address !== null && user.address.length !== 0)){  
        req.session.user = sessionUser;
  userModel.update(user,sessionUser).then(function(user){
    res.send(user);
})
       }

}
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
        if(user != null){
        req.session.user = user;
        res.send(user);
        }
        else{
            res.send({check:"User does not exist"})
        }
    })
}

function logout(req,res){
    req.session.destroy();
    res.send(200);
}

function profile(req,res) {
    var currentUser= req.session.user;
    console.log(currentUser._id);
  userModel.findUserById(currentUser._id).then(function(user){
      res.send(user);
  })
}

function findAllUsers(req,res){
  userModel.findAllUsers().then(function(users){
      res.send(users);
  })
}

function findUserByUsername(req,res){
    var username = req.params['username'];
  userModel.findUserByUsername(username).then(function(user){
    if(user.length > 0){
        res.send({errorMsg:"Username exists"})
    }else{
        res.send(user)
    }});  
  }

function createUser(req,res){
    var user = req.body;
    userModel.createUser(user).then(function(user){
        req.session.user = user;
        res.send(user);
    })

  }

}