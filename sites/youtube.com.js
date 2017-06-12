"use strict";

$.whenFound("div.pyv-afc-ads-container", remove_it);

//  This code inserts hyperlinks on a YouTube video page to all of the
//  raw video files available on that page.

const match = buffer.current_uri.asciiSpec.match(/[?&]v=([-\w]+)/);

if (match) {
    youtube_videos(match[1], yt_info_callback);
}

function yt_info_callback(result) {
    result.select(
        array => {
            $("<ul/>").prependTo($("#watch-header").parent()).append(
                array.map(info => $("<li/>").append(
                    $("<a/>").attr("href", info.url).text(
                        info.type + " (" + info.itag + ") (" + info.quality + ")"
                    )
                )[0])
            )
        },
        error => {
            $("<div/>").text(error).prependTo($("#watch-header").parent());
        }
    );
}
