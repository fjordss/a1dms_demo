$.fn.advancedFile = function (params) {
    var file = $(this);

    var id = file.prop("id");
    if (!id)
        return;

    file.addClass("fileInput");

    $("<label />")
        .addClass("fileInputLabel")
        .prop({ for: id })
        .text(params && params.label ? params.label : "Choose file")
        .insertAfter(file);

    return file;
}