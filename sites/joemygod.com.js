"use strict";

autoload_disqus_comments();

$.onDocumentMutation(function () {
    $("nav").remove();
    $("div._cm-os-slider").remove();
    $("#disqus_thread > iframe[src*='/ads-iframe/']").remove();
});

$.whenFound("#taboola-below-article-thumbnails", remove_it);
