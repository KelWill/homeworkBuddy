homeworkBuddy.Views.LoginView = Backbone.View.extend({
  events: {
    'click button.signup.student': 'signupStudent',
    'click button.signup.teacher': 'signupTeacher',
    'click button.login': 'login'
  }
})