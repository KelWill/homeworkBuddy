/*global homeworkBuddy, Backbone, JST*/

homeworkBuddy.Views = homeworkBuddy.Views || {};
homeworkBuddy.templates = homeworkBuddy.templates || {};
(function () {
    'use strict';

    homeworkBuddy.Views.QuestionCreationView = Backbone.View.extend({
        //template: 'app/scripts/templates/QuestionView.ejs', 
        render: function(){
          console.log('hello!');
        }
    });

    homeworkBuddy.Views.MCCreationView = Backbone.View.extend({
        template: _.template(homeworkBuddy.templates.MCCreation),
        initialize: function(){
          console.log('MCCreationView is initialized');
          console.log("the model is", this.model);
        },
        render: function(){
          this.$el.append(this.template(this.model.attributes));
          return this;
        }
    });

    homeworkBuddy.Views.FillBlankCreationView = Backbone.View.extend({
        template: _.template(homeworkBuddy.templates.FillBlankCreation),
        render: function(){
          this.$el.append(this.template(this.model.attributes));
          return this;
        }
    });

    homeworkBuddy.Views.ShortAnswerCreationView = Backbone.View.extend({
        template: _.template(homeworkBuddy.templates.ShortAnswerCreation),
        render: function(){
          this.$el.append(this.template(this.model.attributes));
          return this;
        }
    });

})();

