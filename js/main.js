var next_url = "";
var created_time = "0";
$( document ).ready(function() {
    next_url = getData(next_url, "selet");
    setInterval(function(){
        next_url = getData(next_url, "selet");
    }, 10000);
});
var isScrolled = false;
var currentScrollId = 0;
var interval = "";

function startScroll() {
    if(isScrolled)
        return 0;
    else
        isScrolled = true;
    interval = setInterval(function () {
        if(currentScrollId >= $("#container").children().length){
            currentScrollId = 0;
        }
        $(".container").scrollTo($("#post"+currentScrollId), 500);
        console.log(currentScrollId);
        currentScrollId++;
    }, 5000);
}
function resetScroll() {
    isScrolled = false;
    currentScrollId = 0;
    clearInterval(interval);
    startScroll();
}

function getData(next_url, tag) {
    var config = {};
    config.Beget = {
        apiKey: '1545509780.b63e58a.7f89fc42de1042e9b3797c88aa2286df', // Сюда нужно вставить какой-нибудь публичный токен для работы с instagram. (пока стоит мой личный)
        apiHost: 'https://api.instagram.com/'
    };
    var res = "";
    if(next_url != "") {
        var url = next_url;
    } else {
        var url = config.Beget.apiHost + 'v1/tags/' + tag + '/media/recent?access_token=' + config.Beget.apiKey;
    }

    $.ajax({
        dataType: 'jsonp',
        cache: false,
        url: url,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        success: function(result) {
            for(var i = result.data.length-1; i>=0; i--) {
                var obj = result.data[i];
                if(parseInt(created_time) < parseInt(obj.created_time)) {
                    console.log("last: "+created_time+"; now: "+obj.created_time);
                    created_time = obj.created_time;
                    var txt = obj.caption["text"];
                    var height = screen.height - 170;
                    $("#container").html(
                        "<div id='post" + (result.data.length-$(".post").length-1) + "' class='post'><div class='postContainer' id='postContainer" + (result.data.length-$(".post").length-1) + "'>" +
                        "<img src='" + obj.images["standard_resolution"]["url"] + "' class='insta-photo'>" +
                        "<div class=\"insta-author\">\
                            <div class=\"left\">\
                                <img src=\"" + obj.user["profile_picture"] + "\" width=\"40\" alt=\"\">\
                                </div>\
                                <div class=\"right\">\
                                    <a href=\"" + obj.link + "\" target=\"_blank\">" + obj.user["username"] + "</a><br>\
                                    <span class=\"like-count\">\
                                    <span class=\"icon-heart\"></span>" + obj.likes["count"] + "</span>\
                                </div>\
                            <p>" + txt.replace(/(\#(.*?)[^\s]+)/gi, '<span class="thatHashTag">$1</span>') + "</p>\
                            </div></div>\
                        </div>"+$("#container").html());
                    $("#post" + (result.data.length-$(".post").length-1)).css({"padding-top": ((height - $("#postContainer" + (result.data.length-$(".post").length-1)).height()) / 2) + "px"});
                    resetScroll();
                }
            }
            res = result.pagination["next_url"];
            if(!isScrolled) {
                startScroll();
            }
            $(".post").css({"height": height - (height - $("#postContainer" + ($(".post").length)).height()) / 16 + "px"});
        },
        error: function(){console.log('Error!');}
    });
    return res;
}