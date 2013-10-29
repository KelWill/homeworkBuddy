

$(document).ready(function(){
  homeworkBuddy.questionSet = new homeworkBuddy.Collections.QuestionSetCollection({model: homeworkBuddy.Models.QuestionModel});
  homeworkBuddy.questionSetView = new homeworkBuddy.Views.QuestionSetView({collection: homeworkBuddy.questionSet});
  console.log('document has been completely initialized....like a boss');
}); 