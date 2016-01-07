"use strict";

//  Eliminate cruft.

if (buffer.current_uri.path.length > 2) {
    const body = $("div.article-body");
    body.nextAll("aside.article-side").remove();

    $("div#comment-ad").remove();
    $("div.advertisement.top-banner").remove();
    $("div#dfp-ad-wallpaper").remove();
    $("div.header-container").remove();
    $(".taboola").remove();

    $("a.see-comments").clickthis();
    $("div[class*='amzn-']").remove();
    $("div.header-ad-wrapper").remove();

    autoload_disqus_comments(1000);
}
