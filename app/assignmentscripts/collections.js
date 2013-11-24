homeworkBuddy.Collections.QuestionSet = Backbone.Collection.extend({
  checkAndSubmit: function(){
    var results = [];
    this.forEach(function(question){
      var q = {};
      q.id = question.get('questionId');
      q.streak = question.get('streak');
      var selected = question.get('selected');
      var correctAnswer = question.get('correctAnswer');
      console.log("selected", selected);
      console.log("correctAnswer", correctAnswer);
      if (selected === correctAnswer){
        question.trigger('highlight', true, correctAnswer);
        q.correct = 1;
        q.streak = 1;
      } else {
        question.trigger('highlight', false, correctAnswer);
        q.correct = 0;
        q.correct = -q.streak;
      }
      results.push(q);
    });
    if (!this.submitted){
      this.submitted = true;
      $.ajax({
        method: "POST", 
        url: '/student/review', 
        contentType: 'application/json',
        data: JSON.stringify(results),
        success: function(){
          console.log('success');
        }, 
        error: function(error){
          console.log(error);
        }
      });
    }
  }
});

homeworkBuddy.Collections.Assignment = Backbone.Collection.extend();

