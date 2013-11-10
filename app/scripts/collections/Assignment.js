homeworkBuddy.Collections = homeworkBuddy.Collections || {};

homeworkBuddy.Collections.Assignment = Backbone.Collection.extend({
  model: homeworkBuddy.Models.Paragraph, 

  url: "http://localhost:8080",
  initialize: function(options){
    this.assignmentName = options.name;
  },

  submitHomework: function(){
    var assignmentName = this.assignmentName;
    console.log(assignmentName);
    var data = this.processData(this.toJSON());
    data = JSON.stringify(data);
    console.log('submitting homework');
    console.log(data);

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
    console.log(data);
    var temp = '';
    var results = [];


    for ( var i = 0; i < data.length ; i++ ){
      if (!data[i].text){
        continue;
      }
      temp = temp + '<br>' + data[i].text;
      if (data[i].questionSet && data[i].questionSet.length){
        data[i].text = temp;
        results.push(data[i]);
        temp = '';
      } else if (i === data.length - 1){
        data[i].text = temp;
        results.push(data[i]);
      }
    }
    return results;
  }
})