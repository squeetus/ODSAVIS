"use strict";
/*global alert: true, BST, ODSA, PARAMS */
$(document).ready(function () {
  // Process about button: Pop up a message with an Alert
  function about() {
    alert(ODSA.AV.aboutstring(interpret(".avTitle"), interpret("av_Authors")));
  }

  // Set click handlers
  $("#about").click(about);

  function removeStyle(node){
    if (node.edgeToParent()){
      node.unhighlight();
      node = node.parent();
      removeStyle(node);
    } else {
      node.unhighlight();
    }
  }

  function initialize() {
    av._undo = [];
    if(count){
      count = 0;
    }
    if(JSAV_EXERCISE_OPTIONS.code){
      av.clear();
    }
    JSAV_EXERCISE_OPTIONS.code = "BSTAlgorithm";
    var pseudo = av.code(code[0]);

    var randomVal = 0;
    for (var i = 0; i < 10; i++) {
      randomVal = Math.floor(JSAV.utils.rand.random() * 100 + 1);
      nextArray[i] = randomVal;
    }

    var arr = av.ds.array(nextArray, {center: true, xtransition: 5, ytransition: -3});
    arr.click(clickHandler);
    arr.layout();

    if (jsavTree) {
      jsavTree.clear();
    }
    //generate random tree
    jsavTree = av.ds.binarytree({center: true, visible: true, nodegap: 25});
    jsavTree.click(clickHandler);
    jsavTree.layout();

    av.container.find(".jsavcanvas").css("min-height", 442);

    $(document).on('click', '#addnode', function() {
      console.log("addnode")
      var rootNode = jsavTree.root();
      rootNode.value(nextArray[count]);
      jsavTree.layout();
      exercise.gradeableStep();
      arr.value(count, "");
      count++;
    });
    $(document).on('click', '#addleft', function() {
      currentNode.left(nextArray[count]);
      removeStyle(currentNode);
      jsavTree.layout();
      exercise.gradeableStep();
      arr.value(count, "");
      count++
    });
    $(document).on('click', '#addright', function() {
      currentNode.right(nextArray[count]);
      removeStyle(currentNode);
      jsavTree.layout();
      exercise.gradeableStep();
      arr.value(count, "");
      count++
    });

    return jsavTree;
  }



  function modelSolution(av) {

    av._undo = [];
    var i;
    var modelcount = 0;
    if(modelcount){
      modelcount = 0;
    }

    var modelarr = av.ds.array(nextArray, {center: true, xtransition: 5, ytransition: -3});
    modelarr.click(clickHandler);
    modelarr.layout();

    if (modelTree) {
      modelTree.clear();
    }
    //generate random tree
    var modelTree = av.ds.binarytree({center: true, visible: true, nodegap: 25, relativeTo: arr, anchor: "center bottom"});
    modelTree.click(clickHandler);
    modelTree.layout();
    av.displayInit();
    console.log(modelTree.root().value() == "")

    for (i = 0; i < nextArray.length; i++){
      var insertval = nextArray[i];
      var node = modelTree.root();
      while(node.value() != ""){
        if(insertval <= node.value() && !node.left()){
          node.left("");
          av.step();
        }
        if(insertval > node.value() && !node.right()){
          node.right("");
          av.step();
        }
        if(insertval <= node.value()){
          node = node.left();
          av.step();
        } else {
          node = node.right();
          av.step();
        }
      }
       node.value(insertval);
       av.step();
       modelarr.value(modelcount, "");
       modelcount++;
       modelTree.layout();
       av.gradeableStep();
       av.step();
    }

    return modelTree;
  }


  var arrcount = 0;
  var clickHandler = function () {
    currentNode = this;
    this.highlight();
    arrcount++;
  };




  //////////////////////////////////////////////////////////////////
  // Start processing here
  //////////////////////////////////////////////////////////////////

  // AV variables
  var initialArray = [],
      nextArray = [],
      insertArray = [],
      jsavTree,
      arr,
      count = 0,
      insertSize = 5,
      treeSize = 14,          //20 nodes
      maxHeight = 6,
      currentNode,
      pseudo;


      // Load the configurations created by odsaAV.js
      var config = ODSA.UTILS.loadConfig();
      var interpret = config.interpreter;
      var code = config.code;

      //codeOptions = {after: {element: $(".instructions")}, visible: false},

      // Settings for the AV
      //var settings = config.getSettings();

      // Create a JSAV instance
      var av = new JSAV($(".avcontainer"), {settings: settings}, {animationMode: "none"});

  av.recorded(); // we are not recording an AV with an algorithm

  // show a JSAV code instance only if the code is defined in the parameter
  // and the parameter value is not "none"
  // if (code) {
  //   pseudo = av.code($.extend(codeOptions, code));
  // }

  var exercise = av.exercise(modelSolution, initialize,
                              {controls: $(".jsavexercisecontrols")});
  exercise.reset();
});
