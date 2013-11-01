/*global homeworkBuddy, Backbone, JST*/

homeworkBuddy.Views = homeworkBuddy.Views || {};

(function () {
    'use strict';
    homeworkBuddy.Views.HWCreationView = Backbone.View.extend({

      template: _.template(homeworkBuddy.templates.HWCreationTemplate),

      events: {
        'click button.newAssignment': 'submit'
      },

      initialize: function(){
        this.render();
      },

      //maybe should communicate with router
      submit: function(){
        var temp, paragraph;
        var title = $('input.newAssignment.title').val();
        //need to add in check here 

        var text = $('textarea.newAssignment').val();
        var array = encodeURIComponent(text).split('%0A');

        homeworkBuddy.assignment = new homeworkBuddy.Collections.Assignment();
        homeworkBuddy.assignmentView = new homeworkBuddy.Views.AssignmentView({collection: homeworkBuddy.assignment});

        var id = 0;
        for (var i = 0; i < array.length; i++){
          if (array[i].length) {
            id = id + 1;
            temp = decodeURIComponent(array[i]);
            paragraph = new homeworkBuddy.Models.Paragraph({text: temp, id: id});
            homeworkBuddy.assignment.add(paragraph);
          }
        }
      },

      render: function(){
        this.$el.append(this.template(this.model.attributes));
        this.$el.css('height', this.model.height);
        this.$el.css('width', '50%');
        
        return this;
      }
        // template: new EJS({url: 'app/scripts/templates/HWView.ejs'})
    });

})();
