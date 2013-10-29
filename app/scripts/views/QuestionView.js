/*global homeworkBuddy, Backbone, JST*/

homeworkBuddy.Views = homeworkBuddy.Views || {};

(function () {
    'use strict';

    homeworkBuddy.Views.QuestionCreationView = Backbone.View.extend({

        template: JST['app/scripts/templates/QuestionView.ejs'], 
        render: function(){
        }
    });

    homeworkBuddy.Views.MCCreationView = Backbone.View.extend({
        template: JST['app/scripts/templates/MCCreationView'],
        render: function(){
          this.$el.append(this.template(this.model.attributes));
          return this;
        }
    });

    homeworkBuddy.Views.FillBlankCreationView = Backbone.View.extend({
        template: JST['app/scripts/templates/FillBlankCreationView'],
        render: function(){
          this.$el.append(this.template(this.model.attributes));
          return this;
        }
    });

    homeworkBuddy.Views.ShortAnswerCreationView = Backbone.View.extend({
        template: JST['app/scripts/templates/ShortAnswerCreationView'],
        render: function(){
          this.$el.append(this.template(this.model.attributes));
          return this;
        }
    });

})();

