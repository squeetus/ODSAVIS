.. _my_simple:

.. raw:: html

   <script>ODSA.SETTINGS.DISP_MOD_COMP = true;ODSA.SETTINGS.MODULE_NAME = "my_simple";ODSA.SETTINGS.MODULE_LONG_NAME = "Simple Example of Using a Slide Show in a Book Module";ODSA.SETTINGS.MODULE_CHAPTER = "A Simple Example"; ODSA.SETTINGS.BUILD_DATE = "2017-05-30 17:05:53"; ODSA.SETTINGS.BUILD_CMAP = false;JSAV_OPTIONS['lang']='en';JSAV_EXERCISE_OPTIONS['code']='java_generic';</script>


.. |--| unicode:: U+2013   .. en dash
.. |---| unicode:: U+2014  .. em dash, trimming surrounding whitespace
   :trim:


.. This file is part of the OpenDSA eTextbook project. See
.. http://algoviz.org/OpenDSA for more details.
.. Copyright (c) 2012-2016 by the OpenDSA Project Contributors, and
.. distributed under an MIT open source license.

.. avmetadata::
   :author: Cliff Shaffer
   :requires: binary tree terminology; binary tree traversal;
   :satisfies: BST
   :topic: Binary Trees



Binary Search Trees
===================

BST Remove
----------

When duplicate node values do not appear in the tree, it makes no
difference whether the replacement is the greatest value from the
left subtree or the least value from the right subtree.
If duplicates are stored in the left subtree, then we must select
the replacement from the *left* subtree. [#]_
To see why, call the least value in the right subtree :math:`L`.
If multiple nodes in the right subtree have value :math:`L`,
selecting :math:`L` as the replacement value for the root of the
subtree will result in a tree with equal values to the right of the
node now containing :math:`L`.
Selecting the greatest value from the left subtree does not
have a similar problem, because it does not violate the Binary Search
Tree Property if equal values appear in the left subtree.

.. [#] Alternatively, if we prefer to store duplicate values in the
       right subtree, then we must replace a deleted node with the
       least value from its right subtree.

.. avembed:: AV/Binary/BSTremovePRO.html ss
   :module: my_simple
