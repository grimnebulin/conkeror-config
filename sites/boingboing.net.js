"use strict";

//  Move the Go-To-Comments button to the top of the page.
//
//  Most likely, I've already read the article's content in my feed
//  reader, and I don't want to have to scroll down just to find the
//  comments button.

$("#headline").after($(".share"));

//  Delete header.

$("header.ember-view").remove();
