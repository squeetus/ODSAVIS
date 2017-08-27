// var numAssignments = 5;
//
// var assignments = [];
// for(var i = 0; i < numAssignments; i++) {
//   assignments.push("Assignment " + i);
// }
//
// var students = [];
// var studentData = studentData || [];



// // number of exercises (arbitrary)
// var numExercises = 6,
//
//     // list of assignments sorted by category
      var sortedAssignments = [],
          projectNames = [],
          homeworkNames = [],
//
//     // student points in subassignments
//     exerciseData = [],
//
//     // total points available for subassignments
//     exerciseGroundTruth = [],
//
//     // students for whom data is available
//     students = [],
//
//     // data shaped for the matrix plotOptions
//     matrixChartData = [];
      sortedByCategoryData = [],
      projectGrades = [],
      homeworkGrades = [];


      // determine sort order for assignments
      var categories = ['attendance', 'lab', 'homework', 'projects', 'exams'],
          indices = [[0], [1,2], [3,7],[8,13], [14,17]];


function transformGrades() {
  var _grades = [];
  for (var g in grades) {
    _grades.push({
      'name': 'student '+g,
      'grades': grades[g]
    });
  }
  grades = _grades;

  // // reorder assignments for good here
  // for(var student in grades) {
  //   // swap grades where appropriate
  //   for(var g in grades[student].grades) {
  //     sortedByCategoryData.push([+g, +student, grades[student].grades[g]]);
  //   }
  // }

  return _grades;
}

/* Store the student data in the chart format
  assumes assignments and students are in correct order
  grades => sortedByCategoryData;
*/
function putCategoryData(grades, assignments) {
  sortedByCategoryData = [];
  sortedAssignments = assignments;
  students = [];

  // add student labels
  for(var student in grades) {
    students.push(grades[student].name);

    // add assignment data
    for(var g in grades[student].grades) {
      sortedByCategoryData.push([+g, +student, grades[student].grades[g]]);
    }
  }

  return sortedByCategoryData;
}

function drawAssignmentsByCategory(grades, assignments) {
  sortedByCategoryData = putCategoryData(transformGrades(), assignments);

  d3.select('#container2').style("display", "block");
  var tempchart = Highcharts.chart('container2', {

      chart: {
          type: 'heatmap',
          marginTop: 140,
          marginBottom: 40,
          plotBorderWidth: 1
      },

      title: {
          text: 'Grades Grouped By Category'
      },

      xAxis: {
          categories: sortedAssignments,
          opposite: true
      },

      yAxis: {
          categories: students,
          title: null
      },

      exporting: { enabled: false },

      colorAxis: {
          min: 0,
          // minColor: '#FFFFFF',
          // maxColor: Highcharts.getOptions().colors[7],
          stops: [
              [0, d3.interpolateRdYlGn(0)],
              [0.25, d3.interpolateRdYlGn(0.25)],
              [0.5, d3.interpolateRdYlGn(0.5)],
              [0.75, d3.interpolateRdYlGn(0.75)],
              [1, d3.interpolateRdYlGn(1)]
          ]
      },

      legend: {
          align: 'top',
          layout: 'horizontal',
          margin: 0,
          verticalAlign: 'top',
          y: 0,
          x: 640,
          symbolHeight: 15,
          symbolWidth: 130
      },

      tooltip: {
          // formatter: function () {
          //     // console.log(this.point.x)
          //     return '<b>' + this.series.yAxis.categories[this.point.y] + '</b> completed <br><b>' +
          //          (this.point.value * exerciseGroundTruth[this.point.x]) + '</b> of ' + exerciseGroundTruth[this.point.x] + ' steps (' + (this.point.value * 100).toFixed(0) + '%) in <br><b>' + this.series.xAxis.categories[this.point.x] + '</b>';
          // }
      },

      plotOptions: {
        series: {
            borderColor: '#303030'
        }
      },

      series: [{
          name: 'Grades',
          borderWidth: 2,
          // data: [[0, 0, 10], [0, 1, 19], [0, 2, 8], [0, 3, 24], [0, 4, 67], [1, 0, 92], [1, 1, 58], [1, 2, 78], [1, 3, 117], [1, 4, 48], [2, 0, 35], [2, 1, 15], [2, 2, 123], [2, 3, 64], [2, 4, 52], [3, 0, 72], [3, 1, 132], [3, 2, 114], [3, 3, 19], [3, 4, 16], [4, 0, 38], [4, 1, 5], [4, 2, 8], [4, 3, 117], [4, 4, 115], [5, 0, 88], [5, 1, 32], [5, 2, 12], [5, 3, 6], [5, 4, 120], [6, 0, 13], [6, 1, 44], [6, 2, 88], [6, 3, 98], [6, 4, 96], [7, 0, 31], [7, 1, 1], [7, 2, 82], [7, 3, 32], [7, 4, 30], [8, 0, 85], [8, 1, 97], [8, 2, 123], [8, 3, 64], [8, 4, 84], [9, 0, 47], [9, 1, 114], [9, 2, 31], [9, 3, 48], [9, 4, 91]],
          data: sortedByCategoryData,
          dataLabels: {
              enabled: false,
              color: '#FFF'
          }
      }]
  });

  bindInteractionStuff1();
  return tempchart;
}

/* order two student/grade entities by the average points */
function orderByAverage(a,b) {
  var sum_a = a.grades.reduce(function(c, d) { return c + d; });
  var avg_a = sum_a / a.grades.length;
  var sum_b = b.grades.reduce(function(c, d) { return c + d; });
  var avg_b = sum_b / b.grades.length;
  return avg_a - avg_b;
}

/* order student/grade entities by points in the nth exercise */
function orderByNth(i) {
  return function(a,b) {
    return a.grades[i] - b.grades[i];
  };
}

function orderByCategory(c) {
  if(c[0] == c[c.length-1])
    return orderByNth(c[0]);
  var from = c[0],
      to = c[c.length-1];
  return function(a,b) {
    var sum_a = a.grades.slice(from, to).reduce(function(c, d) { return c + d; });
    var avg_a = sum_a / (to-from);
    var sum_b = b.grades.slice(from, to).reduce(function(c, d) { return c + d; });
    var avg_b = sum_b / (to-from);
    return avg_a - avg_b;
  };
}

/* reorder the grouped exercise data */
function reorder1(i) {
  if (i === undefined)
    grades = grades.sort(orderByAverage);
  else if (Array.isArray(i)) {
    grades = grades.sort(orderByCategory(i));
  }
  else
    grades = grades.sort(orderByNth(i));

  putCategoryData(grades, assignments);
  chartSortedByCategory.axes[1].setCategories(students);
  chartSortedByCategory.series[0].setData(sortedByCategoryData);
}

/* Set up brushes and events after chart creation */
function bindInteractionStuff1() {
  // bind sort events to x-axis labels
  var texts = d3.select("#container2").select("svg").select(".highcharts-xaxis-labels").selectAll("text");
  texts.on('mouseover', function(d, i) { d3.select(this).style('opacity', 0.5); })
       .on('mouseout', function(d, i) { d3.select(this).style('opacity', 1.0); })
       .on('click', function(d, i) { reorder1(i); });

  var ddl = d3.select("#container2").insert('select', ".highcharts-container")
  	    //  .attr('class','select')
         .style("top", "10px")
         .style("left", "10px")
         .style("width", "100px")
         .on('change', function(d, i) {
           reorder1(indices[ddl.property('selectedIndex')]);
         });
  ddl.selectAll('option').data(categories).enter().append('option')
		      .text(function (d) { return d; });


  var brushed = function() {
    var these = [];
    if(d3.event.selection) {
      var y1 = d3.event.selection[0];
      var y2 = d3.event.selection[1];
      var myY = 0;

      d3.select("#container2").select("svg").select(".highcharts-yaxis-labels")
      // .selectAll("text").filter(function(d) {
      //   myY = +d3.select(this).attr('y');
      //   return myY > y1 && myY < y2;
      // });
      .selectAll("text").each(function(d) {
        myY = +d3.select(this).attr('y');
        if (myY > y1 && myY < y2) {
          these.push(+d3.select(this).text().substring(8, 10));
        }
      });
    }

    addSeries(these);
  };

  var brush = d3.brushY()
                .extent([[0, 130],[78, 840]]) // constrain brush extent to y axis
                .on("end", brushed);

  d3.select("#container2").select("svg").append("g")
      .attr("class", "brush")
      .call(brush);
}
