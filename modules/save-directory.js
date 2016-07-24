"use strict";

function spec_wrapper(spec) {
    return {
        get filename() load_spec_filename(spec),
        get mime_type() load_spec_mime_type(spec),
        get title() load_spec_title(spec),
        get uri() load_spec_uri(spec)
    };
}

define_variable(
    "save_funcs",
    [ ],
    "Array of functions for choosing a directory to save files in.  In order, each is passed a spec_wrapper object for the current download, and if it returns a true value, that value is taken as a directory to save the file in."
);
