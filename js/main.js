var next_url = "";
var created_time = "0";
var isScrolled = false;
var currentScrollId, totalCount = 0, countNow = 0;
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
        currentScrollId = currentScrollId - 4;
        if(currentScrollId <= 0){
            currentScrollId = totalCount;
        }
        if(totalCount > countNow) {
            currentScrollId = totalCount;
            countNow = totalCount;
        }
        $(".container").scrollTo($("#post"+currentScrollId), 500);
        console.log(currentScrollId);
    }, 5000);
}
function resetScroll() {
    isScrolled = false;
    currentScrollId = $(".post").length-1;
    $(".container").scrollTo($("#post"+currentScrollId), 500);
    clearInterval(interval);
    console.log("clearing!");
    startScroll();
}

function getData(next_url, tag) {
    var config = {};
    config.Beget = {
        apiKey: '1681582268.b63e58a.66c3da1c478747fd8fc518b913e73d08',
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
                    $("#container").after(
                        "<div id='post" + $(".post").length + "' class='post'>" +
                            "<div id='marginPost"+$(".post").length+"'></div>\
                            <div id='postContainer"+$(".post").length+"' class='postContainer'>\
                                <div class=\"insta-author\">\
                                    <div class=\"left\">\
                                        <img src=\"" + obj.user["profile_picture"] + "\" width=\"40\" alt=\"\">\
                                    </div>\
                                    <div class=\"right\">\
                                         <a href=\"" + obj.link + "\" target=\"_blank\">" + obj.user["username"] + "</a><br>\
                                         <span class=\"like-count\">\
                                         <span class=\"icon-heart\"></span>" + obj.likes["count"] + "</span>\
                                    </div>\
                                 </div>\
                                <img src='" + obj.images["low_resolution"]["url"] + "' class='insta-photo'>\
                                <p>" + txt.replace(/(\#((.*?)[^\s]+))/gi, '<a href="?tag=$2" class="thatHashTag">$1</a>') + "</p>\
                            </div>\
                        </div>");
                        totalCount = $(".post").length;
                    // resetScroll();
                }
            }
            res = result.pagination["next_url"];
            if(!isScrolled) {
                startScroll();
            }
            for(var i = $(".post").length-1; i>=0; i--) {
                 $("#marginPost" + i).css({"height": (screen.height-260-$("#postContainer" + i).height())/2+"px"});
            }
            $(".post").css({"height": screen.height+"px"});
        },
        error: function(){console.log('Error!');}
    });
    return res;
}