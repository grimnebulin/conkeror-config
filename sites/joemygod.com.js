"use strict";

autoload_disqus_comments();

$.onDocumentMutation(function () {
    $("nav").remove();
    $("div._cm-os-slider").remove();
});

$.whenFound("#taboola-below-article-thumbnails", remove_it);
