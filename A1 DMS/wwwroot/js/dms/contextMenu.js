$.fn.contextMenu = function (data) {
    var width = data.width ? data.width : 150;

    this.on("contextmenu", e => {
        var container = $("<div />")
            .prop({ className: "contextMenu" })
            .css({
                width: width + "px",
                position: "absolute",
                left: ((e.clientX > document.body.clientWidth - width) ? e.clientX - width : e.clientX) + "px",
                top: e.clientY + "px"
            })
            .on("contextmenu", e => e.preventDefault());

        for (let item of data.items) {
            var menuItem = $("<div />")
                .prop({ className: !item.isDelimiter ? "menuItem" : "delimiter" })
                .text(item.name);

            if (item.click)
                menuItem.on("mouseup", () => item.click(e));

            container.append(menuItem);
        }

        var remove = () => $(".contextMenu").remove();
        remove();

        $(document.body).append(container);
        $(document).click(remove);
        $(document).on("contextmenu", remove);

        e.preventDefault();
        e.stopPropagation();
    })

    return this;
}