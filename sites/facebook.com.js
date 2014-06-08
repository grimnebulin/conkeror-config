// Remove ads in the right column:

$("#rightCol").onSubtreeMutation(function () {
    this.find("div[data-ad]").remove()
});

// Remove suggested posts:

$("#contentArea").onSubtreeMutation(function () {
    this.find("span")
        .filter(function () {
            return this.childNodes.length == 1 &&
                 $(this).text() == "Suggested Post"
        })
        .closest("div[data-dedupekey]")
        .remove();
});
