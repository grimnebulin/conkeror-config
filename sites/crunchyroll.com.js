$(".guestbook.comments").onSubtreeMutation(function () {
    // Press "More Comments" button as often as it appears:
    this.find("input[type='button'][value='More Comments']")
        .filter(function () { return $(this).css("display") !== "none" })
        .clickthis();
    // Show all spoiler and hidden comments:
    this.find("a[title='Show Spoiler Comment'], a[title='Show Hidden Comment']")
        .clickthis();
});
