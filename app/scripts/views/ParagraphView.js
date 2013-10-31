homeworkBuddy.Views.ParagraphView = Backbone.View.extend({
  events: {
    'click a.paragraph': 'startQuestionSet',
    'click a.question': 'addQuestion'
  },

  initialize: function(){
    this.render();
  },

  template: _.template('<div class = "paragraph paragraph<%=id%>" > <%=text%> </div><div class = "insert question">\
                       <a href = "#" class = "paragraph paragraph<%=id%>" >Add some questions!</a></div>'),

  render: function(){
    this.$el.append(this.template(this.model.attributes));
  }, 

  addQuestion: function(){
    this.$el.find('span.addQuestion').hide();
  },

  startQuestionSet: function(){
   //this starts the question set, and removes the option to start the question set. later can refactor to go back
    $(this.el).find('a.paragraph').remove();  

    var questionSet = new homeworkBuddy.Collections.QuestionSet();
    var questionSetView = new homeworkBuddy.Views.QuestionSetView({collection: questionSet});

    this.$el.append(questionSetView.el);

  }

});