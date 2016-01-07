"use strict";

//  Remove pop-up video:

$.whenFound("#video-creative", remove_it);

//  Remove in-article iframe ads:

$.onDocumentMutation(function () {
    this.xpath("div[%s]//table[.//iframe]", "article_text").remove();
});
