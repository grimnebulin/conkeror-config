"use strict";

$.whenFound("div.pyv-afc-ads-container", remove_it);

//  This code inserts hyperlinks on a YouTube video page to all of the
//  raw video files available on that page.

const match = buffer.current_uri.asciiSpec.match(/[?&]v=([-\w]+)/);

if (match) {
    youtube_videos(match[1], { success: yt_success, error: yt_error });
}

function yt_success(videos) {
    const li = videos.map(info => {
        const a = $("<a/>");
        a.attr("href", info.url);
        a.attr("data-suffix", info.type.replace(/.*\//, ""));
        a.text(`${info.type} (${info.fmt}) (${info.quality})`);
        return $("<li/>").append(a)[0];
    });
    $("<ul/>").prependTo($("#info-contents").parent()).append(li);
}

function yt_error(message) {
    $("<div/>").text(message).prependTo($("#watch-header").parent());
}
