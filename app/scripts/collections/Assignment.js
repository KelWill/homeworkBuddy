homeworkBuddy.Collections = homeworkBuddy.Collections || {};

homeworkBuddy.Collections.Assignment = Backbone.Collection.extend({
  model: homeworkBuddy.Models.Paragraph, 

  url: "http://localhost:8080",
  
  submitHomework: function(){
    console.log(this);
    var stuff = {contents: this.toJSON()};
    stuff = JSON.stringify(stuff);
    $.ajax({
     method: 'POST', 
     contenttype: 'application/json',
     data: stuff, 
     url: 'http://localhost:8080'
    });
  }
})