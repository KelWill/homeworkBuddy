window.homeworkBuddy = {
    Models: {},
    Collections: {},
    Views: {},
    Routers: {},
    templates: {},
    init: function () {
        'use strict';
    }
};

homeworkBuddy.Router = Backbone.Router.extend({
  routes: {
    'create': 'renderCreate',
    'create/addquestions': 'addQuestions',
    'grade/:assignment': 'getGrades',
    'grade': 'grades',
    '': 'makeAssignment'
  },

  initialize: function(){
    homeworkBuddy.questionSet = new homeworkBuddy.Collections.QuestionSet({model: homeworkBuddy.Models.QuestionModel});
    homeworkBuddy.questionSetView = new homeworkBuddy.Views.QuestionSetView({collection: homeworkBuddy.questionSet});
    homeworkBuddy.hwCreationModel = new homeworkBuddy.Models.HWCreationModel();
    homeworkBuddy.hwCreationView = new homeworkBuddy.Views.HWCreationView({model: homeworkBuddy.hwCreationModel});
  },

  grades: function(){
    $('.assignments').removeClass('hide');
  },

  makeAssignment: function(){
    var router = this;
    console.log('Router is on makeAssignment, url is \'\'')
    $('.container').append(homeworkBuddy.hwCreationView.el);

    //   Creating Header and Registering Events   //
    
  }, 

  renderCreate: function() {
    console.log("Router is on create running renderCreate");
  },

  addQuestions: function() {
    console.log('Router is on create/addquestions')
  },


  grade: function(assignmentName) {
    $.ajax({
      method: "GET",
      url: '/grade/' + assignmentName, 
      success: function(data){
        console.log(data);
      },
      error: function(error){
        console.log(error);
      }
    })
  }
});

homeworkBuddy.Models.Header = Backbone.Model.extend({
  getAssignment: function(url){
    $.ajax({
      method: "GET", 
      url: url, 
      success: function(data){
        console.log(data);
      }, 
      error: function(error){
        console.log(error);
      }
    })
  }
});

homeworkBuddy.Views.HeaderView = Backbone.View.extend({
  initialize: function(){
    this.$el.append(this.template({}));
    $('.header').append(this.el)
    this.fetchAssignments();
  },

  events: {
    'click a.assignment': 'renderAssignment', 
    'click button.grades': 'navigateGrade', 
    'click button.createNew': 'navigateCreateNew'
  },

  navigateGrade: function(){
    homeworkBuddy.router.navigate('/grade', {trigger: true});
  }, 

  navigateCreateNew: function(){
    homeworkBuddy.router.navigate('/create', {trigger: true});
  },

  template: _.template('\
    <div class = "header">\
    <a href = "#" class = "logout">Logout</a>\
    <button class = "createNew">Create New Homework!</button>\
    <button class = "grades">Grades!</button>\
    <div class = "hide assignments"><ul></ul></div>\
    </div>'),

  fetchAssignments: function(){
    var view = this;
    var linkTemplate = _.template('<li><a class = "assignment" href = "grades/<%=assignmentName%>"><%=assignmentName%></a></li>')
    $.ajax({
      method: "GET", 
      url: 'teacher/grade', 
      success: function(data){
        data = JSON.parse(data);
        console.log(data);
        var $list = view.$el.find('div.assignments ul');
        for (var i = 0; i < data.length; i++){
          $list.append(linkTemplate(data[i]));
        }
      }, 
      error: function(error){
        console.log(error)
      }
    })
  },

  renderAssignment: function(e){
    e.preventDefault();
    var url = e.target.href;
    this.model.getAssignment(url);
  }
})

$(document).ready(function () {
    'use strict';
    homeworkBuddy.init();
    homeworkBuddy.router = new homeworkBuddy.Router();
    homeworkBuddy.router.header = new homeworkBuddy.Models.Header();
    homeworkBuddy.router.headerView = new homeworkBuddy.Views.HeaderView({model: homeworkBuddy.router.header});
    Backbone.history.start({pushState: true, root: '/teacher'})
});