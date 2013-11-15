homeworkBuddy.Views.GradingQuestionView = Backbone.View.extend({
  className: "grading"
});

homeworkBuddy.Views.GradingMCQuestionView = homeworkBuddy.Views.GradingQuestionView.extend({
   initialize: function(){
     this.model.on('addPercentageCorrect', function(){
       this.renderPercent();
     }, this);

     this.model.on('studentAnswers', function(studentAnswer){
      this.studentAnswers(studentAnswer);
    }, this);
   },

   studentAnswers: function(studentAnswer){
     this.$el.find('.answer.option').removeClass("correct").removeClass('incorrect');
     if (studentAnswer.get('correct')){
       this.$el.find('.' + studentAnswer.get('StudentAnswer')).addClass('correct');
     } else {
       this.$el.find('.' + studentAnswer.get('StudentAnswer')).addClass('incorrect');
     }
   },

   questionTemplate: _.template('<h4><%= number %>. <%= question %></h4>\
     <div class = "A answer option">A: <%= answerOptions[0] %></div>\
     <div class = "B answer option">B: <%= answerOptions[1] %></div>\
     <div class = "C answer option">C: <%= answerOptions[2] %></div>\
     <div class = "D answer option">D: <%= answerOptions[3] %></div>\
     <div class = "answer option correctAnswer"><% if (QuestionAnswer) { print ("Correct Answer: " + QuestionAnswer) } %></div>\
     <div class = "percentageCorrect answer option"></div>'
     ),

   percentTemplate: _.template('<% if (timesAnswered) { print("Pecentage Correct: " + (timesCorrect/timesAnswered * 100) + "%") }%>'),

   render: function(){
     this.$el.append(this.questionTemplate(this.model.attributes));
     this.renderPercent();
     return this;
   },
   renderPercent: function(){
     this.$el.find('.percentageCorrect').html(this.percentTemplate(this.model));
    }
 });

homeworkBuddy.Views.GradingShortAnswerQuestionView = homeworkBuddy.Views.GradingQuestionView.extend({
   initialize: function(){
     this.model.on('studentAnswers', function(studentAnswer){
      this.studentAnswers(studentAnswer);
     }, this);
   },
   questionTemplate: _.template('<h4><%= number %>. <%= question %></h4>\
     <textarea class = "answer" value = "<%= QuestionAnswer %>" />'), 

   studentAnswers: function(studentAnswer){
     this.$el.find('.answer').text(studentAnswer.get('StudentAnswer'));
   },

   render: function(){
     this.$el.append(this.questionTemplate(this.model.attributes));
     return this;
   }
 });

homeworkBuddy.Views.GradingFillBlankQuestionView = homeworkBuddy.Views.GradingQuestionView.extend({
   initialize: function(){
     this.model.on('studentAnswers', function(studentAnswer){
      this.studentAnswers(studentAnswer);
     }, this);
   },

   studentAnswers: function(studentAnswer){
     var $answer = this.$el.find(".answer");
     $answer.val(studentAnswer.get('StudentAnswer'));
   },

   questionTemplate: _.template('<h4><%= number %>. <%= preText %><input type = "text" class = "answer" value = "<%=QuestionAnswer%>"><%= postText %></h4>'),

   render: function(){
     this.$el.append(this.questionTemplate(this.model.attributes));
     return this;
   }
 }); 