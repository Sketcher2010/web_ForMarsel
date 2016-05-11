var next_url = "";
var created_time = "0";
var isScrolled = false;
var currentScrollId;
var interval = "";
var vars = getUrlVars();
$( document ).ready(function() {
    if(vars["tag"] == undefined) {
        $("body").html("<form><input type='text' placeholder='Tag name' name='tag'><input type='submit'></form>");
        document.close();
    }
    currentScrollId = $(".post").length;
    next_url = getData(next_url, vars["tag"]);
    setInterval(function(){
        next_url = getData(next_url, vars["tag"]);
    }, 500);
});
function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
function startScroll() {
    if(isScrolled)
        return 0;
    else
        isScrolled = true;
    interval = setInterval(function () {
        if(currentScrollId == 0){
            currentScrollId = $(".post").length-1;
        }
        $(".container").scrollTo($("#post"+currentScrollId), 500);
        currentScrollId--;
    }, 5000);
}
function resetScroll() {
    isScrolled = false;
    currentScrollId = $(".post").length-1;
    clearInterval(interval);
    startScroll();
}

function getData(next_url, tag) {
    var config = {};
    config.Beget = {
        apiKey: '1545509780.b63e58a.7f89fc42de1042e9b3797c88aa2286df',
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
                    created_time = obj.created_time;
                    var txt = obj.caption["text"];
                    var height = screen.height - 100;
                    $("#container").after(
                        "<div id='post" + $(".post").length + "' class='post'><div id='marginPost"+$(".post").length+"'></div><div class='postContainer' id='postContainer" + $(".post").length + "'>" +
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
                        </div>");
                    // $("#marginPost" + $(".post").length).css({"height": (height-$("#postContainer" + $(".post").length).height())/2+"px"});
                    resetScroll();
                }
            }
            res = result.pagination["next_url"];
            if(!isScrolled) {
                startScroll();
            }
            for(var i = $(".post").length-1; i>=0; i--) {
                // $("#marginPost" + i).height(screen.height-$("#postContainer" + i).height);
                // console.log((screen.height-100-$("#postContainer" + i).height())/2);
                $("#marginPost" + i).css({"height": (screen.height-260-$("#postContainer" + i).height())/2+"px"});
            }
            $(".post").css({"height": screen.height+"px"});
        },
        error: function(){console.log('Error!');}
    });
    return res;
}