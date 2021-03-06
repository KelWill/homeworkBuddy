/*global homeworkBuddy, Backbone, JST*/

homeworkBuddy.Views = homeworkBuddy.Views || {};

(function () {
    'use strict';
    homeworkBuddy.Views.HWCreationView = Backbone.View.extend({

      template: _.template(homeworkBuddy.templates.HWCreationTemplate),

      className: 'textarea',

      events: {
        'click button.newAssignment': 'updateRouter'
      },

      initialize: function(){
        this.render();
      },

      updateRouter: function(){
        homeworkBuddy.router.navigate('/create/addquestions', {trigger: true});
        this.submit();
      },

      //maybe should communicate with router
      submit: function(){
        var safe_name = function(str) {
          return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\//g, '&#47;').replace('/?/', '&#63;').replace(/\s/g, '');;
        };  
        var temp, paragraph;
        var assignmentName = safe_name($('input#assignmentName').val());

        if (!assignmentName){
          assignmentName = safe_name(prompt("Please enter a title for your assignment"));
        }
        if (assignmentName){
          var text = $('textarea.newAssignment').val();
          var array = encodeURIComponent(text).split('%0A');

          homeworkBuddy.assignment = new homeworkBuddy.Collections.Assignment({name: assignmentName});
          homeworkBuddy.assignmentView = new homeworkBuddy.Views.AssignmentView({collection: homeworkBuddy.assignment});
          

          var id = 0;
          for (var i = 0; i < array.length; i++){
            if (array[i].length) {
              id = id + 1;
              temp = decodeURIComponent(array[i]);
              temp = temp;
              paragraph = new homeworkBuddy.Models.Paragraph({text: temp, id: id});
              homeworkBuddy.assignment.add(paragraph);
            }
          }
        }
        //need to add in check here

      },

      render: function(){
        this.$el.append(this.template(this.model.attributes));
        
        return this;
      }
        // template: new EJS({url: 'app/scripts/templates/HWView.ejs'})
    });

})();
