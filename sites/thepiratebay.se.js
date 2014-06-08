// Eliminate all of the annoying ads:

const main = $("div#main-content");

main.prevAll().remove();
main.nextAll().remove();
main.parent().nextAll().remove();

$("div.ad").remove();
$("iframe").remove();
