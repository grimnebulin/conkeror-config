// autoload_disqus_comments();

//  Remove annoying ads.

$.whenFound("#tallboy-rising-star-outer", remove_it);

$.whenFound("#slideup", remove_it);

$.whenFound("iframe[id^='google_ads_iframe']", function () {
    this.closest("div.widget").remove();
});