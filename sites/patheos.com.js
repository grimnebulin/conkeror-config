autoload_disqus_comments();

//  Remove annoying ads.

$.onSubtreeMutation(function () {
    this.find("div.tynt-close-btn").clickthis();
});

$.whenFound("#uptab:visible", function () { this.clickthis() });

$.whenFound("iframe[id^='google_ads_iframe']", function () {
    this.closest("div.widget").remove();
});
