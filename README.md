Overview
========

<a href="https://github.com/meetselva/fixed-table-rows-cols/blob/master/fixed_table_rc.js">fixedTableRC</a> is a 
<a href="http://www.jquery.com/">jQuery</a> plug-in for converting a well formatted HTML table to a scrollable table 
with fixed table header and columns. This is a light weight plugin for rendering HTML table to an scrollable table 
the fixed header and configurable number of fixed columns.

DEMO:
=====
http://meetselva.github.com/fixed-table-rows-cols/

What is a scrollable table?
===========================
A scrollable table is nothing but a simple HTML table with scrollbars. We can create a scrollable table by placing 
the html table inside a container div (see below table) and style the div with fixed height say <code class="prettyprint">height: 300px</code> and 
<code class="prettyprint">overflow:auto</code>. Now The table content is intact and We can use scroller to view the entire table. 

The issue with the scrollable table is that when you scroll vertically, the header would scroll top hiding from the view and 
when scrolling horizontally, the columns in left would scroll left hiding from the view.

The goal of <a href="https://github.com/meetselva/fixed-table-rows-cols/blob/master/fixed_table_rc.js">fixedTableRC</a> plugin is to create
a scrollable table with fixed header and fixed columns while scrolling horizontally and vertically. 

The original idea is from question on SO <a href="http://stackoverflow.com/questions/10838700/large-dynamically-sized-html-table-with-a-fixed-scroll-row-and-fixed-scroll-colu/10922732#10922732">Large Dynamic Table with Fixed Rows and Fixed Columns</a>. 
The first version of <a href="demo v0_01.html" target="_blank" >Fixed Table RC</a> was neat but it had some limitations 
such as nested div structures, breaks on <a href="javascript:void(0)" class="helper" data-helper-msg="WELLFORMED_HTML">well formatted table</a> 
and the hanging scrollbars.
