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

  completedButton: '<button id = "completed">Homework Creation Complete!</div>', 
  
  render: function(){
   //clears out the old container and adds in assignment view
   $('.container').html("");
   $('.container').append(this.$el);
   this.$el.append(this.completedButton)
  },

  addOne: function(paragraph){
    var paragraphView = new homeworkBuddy.Views.ParagraphView({model: paragraph});
    this.$el.append(paragraphView.el);
  }, 

  submitHomework: function(){
    console.log('heyyyyyyy');
    this.collection.submitHomework();
  }

})