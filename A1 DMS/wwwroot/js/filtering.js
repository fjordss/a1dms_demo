var fTables = [];

$.fn.bootstrapTableWithFilters = function (fields, data) {
    var params = {};
    params.id = this.prop("id");
    params.init = false;
    params.table = $(this);
    params.fields = fields;
    params.filteringData = [];
    params.sortingData = {};

    if (data) {
        params.onLoad = data.onLoad;
        params.onCreating = data.onCreating;
        params.onCheck = data.onCheck;
        params.onUncheck = data.onUncheck;
        params.onResetView = data.onResetView;
        params.onColumnSwitch = data.onColumnSwitch;
    }

    params.filterCache = [];

    fTables.push(params);

    params.onColumnSwitch = () => {
        if (params.onLoad)
            params.onLoad();
    }

    params.table.bootstrapTable({
        exportDataType: $(this).val(),
        exportTypes: ['xlsx'],
        exportOptions: {
            onAfterSaveToFile: () => {
                params.filterCache.forEach(el => el.parent.append(el.element));
            },
            onTableExportBegin: () => {
                params.filterCache = [];

                $(".table").find(".filterModal").each((i, el) => {
                    params.filterCache.push({
                        element: $(el),
                        parent: $(el).parent()
                    });

                    $(el).remove();
                });
            }
        },
        formatSearch: () => "Try searching here",
        tableId: params.id,
        onLoadSuccess: function (data) {
            var params = getParams(this.tableId);
            params.data = data;

            if (params.footerExists && params.serverSide) 
                setTotals(params, data.totals);

            if (!params.init) {
                parseUrl(params, this.url);
            }

            if (!params.init) {
                showFilterHeaders(params.id);
                params.filterPromise.done(() => {
                    if (!params.serverSide)
                        getFilterChoices(params.id, params.table.bootstrapTable('getData'));

                    fillFilterChoices(this.tableId);
                });
            }

            if (params.renewFilters) {
                params.renewFilters = false;

                showFilterHeaders(this.tableId);
            }

            if (params.onLoad)
                params.onLoad();

            if (!params.init) {
                var cells = [];
                $("#" + this.tableId).find("thead").find("tr").last().find("th").each((i, cell) => {
                    if ($(cell).hasClass("bs-checkbox"))
                        return true;

                    cells.push($(cell));
                });

                var labels = $("div.btn-group").find("div.dropdown-menu").find("label.dropdown-item");

                for (var i = 0; i < cells.length; i++) {
                    if (cells[i].hasClass("t-hidden")) {
                        labels.eq(i).remove();
                    }
                }
            }

            params.init = true;
        },
        onRefresh: () => {

        },
        onCheck: params.onCheck,
        onUncheck: params.onUncheck,
        onResetView: params.onResetView,
        onColumnSwitch: function() {
            var params = getParams(this.tableId);
            params.renewFilters = true;

            showFilterHeaders(this.tableId);
            if (params.onLoad)
                params.onLoad();
        }
    });

    if (params.onCreating)
        params.onCreating();

    params.footerExists = params.table.attr("data-show-footer") == "true";
    params.serverSide = params.table.attr("data-side-pagination") ===  "server";
    params.filterPromise = params.serverSide ? getFilteringValues(params) : getEmptyPromise();

    $(document).click(() => {
        closeAllModals();
    });

    $(".fixed-table-body").css({ overflow: "initial" });
}

function setTotals(params, totals) {
    var footer = params.table.find("tfoot").find("th");
    var row;
    var rows = params.table.find("thead").find("tr");
    if (rows.length == 2)
        row = rows.eq(1);
    else
        row = rows;

    row.find("th").each((i, el) => {
        var total = totals.find(t => t["Field"] == $(el).attr("data-field"));
        if (total) {
            var hidden = $(el).find("input[type=hidden]");
            var index = hidden.length > 0 ? hidden.val() : i;

            footer.eq(index).find("div.th-inner").text(total["Total"]);
        }
    });
}

function getEmptyPromise() {
    var deferred = $.Deferred();
    deferred.resolve();

    return deferred.promise();
}

function getFilteringValues(params) {
    var deferred = $.Deferred();

    var url = params.table.attr("data-url");
    url += "&filtering=1";

    var match = /[\&\?]{1}handler\=([^\&]*)/g.exec(url)
    if (match)
        url = url.replace("handler=" + match[1], "handler=filtering");
    else
        url += "&handler=filtering";

    $.ajax({
        url: url,
        success: text => {
            var filtering = JSON.parse(text);

            filtering.forEach(f => {
                var field = params.fields.find(field => field.name == f["Field"]);
                if (field && field.filtering) {
                    field.choices = f["Choices"];
                }
            });

            deferred.resolve();
        },
        error: error => {
            deferred.resolve();
            console.error(error);
        }
    });

    return deferred.promise();
}

function parseUrl(params, url) {
    var search = new URL(location.origin + url);

    params.url = search.pathname;
    params.urlHasParams = false;
    var init = false;
    for (var param of search.searchParams.entries()) {
        if (param[0] == "json")
            continue;

        params.urlHasParams = true;

        if (!init) {
            params.url += "?";
            init = true;
        }
        else
            params.url += "&";

        params.url += param[0] + "=" + param[1];
    }
}

function getParams(id) {
    return fTables.find(t => t.id == id);
}

function showFilterHeaders(id) {
    var params = getParams(id);
  
    for (var field of params.fields) {
        if (field.sorting || field.filtering) {
            if (!field.container) {
                var modal = $("<div />").prop({ className: "filterModal", field: field.name });

                field.inner = $("<div />").appendTo(modal);

                field.container = $("<div />").append($("<img />").prop({
                    className: "filterArrow",
                    src: "/images/arrowDown.png"
                })).append(modal);
            }

            field.container.find("img").click(toggleFilter);
            field.container.find("div.filterModal").click(e => {
                e.stopPropagation();
            });

            params.table.find("th[data-field='" + field.name + "']").find(".th-inner").append(field.container);
        }
    }
}

function getFilterChoices(id, data) {
    var params = getParams(id);

    for (var field of params.fields) {
        var name = field.name;
        var choices = [];
        for (var item of data) {
            var choice = item[name] != null && typeof(item[name]) !== "undefined" ? item[name].toString() : "";

            if (choices.indexOf(choice) == -1)
                choices.push(choice);
        }

        choices.sort();

        field.choices = choices;
    }
}

function fillFilterChoices(id) {
    var params = getParams(id);

    
    for (var field of params.fields) {
        var count = 0;

        var inn = [];
        if (field.sorting) {
            count = 2;

            inn.push("<div class='filterItem'><label field-name='" + field.name + "' onclick='sort(\"" + id + "\", \"" + field.name + "\", \"asc\")'>Sort A-Z</label></div>");
            inn.push("<div class='filterItem'><label field-name='" + field.name + "' onclick='sort(\"" + id + "\", \"" + field.name + "\", \"desc\")'>Sort Z-A</label></div>");

            //field.inner.append($("<div class='filterItem' />").append($("<label field-name='" + field.name + "'>Sort A-Z</label>").click(function () { sort($(this).closest("table").prop("id"), $(this).attr("field-name"), "asc"); })));
            //field.inner.append($("<div class='filterItem' />").append($("<label field-name='" + field.name + "'>Sort Z-A</label>").click(function () { sort($(this).closest("table").prop("id"), $(this).attr("field-name"), "desc"); })));
        }

        if (field.filtering) {
            count++;

            inn.push("<div class='filterItem'><input type='checkbox' id='" + field.name + "_all' checked='checked' onclick='allToggle(this, true)' /> <label for='" + field.name + "_all'>Select all</label></div>");
            //field.inner.append($("<div />").prop({ className: "filterItem" }).html("<input type='checkbox' id='" + field.name + "_all' checked='checked' onclick='allToggle(this, true)' /> <label for='" + field.name + "_all'>Select all</label>"));
            
            for (var choice of field.choices) {
                var itemId = id + "_" + field.name + "_" + (choice != null ? choice.toString().replace(/[\s\"\']/g, "_") : "");

                count++;

                inn.push("<div class='filterItem'><input type='checkbox' checked='checked' onclick='allToggle(this, false)' id='" + itemId + "' /> <label for='" + itemId + "'>" + choice + "</label></div>");
                //field.inner.append($("<div />").prop({ className: "filterItem" }).html("<input type='checkbox' checked='checked' onclick='allToggle(this, false)' id='" + id + "' /> <label for='" + id + "'>" + choice + "</label>"));
            }
        }


        field.inner.html("<div>" + inn.join("") + "</div>");
        field.inner.parent().css({ height: (25 * count + 25) + "px" });
    }
}

function toggleFilter(e) {
    var container = $(this).parent().find("div");
    container.css({ top: ($(this).closest("th").height()) + "px" });

    closeAllModals(container);

    if (!container.is(":visible"))
        container.show();

    e.stopPropagation();
}

function allToggle(chb, all) {
    var chbs = $(chb).parent().parent().find("input[type=checkbox]");
    if (all)
        chbs.prop({ checked: $(chb).prop("checked") });
    else {
        if (!$(chb).prop("checked"))
            chbs.eq(0).prop({ checked: false });
        else {
            var allChecked = true;
            chbs.each((i, el) => {
                if (i == 0) return true;

                if (!$(el).is(":checked")) {
                    allChecked = false;
                    return false;
                }
            });

            if (allChecked)
                chbs.eq(0).prop({ checked: true });
        }
    }
}

function filter(id, field, choices) {
    var params = getParams(id);

    if (!params.filteringData)
        params.filteringData = [];

    var update = false;

    var filteringField = params.filteringData.find(p => p.name == field);
    if (choices.indexOf("Select all") != -1) {
        if (filteringField) {
            params.filteringData = params.filteringData.filter(p => p.name != field);
            update = true;
        }
    }
    else {
        if (!filteringField) {
            filteringField = {};
            filteringField.name = field;

            params.filteringData.push(filteringField);

            update = true;
        }

        if (!filteringField.choices)
            filteringField.choices = [];

        if (filteringField.choices.join("|") != choices.join("|"))
            update = true;

        filteringField.choices = choices;
    }

    if (update) {
        updateTable(id);
    }
}

function sort(id, field, type) {
    var params = getParams(id);

    closeAllModals();

    params.sortingData = {};
    params.sortingData.name = field;
    params.sortingData.type = type;

    updateTable(id);
}

function updateTable(id) {
    var params = getParams(id);

    var url = params.url;

    if (params.sortingData || params.filteringData) {
        url += params.urlHasParams ? "&" : "?";

        if (params.sortingData)
            url += "sorting=" + JSON.stringify(params.sortingData) + (params.filteringData ? "&" : "");

        if (params.filteringData)
            url += "filtering=" + JSON.stringify(params.filteringData);
    }

    params.table.bootstrapTable('refresh', { url: url });
}

function closeAllModals(current) {
    $(".filterModal:visible").each((i, el) => {
        if (current && $(el) == current)
            return true;

        var choices = [];
        $(el).find("input[type=checkbox]:checked").each((i, chb) => {
            choices.push($(chb).parent().find("label").text());
        });

        var all = $(el).find("input[type=checkbox]").first().is(":checked");
        $(el).parent().find("img").prop({ src: "/images/arrowDown" + (!all && choices.length > 0 ? "L" : "") + ".png" });

        if (choices.length > 0)
            filter($(el).closest("table").prop("id"), $(el).prop("field"), choices);

        $(el).hide();
    });
}