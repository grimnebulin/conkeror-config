// Perpetually remove ads in the right column:

$("#rightCol").onSubtreeMutation(function () {
    this.find("div[data-ad]").remove();
});

// Perpetually remove Suggested Posts:

$("#contentArea").onSubtreeMutation(function () {
    this.find("span")
        .filter(function () {
            return this.childNodes.length == 1
                && this.childNodes[0].nodeValue == "Suggested Post";
        })
        .closest("div[data-dedupekey]")
        .remove();
});
