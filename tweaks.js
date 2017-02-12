"use strict";

//
//  This file tweaks Conkeror's built-in functionality in various ways.
//

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
    let dir;
    if (dest.dir === undefined) {
        dir = get_home_directory().path;
    } else if (dest.dir.startsWith("/")) {
        dir = dest.dir;
    } else {
        const p = get_home_directory();
        p.appendRelativePath(dest.dir);
        dir = p.path;
    }
    return dir.replace(/\/*$/, "/")
        + dest.filename.replace(/\//g, "-")
        + dest.extension.replace(/^\.?([^.])/, ".$1");
}

// See: http://bugs.conkeror.org/issue491

duckduckgo_call_command = function (buffer, command) {
    var s = Cu.Sandbox(buffer.top_frame);
    var window = buffer.top_frame.wrappedJSObject;
    for(var prop in window) {
        if (prop.indexOf("nk") == 0) {
            s[prop] = window[prop];
        }
    }
    s.document = buffer.document.wrappedJSObject;
    Components.utils.evalInSandbox(command+"()", s);
};
