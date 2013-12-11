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
    'teacher/create': 'teacherView',
    'teacher/create/addquestions': 'addQuestions',
    'teacher/grade/:assignment': 'getGrades',
    'teacher/grade': 'grades',
    '': 'landing',
    'login': 'login',
    'signedup': 'signedup',
    'signup/student': 'signupStudent',
    'signup/teacher': 'signupTeacher', 
    'login/student': 'loginStudent', 
    'login/teacher': 'loginTeacher',
  },

  login: function(){
    this.landing();
    homeworkBuddy.$container.children().detach();
    homeworkBuddy.$container.append('<h4>Either password or username was incorrect</h4>');
  },
  signedup: function(){
    this.landing();
    homeworkBuddy.$container.children().detach();
    homeworkBuddy.$container.append('<h4>You signed up successfully, please log in.</h4>');
  },

  teacherView: function(){
    if (!this.teacherViewInitialized){
      homeworkBuddy.questionSet = new homeworkBuddy.Collections.QuestionSet({model: homeworkBuddy.Models.QuestionModel});
      homeworkBuddy.questionSetView = new homeworkBuddy.Views.QuestionSetView({collection: homeworkBuddy.questionSet});
      homeworkBuddy.hwCreationModel = new homeworkBuddy.Models.HWCreationModel();
      homeworkBuddy.hwCreationView = new homeworkBuddy.Views.HWCreationView({model: homeworkBuddy.hwCreationModel});
      homeworkBuddy.$container.append(homeworkBuddy.hwCreationView.el);
      homeworkBuddy.router.header = new homeworkBuddy.Models.Header();
      homeworkBuddy.router.headerView = new homeworkBuddy.Views.HeaderView({model: homeworkBuddy.router.header});
      $('.marketing').hide();
      $('#header').append(this.headerView.el);
      this.teacherViewInitialized = true;
    } else {
      homeworkBuddy.$container.children().detach();
      homeworkBuddy.$container.append(homeworkBuddy.Views.HWCreationView.el);
    }
  },


  landing: function(){
    homeworkBuddy.signup = new homeworkBuddy.Views.LoginView({});
    homeworkBuddy.$container.html(homeworkBuddy.templates.base);
    $('.marketing').html(homeworkBuddy.templates.marketing);
    homeworkBuddy.signup.landing();
  },

  signOrLogin: function(){
    if (!homeworkBuddy.signupForm){
      homeworkBuddy.signupForm = new homeworkBuddy.Views.signupForm({});
    }
  },

  signupStudent: function(){
    this.signOrLogin();
    homeworkBuddy.signupForm.signupStudent();
  },

  signupTeacher: function(){
    this.signOrLogin();
    homeworkBuddy.signupForm.signupTeacher();
  },

  loginStudent: function(){
    this.signOrLogin();
    homeworkBuddy.signupForm.loginStudent();
  },

  loginTeacher: function(){
    this.signOrLogin();
    homeworkBuddy.signupForm.loginTeacher();
  },


  //  This shows all the assignments that the teacher can "grade"
  grades: function(){
  },

  makeAssignment: function(){
    var router = this;
    homeworkBuddy.$container.append(homeworkBuddy.hwCreationView.el);
  }, 

  addQuestions: function() {
  }
});

//  this gets student data and all the questions for an assignment
//  updates the router, and renders the grading view
homeworkBuddy.Models.Header = Backbone.Model.extend({
  getAssignment: function(url){
    $.ajax({
      method: "GET", 
      url: url, 
      success: function(data){
        homeworkBuddy.$container.children().detach();
        homeworkBuddy.createGradingView(data);
      }, 
      error: function(error){
      }
    })
  }
});

//  This is the standard header/menu view for teachers
homeworkBuddy.Views.HeaderView = Backbone.View.extend({
  initialize: function(){
    this.$el.append(this.template({}));
    this.fetchAssignments();
  },

  className: "nav navbar-nav",

  events: {
    'click a.grades': 'navigateGrade', 
    'click a.createNew': 'navigateCreateNew'
  },

  navigateGrade: function(){
    homeworkBuddy.$container.children().detach();
    homeworkBuddy.$container.append(homeworkBuddy.assignmentsListView.el);
    if (!this.onGrade){
      this.onGrade = true;
      homeworkBuddy.router.navigate('/teacher/grade');
    }

  }, 

  navigateCreateNew: function(){
    this.onGrade = false;
    homeworkBuddy.$container.children().detach();
    homeworkBuddy.$container.append(homeworkBuddy.hwCreationView.el);
    homeworkBuddy.router.navigate('/teacher/create');
  },

  template: _.template('\
    <li><a class = "createNew">Create New Homework!</a></li>\
    <li><a class = "grades">Grades!</a></li>\
    <li><a href = "/logout" class = "logout">Logout</a></li>'),

  //  This fetches all the assignments that the teacher can grade
  //  This happens after page load

  fetchAssignments: function(){
    var view = this;
    homeworkBuddy.assignmentsList = new homeworkBuddy.Models.AssignmentsList({})
    homeworkBuddy.assignmentsListView = new homeworkBuddy.Views.AssignmentsList({model: homeworkBuddy.assignmentsList});
    $.ajax({
      method: "GET", 
      url: '/teacher/grade', 
      success: function(data){
        data = JSON.parse(data);
        homeworkBuddy.assignmentsListView.createLinks(data);
      }, 
      error: function(error){
        homeworkBuddy.assignmentsListView.loggedIn();
        console.log(error)
      }
    })
  },

});

homeworkBuddy.Models.AssignmentsList = Backbone.Model.extend({});

homeworkBuddy.Views.AssignmentsList = Backbone.View.extend({
  createLinks: function(list){
    this.$el.empty();
    if (!list.length){
      this.$el.append('<li>Make some homework first!</li>')
    }
    for (var i = 0; i < list.length; i++){
      console.log(list[i])
      this.$el.append(this.linkTemplate(list[i]));
    }
  },

  loggedIn: function(){
    this.$el.html('<li>There was an error fetching your data. Are you logged in? <br><a class = "login" href = "/">Login</a>');
  },

  initialize: function(){
    this.$el.html('<ul><li>Try clicking again in a second, we\'re still fetching your data. Sorry!</li></ul>');
  },

  events: {
    'click a.assignment': 'renderAssignment'
  },

  linkTemplate: _.template('<li><a class = "assignment" href = "grade/<%=assignmentName%>"><%=assignmentName%></a></li>'),

 render: function(){
   return this;
 }, 

  renderAssignment: function(e){
    e.preventDefault();
    var url = e.target.href;
    homeworkBuddy.router.header.getAssignment(url);
  }
})


$(document).ready(function () {
    'use strict';
    homeworkBuddy.init();
    homeworkBuddy.$container = $('#container');
    homeworkBuddy.router = new homeworkBuddy.Router();
    Backbone.history.start({pushState: true})
});
