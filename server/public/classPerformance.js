
// OpenDSA data
var grades = [],
    assignments = [],

    // series for Highcharts
    averages = [],
    ranges = [],
    interquartileRanges = [],

    // student data overlays
    extraSeries = {},

    // charts
    chartAveragePerformance,
    chartExerciseCompletion,
    chartSortedByCategory,

    // flag for setup
    onlyOnce = true;

// point of entry (from parser once document loads)
function nowMakePretty(csv) {

  grades = csv.data;
  assignments = csv.headers;


  // area/line chart stuff
  averages = computeGradeAverages(grades, assignments);
  ranges = computeGradeRanges(grades, assignments);
  interquartileRanges = computeInterquartileGradeRanges(grades, assignments, averages);

  chartAveragePerformance = drawClassPerformanceChart(averages, ranges, interquartileRanges);
  bindInteractionStuffToAvg();

  chartSortedByCategory = drawAssignmentsByCategory(grades, assignments);

  // matrix stuff
  // computeDummyExerciseValues();
  // populateStudentsAndExerciseGrades();
  // chartExerciseCompletion = drawExerciseCompletionChart(exercises, exerciseGroundTruth, students, matrixChartData);
  // bindInteractionStuff();
}


/* Compute dummy values for students */
function computeDummyValues(ass_number, stud_number) {
  var g = [];
  // for each assignment
  var offset = 10;
  for(var i = 0; i < ass_number; i++) {
    g[i] = [];
    offset = Math.random() * 30 + 10;
    // for each student
    for(var j = 0; j < stud_number; j++) {
      g[i].push( +(Math.random() * (95 - offset) + offset).toFixed(2) );
    }
  }

  return g;
}


/* Compute averages for each assignment */
function computeGradeAverages(grades, assignments) {
  var avgs = [];
  var sum = 0;
  var pointsWorth = []; // compute values out of N points, not 100

  // for each assignment
  for(var i = 0; i < assignments.length; i++) {
    sum = 0;

    // compute sum across all students
    for(var g in grades) {
        sum += grades[g][i];
    }

    // so far we assume the assignments are graded out of 100 every time (!)

    // push assignment average to series array
    avgs.push([assignments[i], +((sum / grades.length)).toFixed(2)]);
  }

  return avgs;
}

/* Grab one student grade from each assignment */
// var s1 = Math.floor(Math.random() * 30);
// for(var i in grades) {
//     student1.push(grades[i][s1]);
// }
// console.log(s1, student1);

/* Compute range for each assignment */
function computeGradeRanges(grades, assignments) {
  var min, max;
  var range = [];

  // for each assignment
  for(var i = 0; i < assignments.length; i++) {
    max = Number.NEGATIVE_INFINITY;
    min = Number.POSITIVE_INFINITY;

    // find max and min grade across all students
    for(var g in grades) {
      max = (grades[g][i] > max) ? grades[g][i] : max;
      min = (grades[g][i] < min) ? grades[g][i] : min;
    }

    // store max and min for the given assignment
    range.push([assignments[i], min, max]);
  }

  return range;
}

/* Compute interquartile range for each assignment */
function computeInterquartileGradeRanges(grades, assignments, averages) {
  var q1, q3, median;
  var sortedGrades;
  var iqr = [];

  // function to return the median of an array of values
  function findMedian(ofThese) {
    if(ofThese.length%2 === 0) {
      return ((ofThese[(ofThese.length/2)-1]) + (ofThese[(ofThese.length/2)]))/2;
    } else {
      return ofThese[Math.floor(ofThese.length/2)];
    }
  }

  // for each assignment
  for(var i = 0; i < assignments.length; i++) {

    // first grab and sort all grades for each assignment
    sortedGrades = grades.map(function(row) {
      return row[i];
    }).sort(function(a, b) {
      return a-b;
    });

    // next compute the first and third quartiles
    q1 = findMedian(sortedGrades.slice(0, Math.floor(sortedGrades.length/2)));
    q3 = findMedian(sortedGrades.slice(Math.ceil(sortedGrades.length/2), sortedGrades.length));

    // store the range data in the interquartile range series
    iqr.push([assignments[i], q1, q3]);
  }

  return iqr;
}

/* Draw Chart */
function drawClassPerformanceChart(averages, ranges, interquartileRanges) {
  return Highcharts.chart('container', {

      chart: {
          type: 'columnrange',
      },

      title: {
          text: 'Average Assignment Grades'
      },

      yAxis: {
          max: 100,
          min: 0,
          title: {
              text: "Grade out of 100"
          }
      },

      xAxis: {
        ordinal: true,
        categories: assignments
        // labels: {
        //     format: 'Assignment {value}'
        // }
      },

      plotOptions: {
          columnrange: {
              grouping: false,
              shadow: false
          }
      },

      tooltip: {
          crosshairs: true,
          shared: true
      },

      legend: {
      },

      exporting: { enabled: false },

      series: [{
          name: 'Average Grade',
          // id: 'avgGrade',
          type: 'spline',
          data: averages,
          lineWidth: 2,
          zIndex: 1,
          marker: {
              fillColor: 'white',
              lineWidth: 2,
              lineColor: Highcharts.getOptions().colors[1],
              enabled: true
          }
      }, {
          name: 'Range',
          data: ranges,
          type: 'columnrange',
          lineWidth: 0,
          linkedTo: 'avgGrade',
          // color: Highcharts.getOptions().colors[7],
          color: 'WhiteSmoke',
          fillOpacity: 0.1,
          zIndex: 0,
          marker: {
              enabled: false
          }
      }, {
          name: 'Interquartile Range',
          data: interquartileRanges,
          // type: 'arearange',
          lineWidth: 0,
          linkedTo: 'avgGrade',
          color: 'lightgrey',
          fillOpacity: 0.2,
          zIndex: 0,
          marker: {
              enabled: false
          }
      }]
  });
}


/* This assumes the class performance chart has a range, interquartile range,
      and average line and removes all other series */
function removeExtraneousSeries() {
  while(chartAveragePerformance.series.length > 3) {
    chartAveragePerformance.series[3].remove(false);
  }
}

/* superimpose lines for some subset of students */
function addSeries(these) {
  var lineWidth = (these.length > 5) ? 1 : ((these.length > 3) ? 2 : 3);

  removeExtraneousSeries();
  extraSeries = {};

  // if there are none to add, redraw chart and return
  if(these.length <= 0) {
    chartAveragePerformance.redraw();
    return;
  }

  // add these students
  for(var i in these) {

    // grab their data
    // extraSeries['student'+these[i]] = [];
    // for(var j in grades) {
    //     extraSeries['student'+these[i]].push(grades[j][these[i]]);
    // }
    extraSeries['student'+these[i]] = grades[these[i]];



    // add new series
    chartAveragePerformance.addSeries({
        data: extraSeries['student'+these[i]],
        name: 'Student '+ these[i] +' Grade',
        id: 'student'+these[i],
        zIndex: 3,
        lineWidth: lineWidth,
        type: 'spline'
    }, false);
  }

  // finally, redraw the chart
  chartAveragePerformance.redraw();
}

function bindInteractionStuffToAvg() {
  var assignmentLabels = d3.select("#container").select("svg").select(".highcharts-xaxis-labels").selectAll("text");
  assignmentLabels.on('mouseover', function(d, i) { d3.select(this).style('opacity', 0.5); })
       .on('mouseout', function(d, i) { d3.select(this).style('opacity', 1.0); })
       .on('click', function(d, i) {

        if(onlyOnce) {
          d3.select(".app").insert("div", "#container1")
                 .attr("id", "description1")
                 .attr("class", "description")
                 .html("<h1>Exercise Completion</h1>" +
                       "<p>Proportion of the steps completed in each exercise for all students.</p>" +
                       "<p>Reorder by average completion, or click a particular exercise name to order within that exercise.</p>" +
                       "<p>Click and drag across some student labels on the y axis to view their course grades in the chart above.</p>");

          $("html, body").animate({ scrollTop: "600px" }, 1000);
          onlyOnce = false;
        }

         computeDummyExerciseValues();
         populateStudentsAndExerciseGrades();
         chartExerciseCompletion = drawExerciseCompletionChart(exercises, exerciseGroundTruth, students, matrixChartData, d3.select(this).text());
         bindInteractionStuff();
       });
}
