/*global homeworkBuddy, Backbone*/

homeworkBuddy.Models = homeworkBuddy.Models || {};

(function () {
    'use strict';

    homeworkBuddy.Models.HWCreationModel = Backbone.Model.extend({
      initialize: function(){
        this.height = '500px';
      }
    });

})();
