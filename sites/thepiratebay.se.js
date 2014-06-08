// Eliminate all of the annoying ads:

const main = $("div#main-content");

main.prevAll()
    .add(main.nextAll())
    .add(main.parent().nextAll())
    .add("div.ad")
    .add("iframe")
    .remove();
