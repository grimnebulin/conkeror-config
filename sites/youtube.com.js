const vars_of = function (str) {
    return [
        param.split(/=/).map(decodeURIComponent)
        for (param of str.split(/[&,]/))  // Comma is a separator too?!
    ];                                    // Well-played, Google.
};

const object_from = function (src) {
    const obj = { };
    for (let [key, value] of src) {
        obj[key] = value;
    }
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

$("embed#movie_player[flashvars]").each(function () {
    const flashvars = object_from(vars_of(this.getAttribute("flashvars")));
    const format = object_from(
        x.split(/\//) for (x of flashvars.fmt_list.split(/,/))
    );
    const vids = vars_of(flashvars.url_encoded_fmt_stream_map)
          .reduce(function (acc, [key, value]) {
              if (Object.prototype.hasOwnProperty.call(acc, key)) {
                  acc[key].push(value);
              } else {
                  acc[key] = [ value ];
              }
              return acc;
          }, { });
    $("<ul/>").prependTo($("#watch-header").parent()).append([
        $("<li/>").append(
            $("<a/>").attr("href", url).text(
                type.replace(/;.*/, "") + " (" +
                format[itag] + ") (" + quality + ")"
            )
        )[0]
        for ([url, itag, quality, type] of
            parallel_iterate(vids.url, vids.itag, vids.quality, vids.type))
    ]);
});
