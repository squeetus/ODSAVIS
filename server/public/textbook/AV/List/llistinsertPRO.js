"use strict";
/*global alert: true, BST, ODSA, PARAMS */
$(document).ready(function () {
  // Process about button: Pop up a message with an Alert
  function about() {
    alert(ODSA.AV.aboutstring(interpret(".avTitle"), interpret("av_Authors")));
  }

  // Set click handlers
  $("#about").click(about);

  $(document).on('click', '#NewNode', function() {
    newNode = list.newNode("");
    newNode.css({top: 80, left: 222});
  });
  $(document).on('click', '#InsertRight', function() {
    var newNext = currentNode.next();
    currentNode.next(newNode);
    newNode.next(newNext);
    removeStyle(list.first());
    list.layout();
  });
  $(document).on('click', '#Prepend', function() {
    list.addFirst(newNode);
    list.layout();
    current.target(list.get(0));
    head.target(list.get(0));
    removeStyle(list.first());
    av.displayInit();
  });

  function initialize() {
    if (stack){
      stack.clear();
    }
    if (list){
      list.clear();
    }
    if (head){
      head.hide();
      av.displayInit();
    }
    if (current){
      current.target(list.get(0));
      av.displayInit();
    }

    stack = av.ds.stack({center: true, xtransition: 5, ytransition: -3});
    var stackArray = JSAV.utils.rand.numKeys(10, 100, 4);
    for(var i = 0; i < stackArray.length; i++){
      stack.addLast(stackArray[i]);
    }
    stack.first().highlight();
    stack.layout();

    list = av.ds.list({center: true, nodegap: 30});
    var randInsert = JSAV.utils.rand.numKeys(10, 100, 6, {sorted: true});
    list.first("null");
    for (var i = 0; i < randInsert.length; i++){
      list.add(i, randInsert[i]);
      list.layout();
    }
    head = av.pointer("head", list.get(0));
    head.show();
    if (!current){
      current = av.pointer("current", list.get(0), {anchor: "center bottom", myAnchor: "right top", top: 10, left: -20, arrowAnchor: "center bottom"});
    }
    list.click(clickHandler);
    return list;
  }

  function modelSolution(av) {

  }

  function highlightNext() {
    stack.removeFirst();
    stack.layout();
    //higlight the next one
    if (stack.size()) {
      stack.first().highlight();
    }
  }
  function removeStyle(node){
    for (var i = 0; i < list.length; i++){
      node.unhighlight();
      node = ss.next();
    }
  }

  var clickHandler = function () {
    if (this.value() == ""){
      this.value(stack.first().value());
      highlightNext();

    }
    else if (this.value() != ""){
      this.highlight();
      current.target(this);
      av.displayInit();
      currentNode = this;
    }
  };

  //////////////////////////////////////////////////////////////////
  // Start processing here
  //////////////////////////////////////////////////////////////////

  // AV variables
  var initialArray = [],
      deleteValues = [],
      stack,
      list,
      head,
      newNode,
      currentNode,
      current,
      pseudo,

      // Load the configurations created by odsaAV.js
      config = ODSA.UTILS.loadConfig({default_code: "none"}),
      interpret = config.interpreter,

      // Settings for the AV
      settings = config.getSettings(),

      // Create a JSAV instance
      av = new JSAV($(".avcontainer"));

  av.recorded(); // we are not recording an AV with an algorithm


  var exercise = av.exercise(modelSolution, initialize,
                             {controls: $(".jsavexercisecontrols")});
  exercise.reset();
});
