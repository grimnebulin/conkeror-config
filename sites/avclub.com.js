//  Eliminate cruft.

const body = $("div.article-body");
body.children("section.article-text").nextAll().remove();
body.nextAll("aside.article-side").remove();

$("div#comment-ad").remove();
$("div.advertisement.top-banner").remove();
$("div#dfp-ad-wallpaper").remove();
$("div.header-container").remove();
$(".taboola").remove();
