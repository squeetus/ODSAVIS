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
      var indices = [[0], [5, 6, 7, 8, 9], [4, 10], [1, 2, 3, 11, 12, 13], [14, 15, 16]],
          categories = [['attendance'], ['homework'], ['lab'], ['projects'], ['exams']],
          series = [];
//


// /* Randomly generate some number of points available in each exercise */
// function computeDummyExerciseValues() {
//   exercises = [];
//   exerciseGroundTruth = [];
//   students = [];
//   matrixChartData = [];
//   numExercises = Math.floor(Math.random()*10 + 1);
//
//   for(var i = 0; i < numExercises; i++) {
//     exercises.push('Exercise ' + i);
//     exerciseGroundTruth.push(Math.floor(Math.random()*8 + 2));
//   }
//
//   // return {'exercises': exercises, 'exerciseGroundTruth': exerciseGroundTruth};
// }
//
// /* Add all students from dataset
//     and give them random (!) number of points in each exercise */
// function populateStudentsAndExerciseGrades() {
//   var myGrade = 0;
//   // for each student
//   for(var i = 0; i < grades.length; i++) {
//
//     // set up name and grades array
//     students.push("student " + i);
//     exerciseData[i] = {
//       name: 'student'+i,
//       grades: []
//     };
//
//     // for each exercise
//     for(var j = 0; j < numExercises; j++) {
//
//         // compute the proportional grade for the current student/exercise
//         myGrade = Math.floor(Math.random()*exerciseGroundTruth[j] + 1);
//
//         // store the exercise data for the student
//         exerciseData[i].grades.push(myGrade/exerciseGroundTruth[j]);
//
//         // store the data for the chart series too
//         matrixChartData.push([j, i, myGrade/exerciseGroundTruth[j]]);
//     }
//   }
// }
//
/* Store the student data in the chart format */
function putCategoryData() {
  sortedByCategoryData = [];
  students = [];

  for(var i in projectGrades) {
    students.push(projectGrades[i].name);
    for(var j in projectGrades[i].grades) {
      sortedByCategoryData.push([+j, +i, projectGrades[i].grades[j]]);
    }
  }
}

function addSortedAssignmentGrades(grades, assignments) {
  sortedByCategoryData = [];
  sortedAssignments = [];



  for(var grade in grades) {
    students.push("student " + grade);
  }

  // for each category
  for( var i in categories ) {
    series[i] = {
      'category' : categories[i],
      'grades': []
    };
    // for each assignment
    for( var ass in indices[i] ) {
      sortedAssignments.push(assignments[indices[i][ass]]);

      // for each student, add grades
      for(var grade in grades) {
        series[i].grades.push([+indices[i][ass], +grade, grades[grade][indices[i][ass]]]);
      }
    }
  }

  return series;
}

function drawAssignmentsByCategory(grades, assignments) {
  var series = addSortedAssignmentGrades(grades, assignments);

  d3.select('#container2').style("display", "block");
  var tempchart = Highcharts.chart('container2', {

      chart: {
          type: 'heatmap',
          marginTop: 100,
          marginBottom: 120,
          plotBorderWidth: 1
      },


      title: {
          text: 'Project Grades Grouped By Category'
      },

      xAxis: {
          categories: sortedAssignments,
          // opposite: true
      },

      yAxis: {
          categories: students,
          title: null
      },

      exporting: { enabled: false },

      colorAxis: {
          min: 0,
          minColor: '#FFFFFF',
          maxColor: Highcharts.getOptions().colors[7],
          // minColor: '#EEEEFF',
          // maxColor: '#000022',
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
      }

      // series: [{
      //     name: 'Grades',
      //     borderWidth: 3,
      //     // data: [[0, 0, 10], [0, 1, 19], [0, 2, 8], [0, 3, 24], [0, 4, 67], [1, 0, 92], [1, 1, 58], [1, 2, 78], [1, 3, 117], [1, 4, 48], [2, 0, 35], [2, 1, 15], [2, 2, 123], [2, 3, 64], [2, 4, 52], [3, 0, 72], [3, 1, 132], [3, 2, 114], [3, 3, 19], [3, 4, 16], [4, 0, 38], [4, 1, 5], [4, 2, 8], [4, 3, 117], [4, 4, 115], [5, 0, 88], [5, 1, 32], [5, 2, 12], [5, 3, 6], [5, 4, 120], [6, 0, 13], [6, 1, 44], [6, 2, 88], [6, 3, 98], [6, 4, 96], [7, 0, 31], [7, 1, 1], [7, 2, 82], [7, 3, 32], [7, 4, 30], [8, 0, 85], [8, 1, 97], [8, 2, 123], [8, 3, 64], [8, 4, 84], [9, 0, 47], [9, 1, 114], [9, 2, 31], [9, 3, 48], [9, 4, 91]],
      //     data: sortedByCategoryData,
      //     dataLabels: {
      //         enabled: false,
      //         color: '#FFF'
      //     }
      // }]
  });

  for(var ser in series) {
      tempchart.addSeries({
        name: series[ser].category,
        borderWidth: 2,
        dataLabels: {
           enabled: false,
           color: '#FFF'
        },
        data: series[ser].grades
      });
  }

  bindInteractionStuff1();
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

/* reorder the grouped exercise data */
function reorder1(i) {
  if (i === undefined)
    sortedByCategory.sort(orderByAverage);
  else
    sortedByCategory.sort(orderByNth(i));


  putCategoryData();
  // console.log(exerciseData, students);
  chartSortedByCategory.series[0].setData(sortedByCategory);
  chartSortedByCategory.axes[1].setCategories(sortedAssignments);
}

/* Set up brushes and events after chart creation */
function bindInteractionStuff1() {
  // bind sort events to x-axis labels
  var texts = d3.select("#container2").select("svg").select(".highcharts-xaxis-labels").selectAll("text");
  texts.on('mouseover', function(d, i) { d3.select(this).style('opacity', 0.5); })
       .on('mouseout', function(d, i) { d3.select(this).style('opacity', 1.0); })
       .on('click', function(d, i) { reorder1(i); });

  d3.select("#container2").select("svg").append("rect")
          .attr("width", 100)
          .attr("height", 30)
          .attr("x", 0)
          .attr("y", 10)
          .attr("fill", "white")
          .attr("stroke", "black")
          .on("click", function(d, i) { reorder1(); });

  d3.select("#container2").select("svg").append("text")
          .style("pointer-events", "none")
          .attr("width", 40)
          .attr("height", 20)
          .attr("x", 30)
          .attr("y", 30)
          .text("Reorder");

  var brushed = function() {
    // handle case without different y
    // todo

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
                .extent([[0, 120],[78, 825]]) // constrain brush extent to y axis
                .on("end", brushed);

  d3.select("#container2").select("svg").append("g")
      .attr("class", "brush")
      .call(brush);
}
