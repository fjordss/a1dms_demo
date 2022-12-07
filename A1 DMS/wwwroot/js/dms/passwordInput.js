$.fn.advancedPassword = function () {
    $(this)
        .focus(onPassFocus)
        .blur(onPassBlur)
        .click(onPassClick)
        .mousemove(onPassMouseMove);

    return $(this);
}

var passShow = false;

function onPassMouseMove(e) {
    var input = $(e.currentTarget);
    input.css({ cursor: isPassHit(input, e) ? "default" : "" })
}

function onPassClick(e) {
    var input = $(e.currentTarget);

    if (isPassHit(input, e)) {
        passShow = !passShow;
        input.css({
            background: "url(\"/images/" + (!passShow ? "view" : "invisible") + ".png\") no-repeat",
            backgroundColor: "",
            backgroundPosition: "right 10px center"
        });

        input.prop({ type: passShow ? "text" : "password" });
    }
}

function isPassHit(input, e) {
    var width = input.outerWidth();
    var height = input.outerHeight();

    var offset = 2;

    var x2 = width - 10 - offset;
    var x1 = x2 - 16 - offset;

    var y1 = (height - 16) / 2;
    var y2 = y1 + 16;

    return e.offsetX >= x1 && e.offsetX <= x2 && e.offsetY >= y1 && e.offsetY <= y2;
}

function onPassFocus(e) {
    var input = $(e.currentTarget);
    input.css({
        background: "url(\"/images/view.png\") no-repeat",
        backgroundColor: "",
        backgroundPosition: "right 10px center",
    });
}

function onPassBlur(e) {
    var input = $(e.currentTarget);
    input.css({
        background: "",
        backgroundColor: ""
    });
    input.prop({ type: "password" });

    passShow = false;
}