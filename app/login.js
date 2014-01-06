homeworkBuddy.Views.LoginView = Backbone.View.extend({
  events: {
    'click a.signup.student': 'signupStudent',
    'click a.signup.teacher': 'signupTeacher',
    'click a.login.student': 'loginStudent', 
    'click a.login.teacher': 'loginTeacher', 
  }, 

  initialize: function(){
    $('#header').append(this.el);
  },

  className: "nav navbar-nav",

  landing: function(){
    this.$el.append('<li><a href = "http://hwbud.azurewebsites.net/student/hwbud/whyhwbud" class = "why landing">Why use HW bud?</a></li>');
    this.$el.append('<li><a href = "#" class = "login student landing">\
                    Student Login</a></li>');
    this.$el.append('<li><a href = "#" class = "signup student landing">Student Signup</a></li>');
    this.$el.append('<li><a href = "#" class = "login teacher landing">Teacher Login</a></li>');
    this.$el.append('<li><a href = "#"" class = "signup teacher landing">Teacher Signup</a></li>');
  },

  signupStudent: function(){
    homeworkBuddy.router.navigate('/signup/student', {trigger: true});
  },

  loginStudent: function(){
    homeworkBuddy.router.navigate('/login/student', {trigger: true});
  },


  signupTeacher: function(e){
    homeworkBuddy.router.navigate('/signup/teacher', {trigger: true});
  },

  loginTeacher: function(e){
    homeworkBuddy.router.navigate('/login/teacher', {trigger: true});
  },
}); 