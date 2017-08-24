"use strict";

// autoload_disqus_comments();

const main = $(".main-post");

main.nextAll().remove();

const row = main.closest(".row");

row.children().filter(function (x) { return $(".main-post", x).length == 0 }).remove();

while (!row.next().hasClass("bold-section-title")) {
    row.next().remove();
}
