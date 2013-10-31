homeworkBuddy.Views.AssignmentView = Backbone.View.extend({

  initialize: function(){
    //clears out the old container
    this.render();
    
    //TODO render options menus
    var view = this;
    this.collection.on('add', function(p){
      view.addOne(p);
    })
  }, 
  
  render: function(){
   $('.container').html("");
   $('.container').append(this.$el);
  },

  addOne: function(paragraph){
    var paragraphView = new homeworkBuddy.Views.ParagraphView({model: paragraph});
    this.$el.append(paragraphView.el);
  }

})