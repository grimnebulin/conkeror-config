"use strict";

autoload_disqus_comments();

$.onDocumentMutation(function () {
    return $("nav").remove().length > 0;
});

$.whenFound("#taboola-below-article-thumbnails", remove_it);
