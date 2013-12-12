homeworkBuddy = {
  Models: {}, 
  Views: {}, 
  Collections: {}
};
$(document).ready(function(){
  var currentParagraph = 0;
  var currentQuestion = 0;
  var textNotQuestions = true;

  //   Setting up the Router   //
  app = new (Backbone.Router.extend({
    url: document.URL,
    routes: {
      'student(/)'                              : 'student',
      'student/review(/)'                       : 'review',
      'student/:teacher/:assignment/p/:id(/)'   : 'showParagraph',
      'student/:teacher/:assignment/p/:id/q(/)' : 'showQuestions',
      'student/:teacher/:assignment(/)'         : 'renderAssignment'
    },

    renderAssignment: function(teacher, assignment){
      this.rootURL = '/student/' + teacher + '/' + assignment;
      $.ajax({
       method: 'get', 
       url: '/getassignment/' + teacher + '/' + assignment, 
       success: function(data){
         data = JSON.parse(data);
         var paragraphs = JSON.parse(data.paragraphs);
         var questions = JSON.parse(data.questions);
         router.createCollectionsAndViews(paragraphs, questions);
       }, 
       error: function(error){
         $('#container').prepend('<h4>' + error.responseText +'</h4>')
       }
      })
    },

    student: function(){
      homeworkBuddy.student.start();
    },

    review: function(){
      $('#container').children().detach();
      $.ajax({
        method: "GET", 
        url: '/student/review/getquestions', 
        success: function(data){
          data = JSON.parse(data);
          if (!data.length){
            $('#container').prepend('Looks like you\'re up to date on your review. Come back after you\'ve done more assignments');
            return
          }
          app.questionSet = new homeworkBuddy.Collections.QuestionSet();
          app.questionSetView = new homeworkBuddy.Views.QuestionSetView({collection: app.questionSet});
          for ( var i = 0; i < data.length; i++ ){
            var questionText = JSON.parse(data[i].QuestionText);
            var q = {};
            q.questionType = "MC";
            q.number = i + 1;
            q.question = questionText.question;
            q.answerOptions = questionText.answerOptions;
            q.correctAnswer = data[i].QuestionAnswer;
            q.questionId = data[i].id;
            q.streak = data[i].streak;
            app.questionSet.add(q);
          }
          app.questionSetView.addSubmit();
          $("#container").html('');
          $('#container').append(app.questionSetView.el);
        },
        error: function(error){
        }
      })
    }, 

    initialize: function(){
      router = this;
      $.ajax({
        method: "GET", 
        url: "/loggedin", 
        success: function(){
          router.loggedin = true;
          $('#loggedinHeader').removeClass('hide');
          $('#loggedoutHeader').addClass('hide');
        }, 
        error: function(){
          router.loggedin = false;
        }
      });
    },

    login: function(){
      var $header = $('#loggedoutHeader');
      var username = $header.find('.username').val();
      var password = $header.find('.password').val();
      $.ajax({
        method: "POST", 
        url: "/login/user?password=" + password + "&username=" +  username, 
        success: function(){
          $('#loggedinHeader').removeClass('hide');
          $('#loggedoutHeader').addClass('hide');

          //TODO refactor this to make it prettier
          $('#container').find('#myTeachers').find('.fetchTeachers').click();
          router.loggedin = true;
        }, 
        error: function(){
          $('#container').prepend('Username or password is incorrect');
        }
      })
    },

    createCollectionsAndViews: function(paragraphs, questions){
      this.urls = [];
      this.currentIndex = 0;

      this.assignment = new homeworkBuddy.Collections.Assignment({model: homeworkBuddy.Models.Paragraph});
      this.assignmentView = new homeworkBuddy.Views.AssignmentView({collection: this.assignment});
      var currentText = '';
      for ( var i = paragraphs.length - 1; i >= 0; i-- ){
        if (paragraphs[i].paragraph_id){
          var paragraph = new homeworkBuddy.Models.Paragraph(paragraphs[i]);
          this.assignment.add(paragraph);
          this.urls.push(paragraph.get('paragraph_id'));
        }
      }
      paragraph = this.assignment.at(0);
      for ( var i = 0; i < questions.length; i++ ) {
        var question = questions[i];

        //only search the collection for the new paragraph if the current paragraph isn't correct
        if (paragraph.get('paragraph_id') !== questions[i].paragraph_id) {
          paragraph = this.assignment.find(function(item){
            return item.get('paragraph_id') === questions[i].paragraph_id;
          });
        }
        paragraph.get('questionSet').push(question);
      }
      this.assignment.trigger('questionsAdded');
      this.navigate(this.rootURL + '/p/' + this.urls[this.currentIndex], {trigger: true});
    },

    showParagraph: function(teacher, assignment, paragraph_id){
      if (this.assignment){
        paragraph = this.assignment.find(function(p){
          return p.get('paragraph_id') + '' === paragraph_id + '';
        });
        paragraph.trigger('showMe');
      }
    },

    showQuestions: function(teacher, assignment, paragraph_id){
      if (this.assignment){
        paragraph = this.assignment.find(function(item){
          return item.get('paragraph_id') === paragraph_id;
        });
        paragraph.trigger('showQuestions');
      }
    }

  }));
  //End router

  homeworkBuddy.app = app;

  Backbone.history.start({pushState: true, silent: false});

});