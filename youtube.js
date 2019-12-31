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
    const vars = new Map(vars_of(str));
    const response = JSON.parse(vars.get("player_response"));
    var title = response.videoDetails.title;
    if (title) title = title.replace(/\+/g, " ").replace(/\//g, "-");
    const fail = callbacks.error;
    const success = callbacks.success;

    if (!response.streamingData) {
        if (fail) fail("Unable to stream");
    } else {
        const videos = response.streamingData.formats.sort((a, b) => {
            const asize = a.width * a.height;
            const bsize = b.width * b.height;
            return bsize - asize;
        }).map(fmt => {
            const type = fmt.mimeType.replace(/;.*/, "");;
            const [_, minor] = type.split(/\//, 2);
            const info = {
                url: fmt.url,
                itag: fmt.itag,
                fmt: `${fmt.width}x${fmt.height}`,
                quality: fmt.quality,
                type: type,
                width: fmt.width,
                height: fmt.height
            };
            if (title && /^\w+$/.test(minor)) {
                info.filename = title + "." + minor;
            }
            return info;
        });

        if (success) success(videos);
        
    }

};

function youtube_videos(videoId, callbacks) {
    new WebRequest(
        "http://www.youtube.com/get_video_info?video_id=" + videoId,
        function (str) { co_call(youtube_videos_callback(str, videoId, callbacks)) }
    ).start();
}
