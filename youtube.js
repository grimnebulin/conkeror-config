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

const youtube_videos_callback = function (str, videoId, callbacks) {
    const flashvars = new Map(vars_of(str));
    var title = flashvars.get("title");
    if (title) title = title.replace(/\+/g, " ").replace(/\//g, "-");
    const fail = callbacks["error"];
    const success = callbacks["success"];

    if (flashvars.has("errorcode")) {
        if (flashvars.has("reason")) {
            if (fail) fail(flashvars.get("reason").replace(/\+/g, " "));
        } else {
            if (fail) fail("Error code present, but no reason given.  WTF?");
        }
    } else {

        const format = new Map(
            flashvars.get("fmt_list").split(/,/).map(x => x.split(/\//))
        );

        const vids = vars_of(flashvars.get("url_encoded_fmt_stream_map"))
              .reduce((acc, [key, value]) => acc.push(key, value), new ArrayMap);

        const videos = Array.from(
            parallel_iterate(vids.get("url"), vids.get("itag"), vids.get("quality"), vids.get("type")),
            ([url, itag, quality, type]) => {
                type = type.replace(/;.*/, "");
                const [_, minor] = type.split(/\//, 2);
                const fmt = format.get(itag);
                const match = fmt.match(/^(\d+)x(\d+)$/);
                const [width, height] = match ? [ match[1], match[2] ].map(x => parseInt(x, 10)) : [ 0, 0 ];
                const info = {
                    url: url,
                    itag: itag,
                    fmt: fmt,
                    quality: quality,
                    type: type,
                    width: width,
                    height: height
                };
                if (title && /^\w+$/.test(minor)) {
                    info.filename = title + "." + minor;
                }
                return info;
            }
        );

        if (vids.has("s")) {
            let [fds, out, err] = make_descriptors();
            const result = yield shell_command_with_argument(
                "python -c 'import sys, json, pytube; print json.dumps([ v.url for v in pytube.api.YouTube(sys.argv[1]).get_videos() ])' {}",
                "http://www.youtube.com/watch?v=" + videoId,
                $fds = fds
            );
            if (result !== 0) {
                if (fail) fail(err());
            } else {
                JSON.parse(out()).forEach(function (url) {
                    const params = new URLSearchParams(
                        make_uri(url).QueryInterface(Ci.nsIURL).query
                    );
                    if (params.has("itag")) {
                        const itag = params.get("itag");
                        videos.forEach(function (video) {
                            if (video.itag === itag) {
                                video.url = url;
                            }
                        });
                    }
                });
            }
        }

        if (success) success(videos);
        
    }

};

function youtube_videos(videoId, callbacks) {
    new WebRequest(
        "http://www.youtube.com/get_video_info?video_id=" + videoId,
        function (str) { co_call(youtube_videos_callback(str, videoId, callbacks)) }
    ).start();
}
