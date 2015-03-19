

Meteor.startup(function() {

  Meteor.users.remove({});

  var users = [
     {name:"UserOne",email:"userOne@example.com", password: "passOne"},
     {name:"UserTwo",email:"userTwo@example.com", password: "passTwo"}
  ];

  _.each(users, function (user) {
    var id = Accounts.createUser({
      email: user.email,
      password: user.password,
      username : user.name
    });

  });

});