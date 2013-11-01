homeworkBuddy.Views.ParagraphView = Backbone.View.extend({
  events: {
    'click a.paragraph': 'startQuestionSet',
  },

  initialize: function(){
    this.render();
  },

  template: _.template('<div class = "paragraph paragraph<%=id%>" > <%=text%> </div><div class = "insert question">\
                       <a href = "#" class = "paragraph paragraph<%=id%>" >Add some questions!</a></div>'),

  render: function(){
    //rendering a paragaph with the appropriate text and id. 
    this.$el.append(this.template(this.model.attributes));
  }, 

  startQuestionSet: function(){
    //hide the option to add a question
    this.$el.find('a.paragraph').hide();

    //create a new question set collection and view
    this.model.set('questionSet', new homeworkBuddy.Collections.QuestionSet());
    var questionSetView = new homeworkBuddy.Views.QuestionSetView({collection: this.model.get('questionSet')});

    //add the questionSetView to the paragraph DOM view element
    this.$el.append(questionSetView.el);

  }

});