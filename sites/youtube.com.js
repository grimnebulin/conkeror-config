"use strict";

$.whenFound("div.pyv-afc-ads-container", remove_it);

//
//  This code inserts hyperlinks on a YouTube video page to all of the
//  raw video files available on that page.
//

const match = buffer.current_uri.asciiSpec.match(/[?&]v=([-\w]+)/);

if (match) {
    new WebRequest(
        "http://www.youtube.com/get_video_info?video_id=" + match[1],
        yt_info_callback
    ).start();
}

const vars_of = function (str) {
    return str.split(/[&,]/).map(p => p.split(/=/).map(decodeURIComponent));
};

const parallel_iterate = function (...arrays) {
    if (arrays.length > 0) {
        for (let i = 0; ; ++i) {
            const [done, elems] = arrays.reduce(
                ([done, elems], array) =>
                    [ done || i >= array.length, elems.concat(array[i]) ],
                [ false, [ ] ]
            );
            if (done) break; else yield elems;
        }
    }
};

function yt_info_callback(str) {
    const flashvars = new Map(vars_of(str));
    if (flashvars.has("errorcode")) {
        const div = $("<div/>").prependTo($("#watch-header").parent());
        if (flashvars.has("reason")) {
            div.html(flashvars.get("reason").replace(/\+/g, " "));
            div.find("*").remove();
        } else {
            div.text("Error code present, but no reason given.  WTF?");
        }
        return;
    }
    const format = new Map(
        flashvars.get("fmt_list").split(/,/).map(x => x.split(/\//))
    );
    const vids = vars_of(flashvars.get("url_encoded_fmt_stream_map"))
          .reduce((acc, [key, value]) => acc.push(key, value), new ArrayMap);
    $("<ul/>").prependTo($("#watch-header").parent()).append(
        Array.from(
            parallel_iterate(vids.get("url"), vids.get("itag"), vids.get("quality"), vids.get("type")),
            ([url, itag, quality, type]) =>
                $("<li/>").append(
                    $("<a/>").attr("href", url).text(
                        type.replace(/;.*/, "") + " (" +
                            format.get("itag") + ") (" + quality + ")"
                    )
                )[0]
        )
    );
}
