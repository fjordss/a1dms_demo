$.fn.toggleLanguage = function (onChange) {
    lc_switch(this, {
        on_txt: 'rus',
        off_txt: 'eng'
    });

    if (onChange) {
        this.parent().find(".lcs_switch").click(() => {
            onChange(this);
        });
    }

    return this;
}