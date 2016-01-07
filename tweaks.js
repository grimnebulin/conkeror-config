"use strict";

//
//  This file tweaks Conkeror's built-in functionality in various ways.
//

//  This function follows a link in a new buffer, but then immediately
//  unburies the original buffer.  This causes the new buffer to
//  occupy a position just below the top in the buffer order.

function follow_new_buffer_shallowly_buried(I) {
    const buffer = I.buffer;
    yield follow(I, OPEN_NEW_BUFFER);
    I.window.buffers.unbury_buffer(buffer);
}

//  Redefine the "follow" command so that no C-u's follows a link in
//  the current buffer, one C-u follows a link in a new buffer, two
//  C-u's follows a link in a new buffer but then immediately unburies
//  the starting buffer, and three C-u's follows a link in a new
//  window.

interactive(
    "follow",
    null,
    alternates(
        follow,
        follow_new_buffer,
        follow_new_buffer_shallowly_buried,
        follow_new_window
    ),
    $browser_object = browser_object_links
);

//  Redefines the "bookmark" command so that the user is not prompted
//  for a frame to bookmark; only the top-level window can be
//  bookmarked.
//
//  The code has been copy-and-pasted from the Conkeror source, with
//  only the indicated line being changed.

interactive("bookmark",
    "Create a bookmark.",
    function (I) {
        var element = I.buffer.top_frame; // was: yield read_browser_object(I);
        var spec = load_spec(element);
        var uri_string = load_spec_uri_string(spec);
        var panel;
        panel = create_info_panel(I.window, "bookmark-panel",
                                  [["bookmarking",
                                    element_get_operation_label(element, "Bookmarking"),
                                    uri_string]]);
        try {
            var title = yield I.minibuffer.read($prompt = "Bookmark with title:", $initial_value = load_spec_title(spec) || "");
        } finally {
            panel.destroy();
        }
        add_bookmark(uri_string, title);
        I.minibuffer.message("Added bookmark: " + uri_string + " - " + title);
    });

interactive("save",
    "Save a browser object.",
    function (I) {
        var element = yield read_browser_object(I);
        var spec = load_spec(element);
        var panel;
        panel = create_info_panel(I.window, "download-panel",
                                  [["downloading",
                                    element_get_operation_label(element, "Saving"),
                                    load_spec_uri_string(spec)],
                                   ["mime-type", "Mime type:", load_spec_mime_type(spec)]]);
        try {
            var file = yield I.minibuffer.read_file_check_overwrite(
                $prompt = "Save as:",
                $initial_value = suggest_save_path(spec, I.buffer),
                $history = "save");
        } finally {
            panel.destroy();
        }
        save_uri(spec, file,
                 $buffer = I.buffer,
                 $use_cache = false);
    },
    $browser_object = browser_object_links);

function suggest_save_path(spec, buffer) {
    const wrapper = spec_wrapper(spec);
    wrapper.page_title = buffer.document.title;

    let file_name = wrapper.filename;
    if (! file_name) {
        file_name = generate_filename_safely_fn(
            maybe_filename_from_content_disposition(spec) ||
            maybe_filename_from_title(spec) ||
            maybe_filename_from_uri(spec) ||
            maybe_filename_from_url_last_directory(spec) ||
            maybe_filename_from_url_host(spec) ||
            maybe_filename_from_localization_default() ||
            "index");
    }
    const extension = maybe(file_name.match(/(\.[^.]*)$/))
        .map(x => x[1])
        .getOrElse("");
    const dest = {
        dir: undefined,
        filename: file_name.substr(0, file_name.length - extension.length),
        extension: extension
    };
    const host = buffer.current_uri.host;
    for (let entry of save_funcs) {
        if (entry.length == 1 ||
            entry.length == 2 && (host == entry[0] ||
                                  host.endsWith("." + entry[0]))) {
            try {
                const record = entry[entry.length - 1](wrapper);
                if (record)
                    for (let [key, value] of Iterator(record))
                        if (key in dest && value)
                            dest[key] = value;
            } catch (e) { dumpln(e) }
        }
    }
    const dir = dest.dir === undefined
        ? get_home_directory().path
        : dest.dir.startsWith("/")
        ? dest.dir
        : let (p = get_home_directory())
              (p.appendRelativePath(dest.dir), p.path);
    return dir.replace(/\/*$/, "/")
        + dest.filename.replace(/\//g, "-")
        + dest.extension.replace(/^\.?([^.])/, ".$1");
}
