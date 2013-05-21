$(function () {
    var maxIndex = 20,
        highlightNames = ["idra", "demuslimrc", "catz", "liquidtlo", "liquidtaeja", "whitera"],
        template = $("#listTemplate").html();

    function removeClanName(user) {
        user.name = user.name.replace(/\[.+\]/, "");
    }

    function addZeroBeforeIndex(user) {
        if (user.index < 10) {
            user.index = "0" + user.index.toString();
        }
    }

    function addHighlightClass(user, index, restUser) {
        if (($.inArray(user.name.toLocaleLowerCase(), highlightNames) !== -1)) {
            user.className = "high";
            if (index >= maxIndex) {
                restUser.push(user);
            }
        }
    }

    function getData($topUsersList, serviceUrl) {
        var restUser = [];

        $topUsersList.empty();
        $topUsersList.append("<tr><td colspan='3'>loading...</td></tr>");


        $.getJSON(serviceUrl, function (data) {
            var templateOutput, date = new Date();

            $.each(data.users, function (index, user) {
                removeClanName(user);
                addZeroBeforeIndex(user);
                addHighlightClass(user, index, restUser);
            });

            $topUsersList.empty();
            $topUsersList.append("<tr><td colspan='3'>" + data.date + "</td></tr>");
            $topUsersList.append("<tr><td colspan='3'>&nbsp;</td></tr>");


            templateOutput = Mustache.render(template, {users: data.users.splice(0, maxIndex)});
            $topUsersList.append(templateOutput);

            templateOutput = Mustache.render(template, {users: restUser});
            $topUsersList.append("<tr><td colspan='3'>...</td></tr>");
            $topUsersList.append(templateOutput);
        });
    }

    function load() {
        $("button").each(function (index, button) {
            var $button = $(button),
                $list = $button.parents("div:first").find("table"),
                actionUrl = $button.attr("data-action-url");

            getData($list, actionUrl);

            $button.on("click", function () {
                getData($list, actionUrl + "?forceRefresh=true");
            });
        });
    }

    load();
});