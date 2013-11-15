homeworkBuddy.Views.AssignmentView = Backbone.View.extend({

  initialize: function(){
    this.render();

    var view = this;
    this.collection.on('add', function(p){
      view.addOne(p);
    })
  }, 

  events: {
    'click button#completed':'submitHomework'
  },

  completedButton: '<div class = "bottom"><button id = "completed">Homework Creation Complete!</div></div>', 
  
  render: function(){
   //clears out the old container and adds in assignment view
   $('.container').html("");
   $('.title').prepend(this.collection.assignmentName);
   $('.container').append(this.$el);
   this.$el.append('<div class = "middle"></div>')
   this.$el.append(this.completedButton);
  },

  addOne: function(paragraph){
    var paragraphView = new homeworkBuddy.Views.ParagraphView({model: paragraph});
    this.$el.find('.middle').append(paragraphView.el);
  },

  submitHomework: function(){
    this.collection.submitHomework();
  }

})