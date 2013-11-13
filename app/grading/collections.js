homeworkBuddy.Collections.AllQuestions = Backbone.Collection.extend({
  initialize: function(){
    this.breadcrumbs = {};
  }
});

homeworkBuddy.Collections.Students = Backbone.Collection.extend({
  initialize: function(){
    //store reference to model on breadcrumb for easier access
    this.breadcrumbs = {};
  }
})

homeworkBuddy.Collections.StudentAssignment = Backbone.Collection.extend({});

homeworkBuddy.Collections.StudentAnswers = Backbone.Collection.extend({
  initialize: function(){
    this.existingAnswers = {};
  },
  addQuestion: function(question){
    if (!this.existingAnswers[question.id_questions]){
      this.existingAnswers[question.id_questions] = true;
      delete question.name;
      this.add(question);
      homeworkBuddy.allQuestions.breadcrumbs[question.id_questions].updateTally(question.correct);
      this.student.updateTally(question.correct);
    }
  },
});
