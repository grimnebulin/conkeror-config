"use strict";

// autoload_disqus_comments();

//  Remove annoying ads.

$.whenFound("#tallboy-rising-star-outer", remove_it);

$.whenFound("#slideup", remove_it);

$.whenFound("#adblade", remove_it);

$.whenFound("iframe[id^='google_ads_iframe']", function () {
    this.closest("div.widget").remove();
});

$.whenFound("div > div.ac_adbox", div => div.parent().remove());

$.onDocumentMutation(function () {
    $("div.tynt-close-btn").click();
});
