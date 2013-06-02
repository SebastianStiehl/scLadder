$(function () {
    var maxIndex = 20,
        highlightNames = ["idra", "demuslimrc", "catz", "liquidtlo", "liquidtaeja", "whitera"],
        template = $("#listTemplate").html();

    function removeClanName(user) {
        user.name = user.name.replace(/\[.+\]/, "");
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
        $topUsersList.append("<div>loading...</div>");


        $.getJSON(serviceUrl, function (data) {
            var templateOutput, date = new Date();

            $.each(data.users, function (index, user) {
                removeClanName(user);
                addHighlightClass(user, index, restUser);
            });

            templateOutput = Mustache.render(template, {
                users: data.users.splice(0, maxIndex),
                restUser: restUser,
                date: data.date
            });

            $topUsersList.empty();
            $topUsersList.append(templateOutput);
        });
    }

    function load() {
        $(".ladderContainer").each(function (index, ladderContainer) {
            var $button = $(ladderContainer).find("button"),
                $list = $(ladderContainer).find(".tableContainer"),
                actionUrl = $button.attr("data-action-url");

            getData($list, actionUrl);

            $button.on("click", function () {
                getData($list, actionUrl + "?forceRefresh=true");
            });
        });
    }

    load();
});