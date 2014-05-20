function follow_new_buffer_shallowly_buried(I) {
    const buffer = I.buffer;
    yield follow(I, OPEN_NEW_BUFFER);
    I.window.buffers.unbury_buffer(buffer);
}

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
