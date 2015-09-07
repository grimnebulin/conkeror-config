editor_shell_command = "emacsclient -c";

download_buffer_automatic_open_target = OPEN_NEW_BUFFER;

url_completion_use_history = true;
session_pref("layout.spellcheckDefault", 0);
session_pref("dom.disable_open_during_load", false);
session_pref("xpinstall.whitelist.required", false);

editor_shell_command = "emacsclient";

require("new-tabs");
require("gmail");
require("reddit");
require("google-search-results");
require("duckduckgo");

define_key(gmail_keymap, "{", null, $fallthrough);
define_key(gmail_keymap, "}", null, $fallthrough);

let SEARCH = "https://duckduckgo.com/?kk=-1&q=%s";

opensearch_load_paths.unshift(make_file("~/conkrc/search-engines/"));
define_opensearch_webjump("g", "duckduckgo.xml");

define_webjump("m",   "https://mail.google.com/");
define_webjump("r",   "https://www.inoreader.com/");
define_webjump("w",   "http://en.wikipedia.org/w/index.php?search=%s");
define_webjump("eps", "http://en.wikipedia.org/w/index.php?search=list of %s episodes");
define_webjump("yt",  "http://youtube.com/results?search_query=%s");
define_webjump("tta", "http://boardgaming-online.com/index.php?cnt=2");
define_webjump("ud",  "http://www.urbandictionary.com/define.php?term=%s");
define_webjump("so",  "http://stackoverflow.com/");
define_webjump("eso", "http://emacs.stackexchange.com/");
define_webjump("jso", "http://japanese.stackexchange.com/");
define_webjump("sfso", "http://scifi.stackexchange.com/");
define_webjump("fso", "http://french.stackexchange.com/");
define_webjump("js",  SEARCH + " javascript site:mozilla.org");
define_webjump("cr",  "http://crunchyroll.com/queue");
define_webjump("avc", SEARCH + " site:avclub.com",
               $alternative = "http://avclub.com/");
define_webjump("avr", SEARCH + " review site:avclub.com");
define_webjump("mt", "http://movietickets.com/");
define_webjump("t",  "http://twitter.com/");
define_webjump("c",  "http://coursera.org/");
define_webjump("fb", "https://www.facebook.com/?sk=h_chr");
define_webjump("bb", "http://bitbucket.org/");

{

    let IMDB_URL = "http://imdb.com/";

    define_webjump(
        "imdb",
        arg => IMDB_URL + "find?q=" + encodeURIComponent(arg).replace(/%20/g, "+"),
        $alternative = IMDB_URL
    );

}

{
    let MANDARIN_TOOLS_URL = "http://www.mandarintools.com/";

    let MANDARIN_TOOLS_SEARCH_URL =
        MANDARIN_TOOLS_URL + "cgi-bin/wordlook.pl?word=%s&where=whole&audio=on&searchtype=";

    let MANDARIN_TOOLS_FALLBACK_URL = MANDARIN_TOOLS_URL + "worddict.html";

    define_webjump("cp", MANDARIN_TOOLS_SEARCH_URL + "pinyin",
                   $alternative = MANDARIN_TOOLS_FALLBACK_URL);
    define_webjump("ce", MANDARIN_TOOLS_SEARCH_URL + "english",
                   $alternative = MANDARIN_TOOLS_FALLBACK_URL);

}

{
    let WWWJDIC_URL = "http://www.csse.monash.edu.au/~jwb/cgi-bin/wwwjdic.cgi?";

    function japanese_search(dict, term, extra) {
        const uri = WWWJDIC_URL + dict;
        const post_data = [ pair for (pair in Iterator(extra || { })) ];
        return function (arg) {
            const data = make_post_data([[ term, arg ]].concat(post_data));
            return load_spec({ uri: uri, post_data: data });
        };
    }

    define_webjump("je",    japanese_search("1E", "dsrchterm"));
    define_webjump("jj",    japanese_search("1E", "dsrchterm", { dsrchtype: "J" }));
    define_webjump("jskip", japanese_search("1D", "ksrchkey", { kanjsel: "P" }));
}

{
    let NETFLIX_URL = "http://movies.netflix.com/";
    let NETFLIX_QUEUE_URL = NETFLIX_URL + "Queue";
    let NETFLIX_INSTANT_QUEUE_URL = NETFLIX_QUEUE_URL + "?qtype=ED";

    define_webjump(
        "nf", NETFLIX_URL + "WiSearch?v1=%s", $alternative = NETFLIX_QUEUE_URL
    );

    define_webjump("nfi", NETFLIX_INSTANT_QUEUE_URL);

}

define_webjump(
    "emacswiki",
    "http://www.emacswiki.org/",
    $alternative = "http://www.google.com/cse?cx=004774160799092323420%3A6-ff2s0o6yi&q=%s&sa=Search&siteurl=emacswiki.org%2F"
);

{
    let PIRATEBAY_URL = "http://thepiratebay.se/";

    define_webjump(
        "pb",
        function (arg) {
            const format = x => x.length < 2 ? format("0" + x) : x;
            const matched = ([_, name, season, episode]) =>
                  name + " s" + format(season) + "e" + format(episode);
            return PIRATEBAY_URL + "s/?q=" +
                maybe(arg.match(/^(.*?)\s+0*(\d+)\s+0*(\d+)\s*$/))
                .map(matched)
                .getOrElse(arg);
        },
        $alternative = PIRATEBAY_URL
    );

}

{
    let FIREBUG_URL = "http://getfirebug.com/releases/lite/1.2/firebug-lite-compressed.js";

    function firebug(I) {
        $$(I).script({ src: firebug_url, onload: "firebug.init()" })
            .appendTo("body");
    }

    interactive("fb", "open firebug lite", firebug);

}

{
    let MODI_URL = "http://slayeroffice.com/tools/modi/v2.0/modi_v2.0.js";

    let MODI_DOC =
        "The Mouseover DOM Inspector, or MODI for short, is a favelet " +
        "(also known as a bookmarklet) that allows you to view and manipulate " +
        "the DOM of a web page simply by mousing around the document " +
        "(http://slayeroffice.com/tools/modi/v2.0/modi_help.html).";

    interactive(
        "modi", MODI_DOC,
        function (I) {
            $$(I).script({ src: MODI_URL, id: "modi" }).appendTo("body");
        }
    );

}

interactive(
    "jq",
    "Execute jquery",
    function (I) {
        const code = yield I.minibuffer.read(
            $prompt = "jquery: ", $history = "jquery-here"
        );
        I.minibuffer.message(let ($ = $$(I)) eval(code));
    }
);

function next_page(I) {

    function numeric_params(str) {
        const param = { };
        const qm = str.indexOf("?");
        if (qm >= 0) {
            for (let pair of str.substring(qm + 1).split(/&/)) {
                let [key, value] = pair.split(/=/);
                try {
                    key   = decodeURIComponent(key);
                    value = decodeURIComponent(value);
                } catch (e) {
                    continue;
                }
                if (/^\d+$/.test(value)) {
                    param[key] = parseInt(value, 10);
                }
            }
        }
        return param;
    }

    const $     = $$(I);
    const comps = $.window.location.pathname.match(/[^\/]+/g);
    const url   = numeric_params($.window.location.search);
    const has   = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

    const links = $("a").filter(function () {
        const param = numeric_params(this.href);
        for (let key in param) {
            if (has(url, key)) {
                return param[key] == url[key] + 1;
            } else if (param[key] == 2) {
                return true;
            }
        }
        let nums = this.href.match(/\/\d\d?\W*(\/|$)/g);
        return nums && nums.map   (n => parseInt(n.substring(1), 10))
                           .filter(n => n >= 2)
                           .some  (n => comps.some(x => x == n - 1));
    }).get().reduce(function (acc, anchor) {
        if (!acc.some(x => x.href === anchor.href))
            acc.push(anchor);
        return acc;
    }, [ ]);

    if (links.length == 0) {
        I.minibuffer.message("Found no Next links");
    } else if (links.length > 1) {
        I.minibuffer.message(
            "Found " + links.length + " possible Next links: " +
                links.map(x => x.href).join(", ")
        );
    } else {
        links[0].click();
    }

}

define_key(default_global_keymap, "C-.", next_page);

on_dom_loaded(
    /cdn\.optmd\.com|axp\.zedo\.com|media\.fastclick\.net|adrotator\.se|voicefive\.com|tribalfusion\.com|aproductmsg\.com|productmsg\.com/,
    kill_buffer,
    true
);

define_key(default_global_keymap, "M-b", "bury-buffer");

define_key(default_global_keymap, "C-end", function (I) {
    kill_buffer(I.buffer);
});

define_key(default_global_keymap, "C-context_menu", function (I) {
    if (I.window.buffers.count > 1 &&
        /mail\.google\.com/.test(I.buffer.current_uri.asciiHost)) {
        I.window.buffers.bury_buffer(I.buffer);
    }
    browser_object_follow(I.buffer, OPEN_NEW_BUFFER, "http://boardgaming-online.com/index.php?cnt=2");
});

define_key(default_global_keymap, "C-/", "find-url-new-buffer");

function duckduckgo_jump_to_startpage(I) {
    const query = $$(I)("input[name='q']").val();
    browser_object_follow(
        I.buffer,
        OPEN_CURRENT_BUFFER,
        load_spec({
            uri:       "https://startpage.com/do/search",
            post_data: make_post_data([[ "query", query ]])
        })
    );
}

define_key(duckduckgo_keymap, "C-c C-n", duckduckgo_jump_to_startpage);

function my_request(url, callback, responseType) {
    const req = Cc["@mozilla.org/xmlextras/xmlhttprequest;1"]
        .createInstance(Ci.nsIXMLHttpRequest);
    req.open("GET", url, true);
    req.responseType = responseType || "document";
    req.onreadystatechange = function () {
        if (this.readyState == 4) {
            callback(this.response);
        }
    };
    req.send(null);
}

function scan_for(str, regex) {
    let lastIndex = regex.lastIndex = 0;
    let match;
    while ((match = regex.exec(str)) !== null) {
        const text = match[0];
        const prev = str.substring(lastIndex, regex.lastIndex - text.length);
        if (prev.length > 0) {
            yield [ prev, false ];
        }
        yield [ text, true ];
        lastIndex = regex.lastIndex;
    }
    if (lastIndex < str.length) {
        yield [ str.substring(lastIndex), false ];
    }
}


interactive("htmlize", "htmlize links", htmlize_links);

function htmlize_links(I) {
    const $ = $$(I);
    const xpath = "/html/body//text()[not(ancestor::script) and not(ancestor::a)]";
    const regex = /\bhttps?:\/\/\S+/g;

    function replacement([ str, isMatch ]) {
        return isMatch ? $("<a/>").attr("href", str).text(str)[0]
                       : $.document.createTextNode(str);
    }

    $.xpath(xpath).replaceWith(function () {
        return [
            replacement(match) for (match of scan_for(this.nodeValue, regex))
        ];
    });
}

add_dom_content_loaded_hook(function (buffer) {
    $$(buffer).whenFound("#tallboy-rising-star-outer", remove_it);
});

function skewer(I) {
    $$(I).script({ src: "http://localhost:8080/skewer" }).appendTo("head");
}

interactive("skewer", "Connect to Emacs", skewer);


page_mode_deactivate(youtube_player_mode);
page_mode_deactivate(youtube_mode);

define_key(content_buffer_normal_keymap, "' p", "browser-object-paste-url");

function nuke_fixed_elements(I) {
    const $ = $$(I);
    $("*").filter(function () {
        return $.window.getComputedStyle(this).display === "fixed";
    }).remove();
}

define_key(default_global_keymap, "M-k", nuke_fixed_elements);
