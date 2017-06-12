"use strict";

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

const youtube_videos_callback = function (str, callback) {
    const flashvars = new Map(vars_of(str));
    const title = flashvars.get("title").replace(/\+/g, " ").replace(/\//g, "-");

    if (flashvars.has("errorcode")) {
        if (flashvars.has("reason")) {
            callback(Failure(flashvars.get("reason").replace(/\+/g, " ")));
        } else {
            callback(Failure("Error code present, but no reason given.  WTF?"));
        }
        return;
    }

    const format = new Map(
        flashvars.get("fmt_list").split(/,/).map(x => x.split(/\//))
    );

    const vids = vars_of(flashvars.get("url_encoded_fmt_stream_map"))
          .reduce((acc, [key, value]) => acc.push(key, value), new ArrayMap);

    const result = Array.from(
        parallel_iterate(vids.get("url"), vids.get("itag"), vids.get("quality"), vids.get("type")),
        ([url, itag, quality, type]) => {
            type = type.replace(/;.*/, "");
            const [_, minor] = type.split(/\//, 2);
            const fmt = format.get(itag);
            const match = fmt.match(/^(\d+)x(\d+)$/);
            const [width, height] = match ? [ match[1], match[2] ].map(x => parseInt(x, 10)) : [ 0, 0 ];
            const info = {
                url: url,
                itag: fmt,
                quality: quality,
                type: type,
                width: width,
                height: height,
                area: width * height
            };
            if (title && /^\w+$/.test(minor)) {
                info.filename = title + "." + minor;
            }
            return info;
        }
    );

    callback(Success(result));

};

function youtube_videos(videoId, callback) {
    new WebRequest(
        "http://www.youtube.com/get_video_info?video_id=" + videoId,
        str => youtube_videos_callback(str, callback)
    ).start();
}
