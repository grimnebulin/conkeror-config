//  This code watches for Wikipedia pages with titles of the form
//  "List of <whatever> episodes".  For such pages, a hyperlink
//  consisting of an asterisk is added to the episode-number column of
//  every episode which, which clicked, takes me to a Pirate Bay
//  search for that episode of the show.

//  Disclaimer: I generally employ this functionality only for shows
//  which I am entitled to view by virtue of my cable television
//  subscription.  Sometimes my TiVo doesn't change channels correctly
//  and doesn't record a show, and I don't care to wait for the rerun;
//  sometimes I'm away from home and don't want to wait till I return
//  to watch something I've recorded.

const pad = function (str) { return str.length < 2 ? pad("0" + str) : str };

const piratebayUrl = function (title, season, episode) {
    return "http://thepiratebay.cr/search/" + encodeURIComponent(
        title.toLowerCase() + " s" + pad(season) + "e" + pad(episode)
    );
};

maybe(
    buffer.document.title.match(/\blist of (.+) episodes\b/i)
).foreach(([_, title]) => {
    $("h3 > span[id]").each(function () {
        maybe(this.id.match(/^Season_(\d+)/)).foreach(([_, season]) => {
            $(this.parentNode)
                .xpath("following-sibling::table[1]//tr/*[2]")
                .each(function () {
                    const episode = $(this).text();
                    if (/^\d+$/.test(episode)) {
                        $("<a><sup>PB</sup></a>")
                            .attr("href", piratebayUrl(title, season, episode))
                            .appendTo(this);
                    }
                });
        });
    });
});
