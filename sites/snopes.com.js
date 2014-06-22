//  Remove pop-up video:

$.whenFound("#video-creative", remove_it);

//  Remove in-article iframe ads:

$.onDocumentMutation(function () {
    this.find("div.article_text").xpath(".//table[.//iframe]").remove();
});
