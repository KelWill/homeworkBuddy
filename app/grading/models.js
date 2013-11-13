homeworkBuddy.Models.Student = Backbone.Model.extend({
  initialize: function(){
    this.questions = new homeworkBuddy.Collections.StudentAnswers();
    //So that questions can update student grades
    this.questions.student = this;
  }, 

  defaults: {
    questionsCorrect: 0, 
    questionsAnswered: 0
  }, 

  updateTally: function(correct){
    this.set('questionsCorrect', this.get('questionsCorrect') + correct);
    this.set('questionsAnswered', this.get('questionsAnswered') + 1);
  }

});

homeworkBuddy.Models.Question = Backbone.Model.extend({
  initialize: function(){
    this.timesAnswered = 0; 
    this.timesCorrect = 0;
  },

  updateTally: function(correct){
    this.timesAnswered++;
    if (correct){
      this.timesCorrect++;
    }
  }
});

homeworkBuddy.Models.StudentAnswer = Backbone.Model.extend({});
