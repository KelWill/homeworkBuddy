homeworkBuddy.Views.CompletedQuestion = Backbone.View.extend({
  tagName: 'span',
  editing: false, 
  events: {
    'click': 'showQuestionCreation'
  },
  
  initialize: function(){
    this.model.on('stopEdit', function(){
      this.editing = false;
    }, this)
  },

  showQuestionCreation: function(){
    if (!this.editing){
      this.editing = true;
      this.model.trigger('editQuestion', this.model);
    } else {
      this.model.trigger('stopEdit', this.model);
    }
  },
  
  render: function(){
   this.$el.text( this.model.get('number') + '. ' + this.model.questionText + ' ');
   this.model.set('rendered', true);
   return this;
  }

})