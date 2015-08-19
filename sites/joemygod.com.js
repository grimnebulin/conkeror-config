autoload_disqus_comments();

$.onDocumentMutation(function () {
    return $("nav").remove().length > 0;
});
