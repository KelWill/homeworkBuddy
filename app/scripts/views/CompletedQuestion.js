homeworkBuddy.Views.CompletedQuestion = Backbone.View.extend({
  tagName: 'span',
  editing: false, 
  events: {
    'click': 'showQuestionCreation'
  },
  
  initialize: function(){
    this.model.on('questionEntered', function(){
      this.model.trigger('questionAdded', this);
    }, this);
  },

  showQuestionCreation: function(){
    this.editing = !this.editing;
    if (this.editing){
      this.model.trigger('editQuestion', this.model);
    } else {
      this.model.trigger('stopEdit', this.model);
    }
  },
  
  render: function(){
   this.$el.text( this.model.get('number') + '. ' + this.model.questionType + ' ');
   return this;
  } 

})