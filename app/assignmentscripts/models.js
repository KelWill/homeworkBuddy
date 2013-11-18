homeworkBuddy.Models.Paragraph = Backbone.Model.extend({
  initialize: function(options){
    this.set('paragraph_id', options.paragraph_id); 
    this.set('text', options.text);
    this.set('questionSet', []);
  }
});

homeworkBuddy.Models.Question = Backbone.Model.extend({
  defaults: {
    'questionType': 'MC'
  },

  initialize: function(){
    this.set('answer', '');
  }, 
});