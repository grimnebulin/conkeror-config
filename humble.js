Components.utils.import("resource://gre/modules/osfile.jsm");

const rank = x => x === "epub" ? 3 : x === "pdf" ? 2 : x === "mobi" ? 1 : 0;

function torrent_all_humble_ebooks(I) {
    const $ = $$(I);
    let index = 1000 + Math.round(Math.random() * 10000);

    const torrents = $("div.js-all-downloads-holder div.row").map(function () {
        const book = $(this);
        const formats = book.find("a.a").map(function () {
            const a = $(this);
            const format = a.text().trim().toLowerCase();
            return [[ format, a.attr("href") ]];
        }).get();
        return [formats.reduce((a, b) => rank(a[0]) > rank(b[0]) ? a : b)];
    }).get();

    if (torrents.length === 0) {
        I.minibuffer.message("No torrents found!");
    } else {
        do_torrent_all_humble_ebooks(torrents, 0, index, []);
    }

}

function do_torrent_all_humble_ebooks(torrents, index, base, files) {
    if (index === torrents.length) {
        shell_command_blind("transmission-gtk " + files.join(" "));
        // clean up files later somehow...
        return;
    }

    const path = OS.Path.join(OS.Constants.Path.tmpDir, `humble-${index+base}.torrent`);
    new WebRequest(
        torrents[index][1],
        function (buffer) {
            OS.File.open(path, { write: true }).then(fh => {
                fh.write(new DataView(buffer)).then(x => {
                    dumpln(`Written to ${path}`);
                    fh.close(); // .then(...)
                    do_torrent_all_humble_ebooks(torrents, index + 1, base, files.concat(path))
                });
            });
        }
    ).responseType("arraybuffer").start();
}

interactive("torrent-all-humble-ebooks", "torrent ebooks", torrent_all_humble_ebooks);
