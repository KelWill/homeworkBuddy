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
    'teacher/create': 'renderCreate',
    'teacher/create/addquestions': 'addQuestions',
    'teacher/grade/:assignment': 'getGrades',
    'teacher/grade': 'grades',
    '': 'landing',
    'signup/student': 'signupStudent',
    'signup/teacher': 'signupTeacher', 
    'login/student': 'loginStudent', 
    'login/teacher': 'loginTeacher'
  },

  landing: function(){
    homeworkBuddy.signup = new homeworkBuddy.Views.LoginView({});
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

  renderCreate: function(){
    console.log('render create is running');
    homeworkBuddy.questionSet = new homeworkBuddy.Collections.QuestionSet({model: homeworkBuddy.Models.QuestionModel});
    homeworkBuddy.questionSetView = new homeworkBuddy.Views.QuestionSetView({collection: homeworkBuddy.questionSet});
    homeworkBuddy.hwCreationModel = new homeworkBuddy.Models.HWCreationModel();
    homeworkBuddy.hwCreationView = new homeworkBuddy.Views.HWCreationView({model: homeworkBuddy.hwCreationModel});
    $('.marketing').hide();
    $('#container').html(homeworkBuddy.hwCreationView.el);
  },

  //  This shows all the assignments that the teacher can "grade"
  grades: function(){
  },

  makeAssignment: function(){
    var router = this;
    console.log('Router is on makeAssignment, url is \'\'')
    $('#container').append(homeworkBuddy.hwCreationView.el);
  }, 

  addQuestions: function() {
    console.log('Router is on create/addquestions')
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
        console.log(data);
        $('.assignments').addClass('hide');
        $('#container').removeClass('hide');
        homeworkBuddy.createGradingView(data);
      }, 
      error: function(error){
        console.log("There was an error");
        console.log(error);
      }
    })
  }
});

//  This is the standard header/menu view for teachers
homeworkBuddy.Views.HeaderView = Backbone.View.extend({
  initialize: function(){
    this.$el.append(this.template({}));
    //$('#header').append(this.el)
    this.fetchAssignments();
  },

  className: "nav navbar-nav",

  events: {
    'click a.assignment': 'renderAssignment', 
    'click a.grades': 'navigateGrade', 
    'click a.createNew': 'navigateCreateNew'
  },

  navigateGrade: function(){
    $('.assignments').toggleClass('hide');
    $('#container').children().toggleClass('hide');
    homeworkBuddy.router.navigate('/grade', {trigger: true});
  }, 

  navigateCreateNew: function(){
    $('#container').children().removeClass('hide');
    $('.assignments').addClass('hide');
    homeworkBuddy.router.navigate('/create', {trigger: true});
  },

  template: _.template('\
    <li><a class = "createNew" href = "/teacher/create">Create New Homework!</a></li>\
    <li><a class = "grades" href = "/teacher/grades">Grades!</a></li>\
    <li><a href = "/logout" class = "logout">Logout</a></li>\
    <div class = "hide assignments"><ul><li>Try clicking again in a second, we\'re still fetching your data. Sorry!</li></ul></div>'),


  //  This fetches all the assignments that the teacher can grade
  //  This happens after page load
  fetchAssignments: function(){
    var view = this;
    var $list = view.$el.find('div.assignments ul');
    var linkTemplate = _.template('<li><a class = "assignment" href = "grade/<%=assignmentName%>"><%=assignmentName%></a></li>')
    $.ajax({
      method: "GET", 
      url: '/teacher/grade', 
      success: function(data){
        data = JSON.parse(data);
        console.log(data);
        $list.empty();
        if (!data.length){
          $list.append('<li>Make some homework first!</li>')
        }
        for (var i = 0; i < data.length; i++){
          $list.append(linkTemplate(data[i]));
        }
      }, 
      error: function(error){
        $list.empty();
        $list.append('<li>There was an error fetching your data. Are you logged in? <br><a class = "login" href = "/login">Login</a>');
        console.log(error)
      }
    })
  },

  renderAssignment: function(e){
    e.preventDefault();
    var url = e.target.href;
    this.model.getAssignment(url);
  }
});


$(document).ready(function () {
    'use strict';
    homeworkBuddy.init();
    $('.dropdown-toggle').dropdown();
  // Fix input element click problem
    $('.dropdown input, .dropdown label').click(function(e) {
      e.stopPropagation();
    });
    homeworkBuddy.router = new homeworkBuddy.Router();
    homeworkBuddy.router.header = new homeworkBuddy.Models.Header();
    homeworkBuddy.router.headerView = new homeworkBuddy.Views.HeaderView({model: homeworkBuddy.router.header});
    Backbone.history.start({pushState: true})
}); 