homeworkBuddy.Collections = homeworkBuddy.Collections || {};

homeworkBuddy.Collections.Assignment = Backbone.Collection.extend({
  model: homeworkBuddy.Models.Paragraph, 

  url: "http://localhost:8080",
  
  submitHomework: function(){
    var data = this.toJSON();
    data = JSON.stringify(data);
    console.log(data);
    console.log('submitting homework');

    $.ajax({
     method: 'POST', 
     contentType: 'application/json',
     data: data, 
     url: 'http://localhost:8080/', 
     success: function(text){
      console.log(text);
     }
    });

  }
})