"use strict";

//  Eliminate cruft.

$.onDocumentMutation(function () {
    $("div[class*='recent-video__video-container']").closest("div.instream-native-video").remove();
    $("div.ad-unit").remove();
});
