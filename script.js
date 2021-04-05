var _this = this;
$(function () {
    var options = {
        exportEnabled: true,
        animationEnabled: false,
        title: {
            text: "My Live Reports"
        },
        subtitles: [
            { text: "text" }
        ],
        axisX: {
            title: "Time"
        },
        axisY: {
            title: "Value In USD",
            titleFontColor: "#4F81BC",
            lineColor: "#4F81BC",
            labelFontColor: "#4F81BC",
            tickColor: "#4F81BC"
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            itemclick: toggleDataSeries
        },
        data: []
    };
    function toggleDataSeries(e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        }
        else {
            e.dataSeries.visible = true;
        }
        e.chart.render();
    }
    // DOM
    var leftArrow = $('.fa-arrow-left');
    var rightArrow = $('.fa-arrow-right');
    var currentPageTitle = $('#current-page-title');
    var navbarLeftTitle = $('#navbar-left-title');
    var navbarRightTitle = $('#navbar-right-title');
    var mainCont = $('#main-cont');
    var translate = document.querySelectorAll('.translate');
    // TOOLS
    var arrowClickBlocker = false;
    var lastLoadCoinArrCopy; // for the search option
    var getHistoryObj = {}; // for the 2 min requirement
    var liveReportsArr = []; // for the live reports feature
    var namesArr = []; // for the module names under syms
    var coinGridWidth = 100; // for the parallex scrolling of coingrid
    var bgImgSpeed = -10; // for the parallex scrolling 
    var lastScrollTop; // for the parallex scrolling - direction detection
    var coins = $('.coin'); // for the coins parallex & size in coingrid
    leftArrow.click(function () {
        leftArrowFoo();
        if ($(window).width() >= 480) {
            scrollDown();
        }
    });
    rightArrow.click(function () {
        rightArrowFoo();
        if ($(window).width() >= 480) {
            scrollDown();
        }
    });
    var elements = $('body>*');
    for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
        var element = elements_1[_i];
        if (element.clientWidth > 360) {
        }
    }
    $(window).scroll(function () {
        var scroll = window.pageYOffset;
        var navSpeed = 0;
        var mainContSpeed = 0;
        var titleSpeed = -.9;
        var startBtnSpeed = -.4;
        $('#navbar').css('transform', "translateY(" + scroll * navSpeed + "px)");
        $('#main-cont').css('transform', "translateY(" + scroll * mainContSpeed + "px)");
        $('#title').css('transform', "translateY(" + scroll * titleSpeed + "px)");
        $('#start-btn').css('transform', "translateY(" + scroll * startBtnSpeed + "px)");
        $('body').css('background-position-y', bgImgSpeed + "px");
        var randomCoinSpeed = [];
        for (var _i = 0, coins_1 = coins; _i < coins_1.length; _i++) {
            var coin = coins_1[_i];
            var random = Math.random() / 8;
            randomCoinSpeed.push(random);
        }
        var st = $(_this).scrollTop();
        if (st > lastScrollTop) {
            // downscroll code
            if (coinGridWidth > 90) {
                coinGridWidth -= .5;
            }
            bgImgSpeed += 1;
        }
        else {
            // upscroll code
            if (coinGridWidth < 100) {
                coinGridWidth += .5;
            }
            bgImgSpeed -= 1;
        }
        lastScrollTop = st;
        $('#coin-grid').css('width', '100%'); // ! TO DELETE AND APPL YTO CSS WHEN WORKING
        $('#coin-grid').css('width', coinGridWidth + "%");
    });
    $('body').keydown(function (e) {
        if (e.which == 39) {
            rightArrowFoo();
            if ($(window).width() >= 480) {
                scrollDown();
            }
        }
    });
    $('body').keydown(function (e) {
        if (e.which == 37) {
            leftArrowFoo();
            if ($(window).width() >= 480) {
                scrollDown();
            }
        }
    });
    $("#start-btn").click(function () {
        scrollDown();
    });
    onload();
    loadCoins();
    // FUNCTIONS
    function onload() {
        setInterval(liveReportsUpdate, 2000);
        if (localStorage.getHistoryObj) {
            getHistoryObj = JSON.parse(localStorage.getHistoryObj);
        }
        if (localStorage.liveReportsArr) {
            liveReportsArr = JSON.parse(localStorage.liveReportsArr);
        }
        if (localStorage.data) {
            options.data = JSON.parse(localStorage.data);
        }
        if (localStorage.namesArr) {
            namesArr = JSON.parse(localStorage.namesArr);
        }
    }
    function loadCoins() {
        $("#coin-grid").css({ "display": "flex" });
        $("#coin-grid").addClass("flex-cc");
        var loadingAn = $("\n\t\t\t<div class=\"loading-cont-big flex-cc\">\n\t\t\t\t<div class=\"loading-big\"></div>\n\t\t\t</div>\n\t\t");
        $('#coin-grid').append(loadingAn);
        var coinArr = [];
        $.get("https://api.coingecko.com/api/v3/coins/list", function (data) {
            loadingAn.remove();
            $("#coin-grid").css({ "display": "grid" });
            $("#coin-grid").removeClass("flex-cc");
            for (var i = 1; i < 101; i++) { //from 1 because 'whirl fincnace' (first coin) is acting weird having an  id of ""
                coinArr.push(data[i]);
            }
        }).done(function () {
            lastLoadCoinArrCopy = coinArr;
            for (var j = 0; j < coinArr.length; j++) {
                dressCoin(coinArr[j]);
            }
        });
        // search e listeners
        $('#search-btn').click(function () { search(); $('#search-input').val(""); });
        $('#search-input').keydown(function (e) {
            if (e.key == 'Enter') {
                search();
                $('#search-input').val("");
            }
        });
    }
    function dressCoin(coinObj) {
        //TOOLS
        var moreInfoClickWatch = false;
        // let ccTogWatch:Boolean = false; // false is disabled, this var is for the live reports feature
        var coinCell = $("\n\t<div class=\"coin-cell fcol flex-sbs\">\n\t\t<div class=\"fcol flex-sbs cc-top\">\n\t\t\t<div class=\"cc-sym\">" + coinObj.symbol + "</div>\n\t\t\t<div class=\"cc-name\">" + coinObj.name + "</div>\n\t\t\t<button class=\"cc-more\">More info</button>\n\t\t\t<label class=\"toggle cc-tog tog-lr-tool\">\n\t\t\t\t<input type=\"checkbox\" class=\"cToggle\" class=\"cc-tog\"/>\n\t\t\t\t<span class=\"slider cc-tog\"></span>\n\t\t\t</label>\n\t\t</div>\n\t\t<div class=\"cc-bot flex-sbc fcol\">\n\t\t</div>\n\t</div>\n\t");
        if (jQuery.inArray(coinObj.symbol, liveReportsArr) != -1) {
            coinCell.find('.cToggle').prop("checked", "true");
            coinCell.find('.cToggle').addClass('protected');
        }
        if (liveReportsArr.length == 5) {
            $('#coin-grid').find('.cToggle:not(.protected)').prop('disabled', 'true');
        }
        coinCell.find('.cc-bot').hide();
        $('#coin-grid').append(coinCell);
        // E LISTENER TO THE TOG INPUT
        coinCell.find('.cToggle').click(function (e) {
            if (liveReportsArr.length <= 5) {
                if (jQuery.inArray(coinObj.symbol, liveReportsArr) == -1) {
                    // ADD TO ARRAY AND OBJ
                    liveReportsArr.push(coinObj.symbol);
                    namesArr.push(coinObj.name);
                    localStorage.namesArr = JSON.stringify(namesArr);
                    localStorage.liveReportsArr = JSON.stringify(liveReportsArr);
                    options.data.push({
                        type: "spline",
                        name: coinObj.symbol,
                        showInLegend: true,
                        xValueFormatString: "HH mm ss",
                        yValueFormatString: "#,##0 $",
                        dataPoints: [
                        // { x: 1950, y: 1 },
                        ]
                    });
                    localStorage.data = JSON.stringify(options.data);
                    e.target.className += " protected";
                }
                else {
                    var index = jQuery.inArray(coinObj.symbol, liveReportsArr);
                    liveReportsArr.splice(index, 1);
                    localStorage.liveReportsArr = JSON.stringify(liveReportsArr);
                    options.data.splice(index, 1);
                    localStorage.data = JSON.stringify(options.data);
                    e.target.className = "cToggle";
                }
            }
            if (liveReportsArr.length == 5) {
                $('#coin-grid').find('.cToggle:not(.protected)').prop('disabled', 'true');
            }
            else {
                $('#coin-grid').find('.cToggle').removeAttr('disabled');
            }
        });
        // MODULE
        coinCell.find('label').click(function (e) {
            //TOOLS
            var sym; //helps remove the right coin from liveReportArr
            if (!$('#overcoin-alert').length) {
                var newCoin_1 = $(e.currentTarget).siblings('.cc-sym')[0].textContent; // to use when replacing coins
                // console.dir($(e.currentTarget));
                var status_1 = $(e.currentTarget).find('.cToggle').is(':disabled');
                if (status_1) {
                    $('#main-cont').html('');
                    $('body').append($("\n\t\t\t\t<div id=\"overcoin-alert\" class=\"flex-cc fcol\">\n\t\t\t\t\t<div id=\"oca-cont\" class=\"fcol flex-cc\">\n\t\t\t\t\t\t<div id=\"overcoin-mess\" class=\"fcol flex-sbc\">\n\t\t\t\t\t\t\t<div class=\"flex-cc\">\n\t\t\t\t\t\t\t\tWhoops!\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"flex-sbc fcol\" id=\"overcoin-blah\">\n\t\t\t\t\t\t\t\t<div class=\"flex-cc\">\n\t\t\t\t\t\t\t\t\tYou want to add&nbsp; <span>" + newCoin_1 + "</span> &nbsp;to Live Reports. \n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"flex-cc\">\n\t\t\t\t\t\t\t\t\tYou've reached the limit of live-reported coins (5).\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"flex-cc\">\n\t\t\t\t\t\t\t\t\tYou can trade-off an existing live reported coin for this one.\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div id=\"overcoin-cc-cont\" class=\"flex-sbc\"></div>\n\t\t\t\t\t\t<div id=\"oc-validation\">\n\t\t\t\t\t\t\tWill be traded for the SYM coin.\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"flex-sbc oc-btn-disabled\" id=\"oc-btn-cont\">\n\t\t\t\t\t\t\t<button class=\"oc-btn\" id=\"overcoin-tradeoff-btn\" disabled>Trade-Off</button>\n\t\t\t\t\t\t\t<button class=\"oc-btn\" id=\"overcoin-cancel-btn\">Cancel</button>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t"));
                    $('#coin-grid').css({ "height": "fit-content" });
                    for (var _i = 0, liveReportsArr_1 = liveReportsArr; _i < liveReportsArr_1.length; _i++) {
                        var item = liveReportsArr_1[_i];
                        // $(`
                        // <div class="overcoin-cc flex-sbc fcol">
                        // <div class="flex-sc">${item}</div>
                        // <div class="flex-sc" id="oc-cc-name">${namesArr[liveReportsArr.indexOf(item)]}</div>
                        // </div>
                        // `).appendTo($('#overcoin-cc-cont'));
                        $("\n\t\t\t\t\t\t<div class=\"coin-cell fcol flex-sbs overcoin-cc-2\">\n\t\t\t\t\t\t\t<div class=\"fcol flex-sbs cc-top\">\n\t\t\t\t\t\t\t\t<div class=\"cc-sym\">" + item + "</div>\n\t\t\t\t\t\t\t\t<div class=\"cc-name\">" + namesArr[liveReportsArr.indexOf(item)] + "</div>\n\t\t\t\t\t\t\t\t<label class=\"toggle cc-tog tog-lr-tool\">\n\t\t\t\t\t\t\t\t\t<input type=\"checkbox\" class=\"cToggle\" checked class=\"cc-tog\"/>\n\t\t\t\t\t\t\t\t\t<span class=\"slider cc-tog\"></span>\n\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t").appendTo($('#overcoin-cc-cont'));
                    }
                    $('.cToggle').click(function (e) {
                        $('.oc-temp-validator').remove();
                        $('.cToggle').removeAttr('checked');
                        $('.cToggle').prop("checked", true);
                        $(e.target).prop("checked", false);
                        sym = $(e.target).parent().parent().find('.cc-sym').text();
                        $("\n\t\t\t\t\t<div class=\"oc-temp-validator\">\n\t\t\t\t\t\tDo you want <span>" + newCoin_1 + "</span> to replace <span>" + sym + "</span> in your live reports?\n\t\t\t\t\t</div>\n\t\t\t\t\t").insertBefore('#oc-btn-cont');
                        // $('#overcoin-alert span').css({"color": "red", "font-size":"1.5rem"});
                        $('#overcoin-tradeoff-btn').removeAttr('disabled');
                    });
                    $('#overcoin-cancel-btn').click(function () {
                        mainCont.html("\n\t\t\t\t\t\t<div id=\"home-body\" class=\"flex-sc fcol\">\n\t\t\t\t\t\t\t<div id=\"search-bar\" class=\"flex-cc translate\" data-speed=\"0.7\">\n\t\t\t\t\t\t\t\t<div class=\"flex-sbc\" id=\"search-bar-cont\">\n\t\t\t\t\t\t\t\t\t<input type=\"search\" id=\"search-input\" class=\"flex-sbc\" placeholder=\"SYM\">\n\t\t\t\t\t\t\t\t\t<button id=\"search-btn\" class=\"flex-cc\"><i class=\"fas fa-search\"></i></button>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div id=\"coin-grid\">\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t");
                        loadCoins();
                        $('#overcoin-alert').remove();
                    });
                    $('#overcoin-tradeoff-btn').click(function () {
                        $('#home-body').remove();
                        var index = jQuery.inArray(sym, liveReportsArr);
                        liveReportsArr[index] = newCoin_1;
                        options.data[index] = {
                            type: "spline",
                            name: newCoin_1,
                            showInLegend: true,
                            xValueFormatString: "HH mm ss",
                            yValueFormatString: "#,##0 $",
                            dataPoints: [
                            // { x: 1950, y: 1 },
                            ]
                        };
                        localStorage.liveReportsArr = JSON.stringify(liveReportsArr);
                        localStorage.data = JSON.stringify(options.data);
                        mainCont.html("\n\t\t\t\t\t\t<div id=\"home-body\" class=\"flex-sc fcol\">\n\t\t\t\t\t\t\t<div id=\"search-bar\" class=\"flex-cc translate\" data-speed=\"0.7\">\n\t\t\t\t\t\t\t\t<div class=\"flex-sbc\" id=\"search-bar-cont\">\n\t\t\t\t\t\t\t\t\t<input type=\"search\" id=\"search-input\" class=\"flex-sbc\" placeholder=\"SYM\">\n\t\t\t\t\t\t\t\t\t<button id=\"search-btn\" class=\"flex-cc\"><i class=\"fas fa-search\"></i></button>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div id=\"coin-grid\">\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t");
                        loadCoins();
                        $('#overcoin-alert').remove();
                    });
                }
            }
        });
        // E LISTENER FOR MORE INFO BTN
        coinCell.find('.cc-more').click(function () {
            if (!moreInfoClickWatch) {
                coinCell.find('.cc-bot').empty();
                var loading_1 = $("\n\t\t\t\t\t<div class=\"loading-cont flex-cc\">\n\t\t\t\t\t<div class=\"loading\"></div>\n\t\t\t\t");
                coinCell.find('.cc-bot').append(loading_1);
                // coinCell.append(loading)
                if (coinCell.height() > 142) {
                    coinCell.find('.cc-bot').show();
                }
                else {
                    coinCell.find('.cc-bot').slideToggle();
                }
                // get the info from second API, only if 2mins have passed sinced last
                if (getHistoryObj[coinObj.id] && new Date().getTime() - getHistoryObj[coinObj.id].time < 120000) {
                    console.log('got it from local');
                    loading_1.remove();
                    var ccBotContent = $("\n\t\t\t\t\t<div class=\"flex-cc cc-img-cont\">\n\t\t\t\t\t\t<img src=\"" + getHistoryObj[coinObj.id].img + "\" alt=\"\" class=\"cc-pic\">\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"flex-sc\">Price per unit:</div>\n\t\t\t\t\t<div class=\"cc-tousd flex-sc\">USD: " + getHistoryObj[coinObj.id].usd + "$</div>\n\t\t\t\t\t<div class=\"cc-tonis flex-sc\">EUR: " + getHistoryObj[coinObj.id].eur + "\u20AC</div>\n\t\t\t\t\t<div class=\".cc-toeur flex-sc\">ILS: " + getHistoryObj[coinObj.id].nis + "\u20AA</div>\n\t\t\t\t\t");
                    coinCell.find('.cc-bot').append(ccBotContent);
                    // ccBot.css("display", "none")
                    // ccBot.slideDown();
                    moreInfoClickWatch = true;
                }
                else {
                    if (getHistoryObj[coinObj.id] && new Date().getTime() - getHistoryObj[coinObj.id].time > 120000) {
                        delete getHistoryObj[coinObj.id];
                        localStorage.getHistoryObj = JSON.stringify(getHistoryObj);
                    }
                    console.log('got it from api');
                    $.get("https://api.coingecko.com/api/v3/coins/" + coinObj.id, function (data) {
                        getHistoryObj[coinObj.id] = {
                            img: data.image.small,
                            usd: data.market_data.current_price.usd,
                            eur: data.market_data.current_price.eur,
                            nis: data.market_data.current_price.ils,
                            time: new Date().getTime()
                        };
                        localStorage.getHistoryObj = JSON.stringify(getHistoryObj);
                        // setTimeout(() => {
                        // 	delete getHistoryObj[coinObj.id]
                        // 	localStorage.getHistoryObj = JSON.stringify(getHistoryObj);
                        // }, 120000);
                        loading_1.remove();
                        var ccBotContent = $("\n\t\t\t\t\t\t<div class=\"flex-cc cc-img-cont\">\n\t\t\t\t\t\t\t<img src=\"" + data.image.small + "\" alt=\"\" class=\"cc-pic\">\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"flex-sc\">Price per unit:</div>\n\t\t\t\t\t\t<div class=\"cc-tousd flex-sc\">USD: " + data.market_data.current_price.usd + "$</div>\n\t\t\t\t\t\t<div class=\"cc-tonis flex-sc\">EUR: " + data.market_data.current_price.eur + "\u20AC</div>\n\t\t\t\t\t\t<div class=\".cc-toeur flex-sc\">ILS: " + data.market_data.current_price.ils + "\u20AA</div>\n\t\t\t\t\t");
                        coinCell.find('.cc-bot').append(ccBotContent);
                        // ccBot.css("display", "none")
                        // ccBot.slideDown();
                    });
                    moreInfoClickWatch = true;
                }
            }
            else {
                if (coinCell.height() > 142) {
                    coinCell.find('.cc-bot').hide();
                }
                else {
                    coinCell.find('.cc-bot').slideToggle();
                }
                // coinCell.find('.cc-bot').height(20);
                moreInfoClickWatch = false;
            }
        });
    }
    function search() {
        var val = $('#search-input').val();
        var index;
        for (var _i = 0, lastLoadCoinArrCopy_1 = lastLoadCoinArrCopy; _i < lastLoadCoinArrCopy_1.length; _i++) {
            var obj = lastLoadCoinArrCopy_1[_i];
            if (obj.symbol == val) {
                index = jQuery.inArray(obj, lastLoadCoinArrCopy);
                break;
            }
        }
        if (index == undefined) {
            $('#coin-grid').empty();
            $("#coin-grid").css({ "display": "flex" });
            $("#coin-grid").addClass("flex-cs");
            $('#coin-grid').append("\n\t\t<div class=\"not-found flex-cc\">\n\t\t\t<div id=\"not-found-cont\" class=\"flex-sbc fcol\">\n\t\t\t\t<div class=\"flex-cc\">Item not found. Try a different symbol?</div>\n\t\t\t\t<button id=\"reload-all\" class=\"flex-cc\">\n\t\t\t\t\tReload All\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t</div>\n\t\t");
            $('#reload-all').click(function () {
                $('#coin-grid').empty();
                loadCoins();
            });
        }
        else {
            $('#coin-grid').empty();
            $("#coin-grid").css({ "display": "flex" });
            $("#coin-grid").removeClass("flex-cc");
            $("#coin-grid").addClass("flex-cs");
            $('#coin-grid').append(dressCoin(lastLoadCoinArrCopy[index]));
            $('#coin-grid').children().css("width:", $('#coin-grid').width() / 100 * 12.5 + "px");
            $('#coin-grid').children().width($('#coin-grid').width() / 100 * 12.5 + "px");
            var checkedToggle = $('#coin-grid').children().find('.cToggle:checked');
            if (liveReportsArr.length == 5 && checkedToggle.length == 0) {
                var toggle = $('#coin-grid').children().find('.cToggle');
                toggle.prop('disabled', 'true');
            }
        }
    }
    function rightArrowFoo() {
        //ANIMATION
        if (arrowClickBlocker == false) {
            arrowClickBlocker = true;
            var x_1 = window.innerWidth / 2 - currentPageTitle.width() / 2 + "px";
            var watch_1 = false;
            var id_1 = setInterval(function () {
                if (currentPageTitle.offset().left <= 0) {
                    x_1 = window.innerWidth + "px";
                    watch_1 = true;
                    currentPageTitle.text($('#navbar-right-title').text());
                    switch (currentPageTitle.text()) {
                        case "Home":
                            leftArrow.show();
                            rightArrow.show();
                            navbarLeftTitle.show();
                            navbarRightTitle.show();
                            navbarLeftTitle.text('Live Reports');
                            navbarRightTitle.text('About');
                            break;
                        case "About":
                            rightArrow.hide();
                            navbarRightTitle.hide();
                            navbarLeftTitle.text('Home');
                            break;
                        default:
                            break;
                    }
                }
                currentPageTitle.css({
                    "position": "absolute",
                    "left": x_1
                });
                x_1 = +x_1.split('px')[0];
                x_1 -= 60;
                x_1 = x_1.toString() + "px";
                if (x_1.split('px')[0] <= window.innerWidth / 2 && watch_1 == true) {
                    clearInterval(id_1);
                    currentPageTitle.css({
                        "position": "static"
                    });
                    arrowClickBlocker = false;
                }
            }, 1);
        }
        else {
        }
        // CASES
        switch (navbarRightTitle.text()) {
            case 'About':
                // $('#search-bar').hide();
                rightArrow.hide();
                navbarRightTitle.hide();
                mainCont.html("\n\t\t\t\t<div id=\"about-body\" class=\"flex-cc\">\n\t\t\t\t\t<div id=\"about-cont\" class=\"fcol flex-sc\">\n\t\t\t\t\t\t<div id=\"about-blah\" class=\"fcol flex-ss\">\n\t\t\t\t\t\t\t<div class=\"flex-cc\" id=\"passion-title\">CRYPTO CURRENCY IS OUR PASSION</div>\n\t\t\t\t\t\t\t<img src=\"imgs/about/1.jpg\" id=\"about-img\" alt=\"\">\n\t\t\t\t\t\t\t<div id=\"about-img-thumb\">Oren Sayag, Fullstack Web Developer at Coin Sage</div>\n\t\t\t\t\t\t\t<div class=\"flex-cc fcol\" id=\"passion-blah\">\n\t\t\t\t\t\t\t\t<div>\"Coin Sage is the best free server of crypto-currency data. Our mission is to bring everyone in the world the most accurate coin value and make the surface of the crypto-currency market flow with massive waves of gains and losses.</div>\n\t\t\t\t\t\t\t\t<div>We're a start-up looking for every way to make our service more enjoyable. Each day we're making progress and customer feedback is very important to us in our chosen field of peace, love, gold and green.\"</div>\n\t\t\t\t\t\t\t\t<div>Please feel free to mail us at headofcustomerservicedepartment@coinsage.com</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<img src=\"\" alt=\"\" id=\"aboutpic\">\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t");
                break;
            case "Home":
                // $('#search-bar').show();
                mainCont.html("\n\t\t\t\t<div id=\"home-body\" class=\"flex-sc fcol\">\n\n\t\t\t\t\t<div id=\"search-bar\" class=\"flex-cc translate\" data-speed=\"0.7\">\n\t\t\t\t\t\t<div class=\"flex-sbc\" id=\"search-bar-cont\">\n\t\t\t\t\t\t\t<input type=\"search\" id=\"search-input\" class=\"flex-sbc\" placeholder=\"SYM\">\n\t\t\t\t\t\t\t<button id=\"search-btn\" class=\"flex-cc\"><i class=\"fas fa-search\"></i></button>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div id=\"coin-grid\">\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t");
                loadCoins();
            default:
                break;
        }
    }
    function leftArrowFoo() {
        //ANIMATION
        if (arrowClickBlocker == false) {
            arrowClickBlocker = true;
            var x_2 = window.innerWidth / 2 - currentPageTitle.width() / 2 + "px";
            var watch_2 = false;
            var id_2 = setInterval(function () {
                if (currentPageTitle.offset().left >= window.innerWidth) {
                    x_2 = "0px";
                    watch_2 = true;
                    currentPageTitle.text($('#navbar-left-title').text());
                    switch (currentPageTitle.text()) {
                        case "Live Reports":
                            leftArrow.hide();
                            navbarLeftTitle.hide();
                            navbarRightTitle.text('Home');
                            break;
                        case "Home":
                            leftArrow.show();
                            navbarLeftTitle.text('Live Reports');
                            break;
                        default:
                            break;
                    }
                }
                currentPageTitle.css({
                    "position": "absolute",
                    "left": x_2
                });
                x_2 = +x_2.split('px')[0];
                x_2 += 60;
                x_2 = x_2.toString() + "px";
                if (x_2.split('px')[0] >= window.innerWidth / 2 && watch_2 == true) {
                    clearInterval(id_2);
                    currentPageTitle.css({
                        "position": "static"
                    });
                    arrowClickBlocker = false;
                }
            }, 1);
        }
        else {
        }
        // CASES
        switch (navbarLeftTitle.text()) {
            case 'Live Reports':
                $('#search-bar').hide();
                mainCont.html("\n\t\t\t\t<div id=\"lr-body\" class=\"flex-cc\">\n\t\t\t\t\t<div id=\"graph-cont\" class=\"flex-cc\">\n\t\t\t\t\t\t<!--<div class=\"fcol flex-ss lr-cc-cont\">\n\t\t\t\t\t\t\t<div>Show/Hide</div>\n\t\t\t\t\t\t\t<div class=\"lr-coin-cell flex-sbc\">\n\t\t\t\t\t\t\t\t<input type=\"checkbox\">\n\t\t\t\t\t\t\t\t<div class=\"flex-sbc\">\n\t\t\t\t\t\t\t\t\t<div class=\"lr-cc-color\"></div>\n\t\t\t\t\t\t\t\t\t<div class=\"lr-cc-sym\">EXP</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>-->\n\t\t\t\t\t\t<div id=\"graph\"></div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t");
                clearGraph();
                liveReportsUpdate();
                $("#graph").CanvasJSChart(options);
                break;
            case 'Home':
                $('#search-bar').show();
                leftArrow.show();
                rightArrow.show();
                navbarLeftTitle.show();
                // navbarLeftTitle.text('Live Reports');
                navbarRightTitle.show();
                // navbarRightTitle.text('About');
                mainCont.html("\n\t\t\t\t<div id=\"home-body\" class=\"flex-sc fcol\">\n\n\t\t\t\t\t<div id=\"search-bar\" class=\"flex-cc translate\" data-speed=\"0.7\">\n\t\t\t\t\t\t<div class=\"flex-sbc\" id=\"search-bar-cont\">\n\t\t\t\t\t\t\t<input type=\"search\" id=\"search-input\" class=\"flex-sbc\" placeholder=\"SYM\">\n\t\t\t\t\t\t\t<button id=\"search-btn\" class=\"flex-cc\"><i class=\"fas fa-search\"></i></button>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div id=\"coin-grid\">\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t");
                loadCoins();
            default:
                break;
        }
    }
    function liveReportsUpdate() {
        if (liveReportsArr.length > 0 && $('#current-page-title').text() == 'Live Reports') {
            var link = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=';
            var lastPart = '&tsyms=USD';
            for (var _i = 0, liveReportsArr_2 = liveReportsArr; _i < liveReportsArr_2.length; _i++) {
                var coin = liveReportsArr_2[_i];
                link += coin + ',';
            }
            link += lastPart;
            $.get(link, function (data) {
                var time = new Date();
                for (var _i = 0, _a = options.data; _i < _a.length; _i++) {
                    var obj = _a[_i];
                    obj.dataPoints.push({
                        x: time,
                        y: data[obj.name.toUpperCase()].USD
                    });
                }
            });
            $("#graph").CanvasJSChart(options);
        }
    }
    function clearGraph() {
        for (var _i = 0, _a = options.data; _i < _a.length; _i++) {
            var obj = _a[_i];
            obj.dataPoints = [];
        }
    }
    function scrollDown() {
        $("html, body").animate({ scrollTop: $(window).height() }, 600);
        return false;
    }
});
