var __SITE__='http://localhost:3000/api'
var __ROOT__='http://localhost:3000'
moment.relativeTime = {
    future: "in %s",
    past: "%s ago",
    s: "seconds",
    m: "a minute",
    mm: "%d minutes",
    h: "an hour",
    hh: "%d hours",
    d: "a day",
    dd: "%d days",
    M: "a month",
    MM: "%d months",
    y: "a year",
    yy: "%d years"
};
$(function(){
    $("#user_box").tooltip({position:"bottom left",offset:[4,0],opacity:1,delay:300})

    $("#upload_avatar").click(function(){
        $("#set_avatar").focus()
    })
})
