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
    // return Array.from(
    //     param.split(/=/).map(decodeURIComponent)
    //     for (param of str.split(/[&,]/))  // Comma is a separator too?!
    // );                                    // Well-played, Google.
};

const object_from = function (src) {
    const obj = { };
    while (true) {
        const x = src.next();
        if (x.done) {
            break;
        } else {
            obj[x.value[0]] = x.value[1];
        }
    }
    // for (let [key, value] of src) {
    //     obj[key] = value;
    // }
    return obj;
};

const parallel_iterate = function () {
    if (arguments.length > 0) {
        const arrays = Array.slice(arguments);
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
    const flashvars = object_from(vars_of(str));
    if ("errorcode" in flashvars) {
        const div = $("<div/>").prependTo($("#watch-header").parent());
        if ("reason" in flashvars) {
            div.html(flashvars.reason.replace(/\+/g, " "));
            div.find("*").remove();
        } else {
            div.text("Error code present, but no reason given.  WTF?");
        }
        return;
    }
    const format = object_from(
        flashvars.fmt_list.split(/,/).map(x => x.split(/\//))
        // x.split(/\//) for (x of flashvars.fmt_list.split(/,/))
    );
    const vids = vars_of(flashvars.url_encoded_fmt_stream_map)
          .reduce(function (acc, [key, value]) {
              if (hasOwn(acc, key)) {
                  acc[key].push(value);
              } else {
                  acc[key] = [ value ];
              }
              return acc;
          }, { });
    $("<ul/>").prependTo($("#watch-header").parent()).append(
        Array.from(
            parallel_iterate(vids.url, vids.itag, vids.quality, vids.type),
            ([url, itag, quality, type]) =>
                $("<li/>").append(
                    $("<a/>").attr("href", url).text(
                        type.replace(/;.*/, "") + " (" +
                            format[itag] + ") (" + quality + ")"
                    )
                )[0]
        )
    );
}
