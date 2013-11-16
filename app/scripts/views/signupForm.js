homeworkBuddy.Views.signupForm = Backbone.View.extend({
  forms: homeworkBuddy.templates.formTemplate, 

  initialize: function(){
    $('#container').empty();
    this.$el.html(this.forms);
    $('#container').html(this.$el);
  },

  signupStudent: function(){
    this.$el.children().addClass('hide');
    this.$el.find('.signup.student').removeClass('hide');
  },

  loginStudent: function(){
    this.$el.children().addClass('hide');
    this.$el.find('.login.student').removeClass('hide');
  },

  signupTeacher: function(){
    this.$el.children().addClass('hide');
    this.$el.find('.signup.teacher').removeClass('hide');
  },

  loginTeacher: function(){
    this.$el.children().addClass('hide');
    this.$el.find('.login.teacher').removeClass('hide');
  },

});