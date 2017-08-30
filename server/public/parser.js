$(document).ready(function() {
    $.ajax({
      type: "GET",
      url: "./../studentData.csv",
      dataType: "text",
      success: function(data) {processData(data);}
    });

    // generate a function producing a random value between two float values
    function gradePerturbThreshold(min, max) {
      return function() {
        return +((Math.random()*(max-min)+min).toFixed(2));
      };
    }

    function firstTransformGrades(grades) {
      var perturb = gradePerturbThreshold(0.9, 1.1);
      var modifier = 0;

      // for each student, modify grades
      for(var g in grades) {
        for(var i in grades[g]) {
          modifier = perturb();
          grades[g][i] = +(Math.min(grades[g][i] * modifier, 100).toFixed(2));
        }
      }

      return grades;
    }

    function processData(allText) {
       var data = $.csv.toArrays(allText);
       var csv = {};

       csv.headers = data[0];
       csv.data = data.slice(1).map(function(line) {
         return line.map(function(cell) {
           return +cell;
         });
       });

      firstTransformGrades(csv.data);

      nowMakePretty(csv);
    }
});
