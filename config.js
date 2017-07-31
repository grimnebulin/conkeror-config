"use strict";

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
require("key-kill");

key_kill_mode.test.push(/facebook\.com\//);
key_kill_mode.test.push(/bbs\.boingboing\.com\//);

interactive("kk", "Toggle key-kill-mode", "key-kill-mode");

page_mode_deactivate(youtube_player_mode);
page_mode_deactivate(youtube_mode);

opensearch_load_paths.unshift(make_file("~/conkeror/conkeror-config/search-engines/"));

define_opensearch_webjump("g", "duckduckgo.xml");

// Webjumps

define_webjump("m", "https://mail.google.com/mail/u/?authuser=eefacm@gmail.com");
define_webjump("r", "https://www.inoreader.com/");
define_webjump("w", "http://en.wikipedia.org/w/index.php?search=%s");
define_webjump("eps", "http://en.wikipedia.org/w/index.php?search=list of %s episodes");
define_webjump("yt", "http://youtube.com/results?search_query=%s");
define_webjump("tta", "http://boardgaming-online.com/index.php?cnt=2");
define_webjump("ud", "http://www.urbandictionary.com/define.php?term=%s");
define_webjump("so", "http://stackoverflow.com/");
define_webjump("eso", "http://emacs.stackexchange.com/");
define_webjump("jso", "http://japanese.stackexchange.com/");
define_webjump("sfso", "http://scifi.stackexchange.com/");
define_webjump("fso", "http://french.stackexchange.com/");
define_webjump("pgso", "http://codegolf.stackexchange.com/");
define_webjump("mso", "http://math.stackexchange.com/");
define_webjump("mt", "http://movietickets.com/");
define_webjump("t", "http://twitter.com/");
define_webjump("c", "http://coursera.org/");
define_webjump("fb", "https://www.facebook.com/?sk=h_chr");
define_webjump("bb", "http://bitbucket.org/");
define_webjump("bgg", "https://boardgamegeek.com/geeksearch.php?action=search&objecttype=boardgame&q=%s&B1=Go");
define_webjump("gh", "https://github.com/");
define_webjump("sd", "http://www.scala-lang.org/api/current/index.html#package");
define_webjump("ebay", "https://www.ebay.com/sch/i.html?_nkw=%s");

define_webjump(
    "cx",
    "https://pulllist.comixology.com/search/?search_query=%s",
    $alternative = "https://pulllist.comixology.com/subscriptions/"
);

const SEARCH = "https://duckduckgo.com/?kk=-1&q=%s";

define_webjump("js",  SEARCH + " javascript site:mozilla.org");
define_webjump("avc", SEARCH + " site:avclub.com", $alternative = "http://avclub.com/");
define_webjump("avr", SEARCH + " review site:avclub.com");
define_webjump("kym", SEARCH + " site:knowyourmeme.com");
define_webjump("sf",  SEARCH + " san francisco");

define_webjump(
    "cr",
    "http://www.crunchyroll.com/search?q=%s",
    $alternative = "http://crunchyroll.com/queue"
);

define_webjump(
    "imdb",
    arg => "http://imdb.com/find?q=" + encodeURIComponent(arg).replace(/%20/g, "+"),
    $alternative = "http://imdb.com/"
);

const MANDARIN_TOOLS_URL = "http://www.mandarintools.com/";

const MANDARIN_TOOLS_SEARCH_URL = MANDARIN_TOOLS_URL + "cgi-bin/wordlook.pl?word=%s&where=whole&audio=on&searchtype=";

const MANDARIN_TOOLS_FALLBACK_URL = MANDARIN_TOOLS_URL + "worddict.html";

define_webjump("cp", MANDARIN_TOOLS_SEARCH_URL + "pinyin",
               $alternative = MANDARIN_TOOLS_FALLBACK_URL);
define_webjump("ce", MANDARIN_TOOLS_SEARCH_URL + "english",
               $alternative = MANDARIN_TOOLS_FALLBACK_URL);

const WWWJDIC_URL = "http://www.csse.monash.edu.au/~jwb/cgi-bin/wwwjdic.cgi?";

// define_webjump("je",    japanese_search("1E", "dsrchterm"));
// define_webjump("jj",    japanese_search("1E", "dsrchterm", { dsrchtype: "J" }));
// define_webjump("jskip", japanese_search("1D", "ksrchkey", { kanjsel: "P" }));

define_webjump(
    "nf",
    "https://www.netflix.com/search?q=%s",
    $alternative = "https://dvd.netflix.com/Queue?qtype=DD"
);

define_webjump("nfi", "https://www.netflix.com/browse/my-list");
define_webjump("nfg", "https://www.netflix.com/browse/genre/%s");

const PIRATEBAY_URL = "http://thepiratebay.se/";

define_webjump("pb", piratebay_find_episode, $alternative = PIRATEBAY_URL);

// Key mappings

function kill_this_buffer(I) { kill_buffer(I.buffer) }

define_key(gmail_keymap, "{", null, $fallthrough);
define_key(gmail_keymap, "}", null, $fallthrough);
define_key(gmail_keymap, "M-c", "copy");
define_key(gmail_keymap, "M-f", "follow");
define_key(default_global_keymap, "C-.", next_page);
define_key(default_global_keymap, "M-b", "bury-buffer");
define_key(default_global_keymap, "C-end", kill_this_buffer);
define_key(default_global_keymap, "M-k", kill_this_buffer);
define_key(default_global_keymap, "C-x 0", kill_this_buffer);
define_key(default_global_keymap, "C-context_menu", open_boardgaming_online);
define_key(default_global_keymap, "C-/", "find-url-new-buffer");
define_key(duckduckgo_keymap, "C-c C-n", duckduckgo_jump_to_startpage);
define_key(default_global_keymap, "C-M-k", nuke_fixed_elements);
define_key(content_buffer_normal_keymap, "' p", "browser-object-paste-url");

// Interactives

interactive("htmlize", "htmlize links", htmlize_links);
interactive("fb", "open firebug lite", firebug);
interactive("skewer", "Connect to Emacs", skewer);
interactive("ff", "Open page in Firefox", open_in_firefox);
interactive("dm", "Open builtin download manager", "download-manager-show-builtin-ui");

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

// Kill pages served by annoying hosts immediately

const BAD_HOSTS = /cdn\.optmd\.com|axp\.zedo\.com|media\.fastclick\.net|adrotator\.se|voicefive\.com|tribalfusion\.com|a?productmsg\.com|timelypayments\.com|terraclicks\.com|offer\.alibaba\.com/;

add_dom_content_loaded_hook(function (buffer) {
    if (BAD_HOSTS.test(buffer.current_uri.asciiHost)) {
        kill_buffer(buffer);
    }
});

//

add_dom_content_loaded_hook(function (buffer) {
    if (/\bthepiratebay\b/.test(buffer.current_uri.asciiHost)) {
        piratebay_clean_up_page($$(buffer));
    }
})

// Support functions

function open_in_firefox(I) {
    shell_command_with_argument_blind("firefox {}", I.buffer.current_uri.spec)
}

function piratebay_find_episode(arg) {
    const format = x => x.length < 2 ? format("0" + x) : x;
    const matched = ([_, name, season, episode]) =>
          name + " s" + format(season) + "e" + format(episode);
    return PIRATEBAY_URL + "s/?q=" +
        maybe(arg.match(/^(.*?)\s+0*(\d+)\s+0*(\d+)\s*$/))
        .map(matched)
        .getOrElse(arg);
}

function piratebay_clean_up_page($) {
    const main = $("div#main-content");

    main.prevAll().remove();
    main.nextAll().remove();
    main.parent().nextAll().remove();

    $("div.ad").remove();
    $("iframe").remove();
}

// Array comprehension bad!
// function japanese_search(dict, term, extra) {
//     const uri = WWWJDIC_URL + dict;
//     const post_data = [ pair for (pair in Iterator(extra || { })) ];
//     return function (arg) {
//         const data = make_post_data([[ term, arg ]].concat(post_data));
//         return load_spec({ uri: uri, post_data: data });
//     };
// }


const FIREBUG_URL = "http://getfirebug.com/releases/lite/1.2/firebug-lite-compressed.js";

function firebug(I) {
    $$(I).script({ src: FIREBUG_URL, onload: "firebug.init()" })
        .appendTo("body");
}

// Apply a heuristic to attempt to locate a hyperlink on the current
// page which is the "next" in sequence after this page.

function next_page(I) {

    function numeric_params(str) {
        const param = new Map;
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
                    param.set(key, parseInt(value, 10));
                }
            }
        }
        return param;
    }

    const $     = $$(I);
    const comps = $.window.location.pathname.match(/[^\/]+/g);
    const url   = numeric_params($.window.location.search);

    const links = $("a").filter(function () {
        const param = numeric_params(this.href);
        for (let key in param) {
            if (url.has(key)) {
                return param.get(key) === url.get(key) + 1;
            } else if (param.get(key) === 2) {
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

    if (links.length === 0) {
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

function open_boardgaming_online(I) {
    if (I.window.buffers.count > 1 &&
        /mail\.google\.com/.test(I.buffer.current_uri.asciiHost)) {
        I.window.buffers.bury_buffer(I.buffer);
    }
    browser_object_follow(I.buffer, OPEN_NEW_BUFFER, "http://boardgaming-online.com/index.php?cnt=2");
}

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


function htmlize_links(I) {
    const $ = $$(I);
    const xpath = "/html/body//text()[not(ancestor::script) and not(ancestor::a)]";
    const regex = /\bhttps?:\/\/\S+/g;

    function replacement([ str, isMatch ]) {
        return isMatch ? $("<a/>").attr("href", str).text(str)[0]
                       : $.document.createTextNode(str);
    }

    $.xpath(xpath).replaceWith(function () {
        return Array.from(
            scan_for(this.nodeValue, regex), replacement
        );
    });
}

add_dom_content_loaded_hook(function (buffer) {
    $$(buffer).whenFound("#tallboy-rising-star-outer", remove_it);
});

function skewer(I) {
    $$(I).script({ src: "http://localhost:8080/skewer" }).appendTo("head");
}

$$.static.fixed_elements = function () {
    const position = elem => this.window.getComputedStyle(elem).position;
    return this("*[id!='comments']").filter(function () { return position(this) === "fixed" });
};

function nuke_fixed_elements(I) {
    const removed = $$(I).fixed_elements().remove().length;
    I.minibuffer.message(plural(removed, "element") + " removed");
}

function plural(n, noun) {
    return n + " " + noun + (n !== 1 ? "s" : "");
}

//  This method returns a new jQuery object that refers to the
//  document embedded in the first element of this jQuery object, if
//  it is an <iframe> element.  Rather, it returns a Maybe object (see
//  conkutil.js) that is a None if the invocant is empty or if its
//  first element is not an iframe element, and a Some otherwise.
//
//  For example, changing the style of the first iframe object's
//  <body> element to blue, if such an iframe element exists:
//
//  $("iframe").enterIframe().foreach(
//    $ => $("body").css("background", "blue")
//  );

$$.fn.enterIframe = function () {
    return this.length > 0 && this[0].tagName === "IFRAME"
        ? Some($$(this[0].contentWindow))
        : None();
};

//  This function follows a link in a new buffer, but then immediately
//  unburies the original buffer.  This causes the new buffer to
//  occupy a position just below the top in the buffer order.

function follow_new_buffer_shallowly_buried(I) {
    const buffer = I.buffer;
    yield follow(I, OPEN_NEW_BUFFER);
    I.window.buffers.unbury_buffer(buffer);
}

function eval_expression_or_jquery(I) {
    const s = yield I.minibuffer.read(
        $prompt = "Eval:",
        $history = "eval-expression-or-jquery",
        $completer = new javascript_completer(conkeror));
    if (s.startsWith("$")) {
        const $ = $$(I);
        var result = eval(s);
    } else {
        var result = evaluate(s);
    }
    I.window.minibuffer.message(String(result));
}

interactive(
    "eval-expression-or-jquery",
    "Evaluate Javascript or Jquery statements",
    eval_expression_or_jquery
);

define_key(default_global_keymap, "M-:", "eval-expression-or-jquery");

///

function read_comments(regex) {
    return function (div, $, I) {
        const comments = div.find("a").filter(function () {
            return regex.test($(this).text());
        });
        if (comments.last().clickthis().length === 0) {
            I.minibuffer.message("No comment link found");
        }
    };
}

inoreader_alternate_view(
    "Cory Doctorow",
    read_comments(/^\d+ comments/i)
);

inoreader_alternate_view(
    "Savage Slog",
    read_comments(/comment on this story/i)
);

inoreader_alternate_view(
    "Hacker News",
    read_comments(/Comments/)
);

function daily_wtf_alternate_view(div, $, I) {
    const a = div.find("div.article_title a");
    if (a.length === 0) {
        I.minibuffer.message("Article title not found");
        return;
    }
    new WebRequest(
        a.attr("href"),
        function (document) {
            const comments = document.querySelector("a.comments");
            if (comments) {
                browser_object_follow(I.buffer, OPEN_NEW_BUFFER, comments.getAttribute("href"));
            } else {
                I.minibuffer.message("No comment link found on article page");
            }
        },
        "document"
    ).start();
}

inoreader_alternate_view(
    "The Daily WTF",
    daily_wtf_alternate_view
);

function avgn_alternate_view(div, $, I) {
    const a = div.find("div.article_title a");
    if (a.length === 0) {
        I.minibuffer.message("Article title not found");
        return;
    }
    new WebRequest(
        a.attr("href"),
        function (document) {
            const video = document.querySelector("div.videoarea > iframe[src]");
            if (video) {
                const match = video.getAttribute("src").match(/\byoutube\.com\/embed\/([^/?]+)/);
                if (match) {
                    browser_object_follow(I.buffer, OPEN_NEW_BUFFER, "http://www.youtube.com/watch?v=" + match[1]);
                }
            }
        },
        "document"
    ).start();
}

inoreader_alternate_view(
    "AVGN",
    avgn_alternate_view
);
