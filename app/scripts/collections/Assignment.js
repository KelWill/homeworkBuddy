homeworkBuddy.Collections = homeworkBuddy.Collections || {};

homeworkBuddy.Collections.Assignment = Backbone.Collection.extend({
  model: homeworkBuddy.Models.Paragraph, 

  url: "http://localhost:8080",
  initialize: function(options){
    this.assignmentName = options.name;
  },

  submitHomework: function(){
    var assignmentName = this.assignmentName;
    var data = this.processData(this.toJSON());
    console.log(data);
    data = JSON.stringify(data);
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
  },


//Need to concatenate all the paragraphs in order so that articles will show up in the right place on the student server
  processData: function(data){
    var temp = '';
    var results = [];
    for ( var i = data.length - 1; i >= 0; i-- ){
      if (data[i].questionSet){
        data[i].text = data[i].text + '\n' + temp;
        temp = '';
        results.push(data[i]);
      } else {
        temp =  data[i].text + '\n' + temp; 
      }
    }
    return results;
  }
})