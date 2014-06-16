//  Automatically click and close intrusive ads.

//  js_foreplay-close?  Really, io9?

$.onSubtreeMutation(function () {
    this.find("a.js_foreplay-close").clickthis();
}, 20000);
