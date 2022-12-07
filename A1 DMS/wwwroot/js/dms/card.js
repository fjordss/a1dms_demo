var promises = [];

$(() => {
    var fileInput = $("#file");
    if (fileInput.length > 0)
        fileInput.advancedFile({ label: filePickerLabel }).change(uploadFiles);
});

function showAttachments() {
    //addFileInput();

    $("#attachmentsTable").show();
    $("#showAttachments").hide();
}

function addFileInput() {
    var table = $("#attachmentsTable").get(0);
    var row = table.insertRow();
    var cell = row.insertCell();

    $("<img />").prop({ src: "/images/minus.png" }).addClass("fileInputMinus").appendTo($(cell)).click(e => {
        $(e.currentTarget).closest("tr").remove();
    });

    cell = row.insertCell();

    $(row.insertCell()).html("<span> &nbsp; </span>");

    $("<input />")
        .prop({
            type: "file",
            id: createGuid(),
            multiple: true
        })
        .appendTo($(cell))
        .advancedFile()
        .change(uploadFile);
}

function uploadFiles(e) {
    var deferred = $.Deferred();

    promises.push(deferred.promise())

    var input = e.currentTarget;
    var cell = $(input).closest("tr").find("td").last().html("");
    $("<img />").prop({ src: "/images/filePreloader.gif" }).appendTo(cell);

    disableSubmit();

    if (window.FileReader) {
        let formData = new FormData();
        for (var i = 0; i < input.files.length; i++)
            formData.append("files", input.files[i]);

        var resolve = () => {
            deferred.resolve();

            cell.html("");
            $.when.apply($, promises).done(() => enableSubmit());
        }

        $.ajax({
            url: "/index?handler=upload",
            type: "POST",
            data: formData,
            headers: { "RequestVerificationToken": $('input[name="__RequestVerificationToken"]').val().toString() },
            processData: false,
            contentType: false,
            success: content => {
                resolve();

                var data = JSON.parse(content);
                for (var i = 0; i < data.length; i++) {
                    var fileName = input.files[i].name;
                    var a = $("<a />")
                        .prop({
                            href: "",
                            target: "_blank"
                        })
                        .text(fileName);

                    if (!data[i].result) {
                        a
                            .prop({ title: data[i].content })
                            .css({
                                color: "red",
                                textDecoration: "underline",
                                textDecorationStyle: "dashed",
                                cursor: "default"
                            })
                            .click(() => false);
                    }
                    else
                        a.prop({ href: "/getAttachment?tempId=" + data[i].content });

                    var files = $("#files");

                    var file = $("<div />")
                        .attr("tempId", data[i].content)
                        .css("display", "inline-block")
                        .attr("error", !data[i].result)
                        .append(a)
                        .append(" ")
                        .append(
                            $("<img />")
                                .prop("src", "/images/close.png")
                                .css({ width: "10px", cursor: "pointer" })
                                .click(deleteFile)
                        )
                        .append(" &nbsp; ");

                    files.append(file);
                }
            },
            error: (e) => {
                resolve();

                cell.html("<span style='color:red'>Failed to upload files</span>");

                console.error(e);
            }
        });
    }
}

function deleteFile(e) {
    var container = $(e.currentTarget).parent();

    if (container.attr("error") == "false") {
        if (confirm("Do you want to delete this file?")) {
            deleteFileAjax(container);
        }
    }
    else {
        container.remove();
    }
}

function deleteFileAjax(container) {
    var deferred = $.Deferred();
    promises.push(deferred.promise());

    disableSubmit();

    var resolve = () => {
        deferred.resolve();

        $.when.apply($, promises).done(() => enableSubmit());

        container.remove();
    }

    $.ajax({
        url: "/index?handler=deleteFile&tempId=" + container.attr("tempId"),
        type: "POST",
        headers: { "RequestVerificationToken": $('input[name="__RequestVerificationToken"]').val().toString() },
        success: content => {
            resolve();
        },
        error: error => {
            resolve();

            console.error(error);
        }
    });
}

function onReceived(e, file) {
    if (e.target.readyState !== FileReader.DONE)
        return;

    var bytes = new Uint8Array(e.target.result);
    var binary = "";
    for (var b = 0; b < bytes.length; b++) {
        binary += String.fromCharCode(bytes[b]);
    }

    console.log(binary);
}

function disableSubmit() {
    $("input[type=submit]").prop({ disabled: true });
}

function enableSubmit() {
    $("input[type=submit]").prop({ disabled: false });
}

function createGuid() {
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now();
    }

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}