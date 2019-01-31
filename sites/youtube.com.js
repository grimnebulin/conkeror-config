"use strict";

$.whenFound("div.pyv-afc-ads-container", remove_it);

//  This code inserts hyperlinks on a YouTube video page to all of the
//  raw video files available on that page.

const match = buffer.current_uri.asciiSpec.match(/[?&]v=([-\w]+)/);

if (match) {
    youtube_videos(match[1], { success: yt_success, error: yt_error });
}

function yt_success(videos) {
    $("<ul/>").prependTo($("#info-contents").parent()).append(
        videos.map(info => $("<li/>").append(
            $("<a/>").attr("href", info.url).text(
                `${info.type} (${info.fmt}) (${info.quality})`
            )
        )[0])
    );
}

function yt_error(message) {
    $("<div/>").text(message).prependTo($("#watch-header").parent());
}
