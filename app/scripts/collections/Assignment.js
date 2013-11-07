homeworkBuddy.Collections = homeworkBuddy.Collections || {};

homeworkBuddy.Collections.Assignment = Backbone.Collection.extend({
  model: homeworkBuddy.Models.Paragraph, 

  url: "http://localhost:8080",
  initialize: function(options){
    this.assignmentName = options.name;
  },
  submitHomework: function(){
    var assignmentName = this.assignmentName;
    delete this.assignmentName;
    var data = this.toJSON();
    data = JSON.stringify(data);
    console.log(data);
    console.log('submitting homework');

    $.ajax({
     method: 'POST', 
     contentType: 'application/json',
     data: data, 
     url: 'http://localhost:8080/newhw/' + assignmentName, 
     success: function(text){
      console.log(text);
     }
    });

  }
})