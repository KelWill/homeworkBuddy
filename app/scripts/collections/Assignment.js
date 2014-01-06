homeworkBuddy.Collections = homeworkBuddy.Collections || {};

homeworkBuddy.Collections.Assignment = Backbone.Collection.extend({
  model: homeworkBuddy.Models.Paragraph, 

  initialize: function(options){
    this.assignmentName = options.name;
  },

  submitHomework: function(){
    var assignmentName = this.assignmentName;
    if (assignmentName.length > 25){
      assignmentName = assignmentName.split('').slice(0, 25).join('');
    }
    var data = this.processData(this.toJSON());
    data = JSON.stringify(data);

    $.ajax({
      method: 'POST', 
      contentType: 'application/json',
      data: data, 
      url: '/newhw/' + assignmentName, 
      success: function(urlObj){
      $('#container').children().detach();
      $('#container').append('\
        <h1>Homework Creation Successful!</h1>\
        <p>Nice job. Your homework is available at' +
        urlObj + '</p>\
        ');
      },
      error: function(error){
        if (error.status === 401){
          $('#container').prepend("<h2>Looks like you aren't logged in...</h2>");
        } else if (error.status === 400){
          $('#container').prepend("<h2>You've already used that assignment name.</h2>");
        } else {
           $('#container').prepend('<h2>Something went wrong with our servers. Sorry!</h2><p>Try again in a minute or two</p>')
        }
      }
    });
  },


//Need to concatenate all the paragraphs in order so that articles will show up in the right place on the student view
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