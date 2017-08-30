(function ($) {
  var jsav = new JSAV("container");
  jsav.umsg("We start with an empty SkipList");
  var ll = new SkipList(jsav);
  jsav.displayInit();
  jsav.umsg("adding one key-value pair (5, A)");
  ll.insert(new KVPair(5, "A"), 0);
  jsav.step();
  jsav.umsg("adding another key-value pair (25, B)");
  ll.insert(new KVPair(25, "B"), 1);
  jsav.step();
  jsav.umsg("adding another key-value pair (31, C)");
  ll.insert(new KVPair(31, "C"),2);
  jsav.step();
  jsav.umsg("adding another key-value pair (30, D)");
  ll.insert(new KVPair(30, "D"), null, 0);
  jsav.step();
  jsav.umsg("adding duplicate key-value pair (42, D)");
  ll.insert(new KVPair(42, "D"), 0);
  jsav.step();
  jsav.umsg("adding another key-value pair (58, G)");
  ll.insert(new KVPair(58, "G"), 1);
  jsav.step();
  jsav.umsg("adding another key-value pair (62, H)");
  ll.insert(new KVPair(62, "H"), 0);
  jsav.step();
  jsav.umsg("adding another key-value pair (69, I)");
  ll.insert(new KVPair(69, "I"), 2);
  jsav.step();
  jsav.recorded();
}(jQuery));
