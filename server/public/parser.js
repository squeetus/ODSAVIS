$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "./../studentData.csv",
        dataType: "text",
        success: function(data) {processData(data);}
     });

     function processData(allText) {
         var data = $.csv.toArrays(allText);
         var csv = {};

         csv.headers = data[0];
         csv.data = data.slice(1).map(function(line) {
           return line.map(function(cell) {
             return +cell;
           });
         });

        nowMakePretty(csv);
     }
});
