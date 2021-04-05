$(()=>{



var options = {
	exportEnabled: true,
	animationEnabled: false,
	title:{
		text: "My Live Reports"
	},
	subtitles: [
		{text:"text"}
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
	data: [
	]
};

function toggleDataSeries(e) {
	if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
		e.dataSeries.visible = false;
	} else {
		e.dataSeries.visible = true;
	}
	e.chart.render();
}



// DOM
const leftArrow = $('.fa-arrow-left');
const rightArrow = $('.fa-arrow-right');
const currentPageTitle = $('#current-page-title');
const navbarLeftTitle = $('#navbar-left-title');
const navbarRightTitle = $('#navbar-right-title');
const mainCont = $('#main-cont');
const translate = document.querySelectorAll('.translate')

// TOOLS
let arrowClickBlocker:Boolean = false;
let lastLoadCoinArrCopy:any[]; // for the search option
let getHistoryObj:any = {}; // for the 2 min requirement
let liveReportsArr:any[] = []; // for the live reports feature
let namesArr = [] // for the module names under syms
let coinGridWidth = 100; // for the parallex scrolling of coingrid
let bgImgSpeed = -10; // for the parallex scrolling 
let lastScrollTop; // for the parallex scrolling - direction detection
const coins = $('.coin'); // for the coins parallex & size in coingrid

leftArrow.click(()=>{
	leftArrowFoo();
	if($(window).width()>=480){
			scrollDown();
	}
})

rightArrow.click(()=>{
	rightArrowFoo();
	if($(window).width()>=480){
			scrollDown();
	}
})

let elements = $('body>*');

for (const element of elements) {
	if(element.clientWidth>360){
	}
}

$(window).scroll(()=>{

	const scroll = window.pageYOffset;

	const navSpeed =0;
	const mainContSpeed = 0;
	const titleSpeed =-.9;
	const startBtnSpeed = -.4;
	
	$('#navbar').css('transform', `translateY(${scroll*navSpeed}px)`); 
	$('#main-cont').css('transform', `translateY(${scroll*mainContSpeed}px)`); 
	$('#title').css('transform', `translateY(${scroll*titleSpeed}px)`); 
	$('#start-btn').css('transform', `translateY(${scroll*startBtnSpeed}px)`);
	$('body').css('background-position-y', `${bgImgSpeed}px`);

	let randomCoinSpeed = [];
	for (const coin of coins) {
		const random = Math.random()/8;
		randomCoinSpeed.push(random);
	}
	
	const st = $(this).scrollTop();
	if (st > lastScrollTop){
		// downscroll code
		
		
		
		if(coinGridWidth>90){
			coinGridWidth -= .5;
		}
		bgImgSpeed+=1;
	} else {
		// upscroll code

		
		if(coinGridWidth<100){
			coinGridWidth += .5;
		}
		bgImgSpeed-=1;
   	}
   	lastScrollTop = st;


	$('#coin-grid').css('width', '100%'); // ! TO DELETE AND APPL YTO CSS WHEN WORKING
	$('#coin-grid').css('width', `${coinGridWidth}%`);

})

$('body').keydown((e)=>{
	if(e.which==39){
		rightArrowFoo();
		if($(window).width()>=480){
			scrollDown();
		}
	}	
})

$('body').keydown((e)=>{
	if(e.which==37){
		leftArrowFoo();
		if($(window).width()>=480){
			scrollDown();
		}
	}	
})

$("#start-btn").click(()=>{
	scrollDown();
})

onload();
loadCoins();

// FUNCTIONS

function onload(){
	setInterval(liveReportsUpdate, 2000);
	if(localStorage.getHistoryObj){
		getHistoryObj=JSON.parse(localStorage.getHistoryObj);
	}
	if(localStorage.liveReportsArr){
		liveReportsArr=JSON.parse(localStorage.liveReportsArr);
	}
	if(localStorage.data){
		options.data=JSON.parse(localStorage.data);
	}
	if(localStorage.namesArr){
		namesArr=JSON.parse(localStorage.namesArr);
	}
}
function loadCoins(){
	$("#coin-grid").css(
		{"display":"flex"}
	);
	$("#coin-grid").addClass("flex-cc");
	const loadingAn = $(
		`
			<div class="loading-cont-big flex-cc">
				<div class="loading-big"></div>
			</div>
		`
	)
	$('#coin-grid').append(loadingAn)
	
	let coinArr = [];
	$.get( "https://api.coingecko.com/api/v3/coins/list", function( data ) {
		loadingAn.remove();
		$("#coin-grid").css(
			{"display":"grid"}
		);
		$("#coin-grid").removeClass("flex-cc");
		for (let i = 1; i < 21; i++) { //from 1 because 'whirl fincnace' (first coin) is acting weird having an  id of ""
			coinArr.push(data[i]);
		}
	}).done(function() {
		lastLoadCoinArrCopy = coinArr;
		for (let j = 0; j < coinArr.length; j++) {
			dressCoin(coinArr[j]);
		}
	  })

	// search e listeners

	$('#search-btn').click(()=>{search();$('#search-input').val("");})

	$('#search-input').keydown((e)=>{
		if(e.key=='Enter'){
			search();
			$('#search-input').val("");
		}
	})
}

function dressCoin(coinObj){
	//TOOLS
	let moreInfoClickWatch:Boolean = false;
	// let ccTogWatch:Boolean = false; // false is disabled, this var is for the live reports feature

	let coinCell = $(`
	<div class="coin-cell fcol flex-sbs">
		<div class="fcol flex-sbs cc-top">
			<div class="cc-sym">${coinObj.symbol}</div>
			<div class="cc-name">${coinObj.name}</div>
			<button class="cc-more">More info</button>
			<label class="toggle cc-tog tog-lr-tool">
				<input type="checkbox" class="cToggle" class="cc-tog"/>
				<span class="slider cc-tog"></span>
			</label>
		</div>
		<div class="cc-bot flex-sbc fcol">
		</div>
	</div>
	`)
	if(jQuery.inArray(coinObj.symbol, liveReportsArr)!=-1){
		coinCell.find('.cToggle').prop("checked", "true");
		coinCell.find('.cToggle').addClass('protected');
	}
	if(liveReportsArr.length==5){
		$('#coin-grid').find('.cToggle:not(.protected)').prop('disabled', 'true');
	}
	coinCell.find('.cc-bot').hide();
	$('#coin-grid').append(coinCell);

	// E LISTENER TO THE TOG INPUT
	coinCell.find('.cToggle').click((e)=>{
		if(liveReportsArr.length<=5){
			if(jQuery.inArray(coinObj.symbol, liveReportsArr)==-1){


				// ADD TO ARRAY AND OBJ
				liveReportsArr.push(coinObj.symbol);

				namesArr.push(coinObj.name);
				localStorage.namesArr = JSON.stringify(namesArr)

				localStorage.liveReportsArr=JSON.stringify(liveReportsArr);
				options.data.push({
					type: "spline",
					name: coinObj.symbol,
					showInLegend: true,
					xValueFormatString: "HH mm ss",
					yValueFormatString: "#,##0 $",
					dataPoints: [
						// { x: 1950, y: 1 },
					]
				})
				localStorage.data=JSON.stringify(options.data);
				e.target.className += " protected"

			} else {
				let index = jQuery.inArray(coinObj.symbol, liveReportsArr);

				liveReportsArr.splice(index, 1)
				localStorage.liveReportsArr=JSON.stringify(liveReportsArr);
				options.data.splice(index, 1)
				localStorage.data=JSON.stringify(options.data);


				e.target.className = "cToggle"

			}
		}
		if(liveReportsArr.length==5){
			$('#coin-grid').find('.cToggle:not(.protected)').prop('disabled', 'true');
		} else {
			$('#coin-grid').find('.cToggle').removeAttr('disabled');
		}
	})

	// MODULE
	coinCell.find('label').click((e)=>{
		//TOOLS
		let sym; //helps remove the right coin from liveReportArr

		if(!$('#overcoin-alert').length){
			const newCoin = $(e.currentTarget).siblings('.cc-sym')[0].textContent; // to use when replacing coins
	
			// console.dir($(e.currentTarget));
			const status = $(e.currentTarget).find('.cToggle').is(':disabled');
			if(status){
				$('#main-cont').html('');

				$('body').append($(`
				<div id="overcoin-alert" class="flex-cc fcol">
					<div id="oca-cont" class="fcol flex-cc">
						<div id="overcoin-mess" class="fcol flex-sbc">
							<div class="flex-cc">
								Whoops!
							</div>
							<div class="flex-sbc fcol" id="overcoin-blah">
								<div class="flex-cc">
									You want to add&nbsp; <span>${newCoin}</span> &nbsp;to Live Reports. 
								</div>
								<div class="flex-cc">
									You've reached the limit of live-reported coins (5).
								</div>
								<div class="flex-cc">
									You can trade-off an existing live reported coin for this one.
								</div>
							</div>
						</div>
						<div id="overcoin-cc-cont" class="flex-sbc"></div>
						<div id="oc-validation">
							Will be traded for the SYM coin.
						</div>
						<div class="flex-sbc oc-btn-disabled" id="oc-btn-cont">
							<button class="oc-btn" id="overcoin-tradeoff-btn" disabled>Trade-Off</button>
							<button class="oc-btn" id="overcoin-cancel-btn">Cancel</button>
						</div>
					</div>
				</div>
				`))

				$('#coin-grid').css({"height":"fit-content"})

				
				for (const item of liveReportsArr) {
					// $(`
					// <div class="overcoin-cc flex-sbc fcol">
					// <div class="flex-sc">${item}</div>
					// <div class="flex-sc" id="oc-cc-name">${namesArr[liveReportsArr.indexOf(item)]}</div>
					// </div>
					// `).appendTo($('#overcoin-cc-cont'));
					$(`
						<div class="coin-cell fcol flex-sbs overcoin-cc-2">
							<div class="fcol flex-sbs cc-top">
								<div class="cc-sym">${item}</div>
								<div class="cc-name">${namesArr[liveReportsArr.indexOf(item)]}</div>
								<label class="toggle cc-tog tog-lr-tool">
									<input type="checkbox" class="cToggle" checked class="cc-tog"/>
									<span class="slider cc-tog"></span>
								</label>
							</div>
						</div>
					`).appendTo($('#overcoin-cc-cont'));
				}



	

				$('.cToggle').click((e)=>{
					$('.oc-temp-validator').remove();

					$('.cToggle').removeAttr('checked');
					$('.cToggle').prop("checked", true);
					$(e.target).prop("checked", false);
					sym = $(e.target).parent().parent().find('.cc-sym').text();

					$(`
					<div class="oc-temp-validator">
						Do you want <span>${newCoin}</span> to replace <span>${sym}</span> in your live reports?
					</div>
					`).insertBefore('#oc-btn-cont');
	
					// $('#overcoin-alert span').css({"color": "red", "font-size":"1.5rem"});
	
					$('#overcoin-tradeoff-btn').removeAttr('disabled');
				})
				
				$('#overcoin-cancel-btn').click(()=>{
					mainCont.html(
						`
						<div id="home-body" class="flex-sc fcol">
							<div id="search-bar" class="flex-cc translate" data-speed="0.7">
								<div class="flex-sbc" id="search-bar-cont">
									<input type="search" id="search-input" class="flex-sbc" placeholder="SYM">
									<button id="search-btn" class="flex-cc"><i class="fas fa-search"></i></button>
								</div>
							</div>
							<div id="coin-grid">
								
							</div>
						</div>
						`
					);
					loadCoins();
					$('#overcoin-alert').remove();
				})
				$('#overcoin-tradeoff-btn').click(()=>{
					$('#home-body').remove();
	
					const index = jQuery.inArray(sym, liveReportsArr);
	
					liveReportsArr[index] = newCoin;
					options.data[index] = {
						type: "spline",
						name: newCoin,
						showInLegend: true,
						xValueFormatString: "HH mm ss",
						yValueFormatString: "#,##0 $",
						dataPoints: [
							// { x: 1950, y: 1 },
						]
					}
	
					localStorage.liveReportsArr = JSON.stringify(liveReportsArr);
					localStorage.data=JSON.stringify(options.data);
	
					mainCont.html(
						`
						<div id="home-body" class="flex-sc fcol">
							<div id="search-bar" class="flex-cc translate" data-speed="0.7">
								<div class="flex-sbc" id="search-bar-cont">
									<input type="search" id="search-input" class="flex-sbc" placeholder="SYM">
									<button id="search-btn" class="flex-cc"><i class="fas fa-search"></i></button>
								</div>
							</div>
							<div id="coin-grid">
								
							</div>
						</div>
						`
					);
	
					loadCoins();
					$('#overcoin-alert').remove();
				})
			}

		}
	})


	// E LISTENER FOR MORE INFO BTN
	coinCell.find('.cc-more').click(()=>{
		if(!moreInfoClickWatch){

			coinCell.find('.cc-bot').empty();
		
			const loading = $(
				`
					<div class="loading-cont flex-cc">
					<div class="loading"></div>
				`
			)
			coinCell.find('.cc-bot').append(loading)
			// coinCell.append(loading)


			if(coinCell.height()>142){
				coinCell.find('.cc-bot').show()
			} else{
				coinCell.find('.cc-bot').slideToggle();
			}
	
			// get the info from second API, only if 2mins have passed sinced last
			if(getHistoryObj[coinObj.id] && new Date().getTime()-getHistoryObj[coinObj.id].time<120000){
				console.log('got it from local');
				loading.remove();
				const ccBotContent = $(
					`
					<div class="flex-cc cc-img-cont">
						<img src="${getHistoryObj[coinObj.id].img}" alt="" class="cc-pic">
					</div>
					<div class="flex-sc">Price per unit:</div>
					<div class="cc-tousd flex-sc">USD: ${getHistoryObj[coinObj.id].usd}$</div>
					<div class="cc-tonis flex-sc">EUR: ${getHistoryObj[coinObj.id].eur}€</div>
					<div class=".cc-toeur flex-sc">ILS: ${getHistoryObj[coinObj.id].nis}₪</div>
					`
				)
				coinCell.find('.cc-bot').append(ccBotContent);
				// ccBot.css("display", "none")
				// ccBot.slideDown();
				moreInfoClickWatch = true;
			} else {
				if(getHistoryObj[coinObj.id] &&new Date().getTime()-getHistoryObj[coinObj.id].time>120000){
					delete getHistoryObj[coinObj.id];
					localStorage.getHistoryObj = JSON.stringify(getHistoryObj);
				}
				console.log('got it from api');


				$.get(`https://api.coingecko.com/api/v3/coins/${coinObj.id}`, (data)=>{
				getHistoryObj[coinObj.id] = {
					img: data.image.small,
					usd: data.market_data.current_price.usd,
					eur: data.market_data.current_price.eur,
					nis: data.market_data.current_price.ils,
					time: new Date().getTime(),
				}

				localStorage.getHistoryObj = JSON.stringify(getHistoryObj);
	
				// setTimeout(() => {
				// 	delete getHistoryObj[coinObj.id]
				// 	localStorage.getHistoryObj = JSON.stringify(getHistoryObj);
				// }, 120000);

	
				loading.remove();
				const ccBotContent = $(
					`
						<div class="flex-cc cc-img-cont">
							<img src="${data.image.small}" alt="" class="cc-pic">
						</div>
						<div class="flex-sc">Price per unit:</div>
						<div class="cc-tousd flex-sc">USD: ${data.market_data.current_price.usd}$</div>
						<div class="cc-tonis flex-sc">EUR: ${data.market_data.current_price.eur}€</div>
						<div class=".cc-toeur flex-sc">ILS: ${data.market_data.current_price.ils}₪</div>
					`
				)
				coinCell.find('.cc-bot').append(ccBotContent);

				// ccBot.css("display", "none")
				// ccBot.slideDown();
				})
	
				moreInfoClickWatch = true;
			}
		} else {
			
			if(coinCell.height()>142){
				coinCell.find('.cc-bot').hide()
			} else{
				coinCell.find('.cc-bot').slideToggle();
			}

			// coinCell.find('.cc-bot').height(20);

			moreInfoClickWatch = false;
		}
	})
}

function search(){
	const val:any = $('#search-input').val();
	let index:Number;
	for (const obj of lastLoadCoinArrCopy) {
		if(obj.symbol==val){
			index = jQuery.inArray(obj, lastLoadCoinArrCopy);
			break;
		}
	}
	if (index==undefined){
		$('#coin-grid').empty();
		$("#coin-grid").css(
			{"display":"flex"}
		);
		$("#coin-grid").addClass("flex-cs");
		$('#coin-grid').append(`
		<div class="not-found flex-cc">
			<div id="not-found-cont" class="flex-sbc fcol">
				<div class="flex-cc">Item not found. Try a different symbol?</div>
				<button id="reload-all" class="flex-cc">
					Reload All
				</button>
			</div>
		</div>
		`)
		$('#reload-all').click(()=>{
			$('#coin-grid').empty();
			loadCoins();
		})
	} else {
		$('#coin-grid').empty();
		$("#coin-grid").css(
			{"display":"flex"}
		);
		$("#coin-grid").removeClass("flex-cc");
		$("#coin-grid").addClass("flex-cs");
		$('#coin-grid').append(dressCoin(lastLoadCoinArrCopy[index]));
		$('#coin-grid').children().css("width:", $('#coin-grid').width()/100*12.5+"px");
		$('#coin-grid').children().width($('#coin-grid').width()/100*12.5+"px");

		const checkedToggle = $('#coin-grid').children().find('.cToggle:checked');

		if(liveReportsArr.length==5 && checkedToggle.length==0){
			const toggle = $('#coin-grid').children().find('.cToggle');

			toggle.prop('disabled', 'true');
			
		}
	}
}

function rightArrowFoo(){

	//ANIMATION
	if(arrowClickBlocker==false){
		arrowClickBlocker=true;
		let x:any = window.innerWidth/2-currentPageTitle.width()/2+"px";
		let watch:Boolean = false;
		let id = setInterval(()=>{
			if(currentPageTitle.offset().left<=0){
				x=window.innerWidth+"px";
				watch = true;
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
				"left": x,
			})
	
	
			x = +x.split('px')[0];
			x-=60;
			x = x.toString()+"px";
	
			if (x.split('px')[0]<=window.innerWidth/2 && watch==true){
				clearInterval(id);
				currentPageTitle.css({
					"position": "static",
				})
				arrowClickBlocker = false;
			}

		},1);
	} else {
	}

	// CASES
	switch (navbarRightTitle.text()) {
		case 'About':
			// $('#search-bar').hide();
			rightArrow.hide();
			navbarRightTitle.hide();

			mainCont.html(
				`
				<div id="about-body" class="flex-cc">
					<div id="about-cont" class="fcol flex-sc">
						<div id="about-blah" class="fcol flex-ss">
							<div class="flex-cc" id="passion-title">CRYPTO CURRENCY IS OUR PASSION</div>
							<img src="imgs/about/1.jpg" id="about-img" alt="">
							<div id="about-img-thumb">Oren Sayag, Fullstack Web Developer at Coin Sage</div>
							<div class="flex-cc fcol" id="passion-blah">
								<div>"Coin Sage is the best free server of crypto-currency data. Our mission is to bring everyone in the world the most accurate coin value and make the surface of the crypto-currency market flow with massive waves of gains and losses.</div>
								<div>We're a start-up looking for every way to make our service more enjoyable. Each day we're making progress and customer feedback is very important to us in our chosen field of peace, love, gold and green."</div>
								<div>Please feel free to mail us at headofcustomerservicedepartment@coinsage.com</div>
							</div>
						</div>
						<img src="" alt="" id="aboutpic">
					</div>
				</div>
				`
			);
			break;
	
		case "Home":
			// $('#search-bar').show();
			mainCont.html(
				`
				<div id="home-body" class="flex-sc fcol">

					<div id="search-bar" class="flex-cc translate" data-speed="0.7">
						<div class="flex-sbc" id="search-bar-cont">
							<input type="search" id="search-input" class="flex-sbc" placeholder="SYM">
							<button id="search-btn" class="flex-cc"><i class="fas fa-search"></i></button>
						</div>
					</div>

					<div id="coin-grid">
					</div>
				</div>
				`
			);
			loadCoins();

		default:
			break;
	}

}

function leftArrowFoo(){

	//ANIMATION
	if(arrowClickBlocker==false){
		arrowClickBlocker=true;
		let x:any = window.innerWidth/2-currentPageTitle.width()/2+"px";
		let watch:Boolean = false;
		let id = setInterval(()=>{
			if(currentPageTitle.offset().left>=window.innerWidth){
				x="0px";
				watch = true;
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
				"left": x,
			})
	
	
			x = +x.split('px')[0];
			x+=60;
			x = x.toString()+"px";
	
			if (x.split('px')[0]>=window.innerWidth/2 && watch==true){
				clearInterval(id);
				currentPageTitle.css({
					"position": "static",
				})
				arrowClickBlocker = false;
			}

		},1);
	} else {
	}

	// CASES
	switch (navbarLeftTitle.text()) {
		case 'Live Reports':
			$('#search-bar').hide();

			mainCont.html(
				`
				<div id="lr-body" class="flex-cc">
					<div id="graph-cont" class="flex-cc">
						<!--<div class="fcol flex-ss lr-cc-cont">
							<div>Show/Hide</div>
							<div class="lr-coin-cell flex-sbc">
								<input type="checkbox">
								<div class="flex-sbc">
									<div class="lr-cc-color"></div>
									<div class="lr-cc-sym">EXP</div>
								</div>
							</div>
						</div>-->
						<div id="graph"></div>
					</div>
				</div>
				`
			);
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

			mainCont.html(
				`
				<div id="home-body" class="flex-sc fcol">

					<div id="search-bar" class="flex-cc translate" data-speed="0.7">
						<div class="flex-sbc" id="search-bar-cont">
							<input type="search" id="search-input" class="flex-sbc" placeholder="SYM">
							<button id="search-btn" class="flex-cc"><i class="fas fa-search"></i></button>
						</div>
					</div>

					<div id="coin-grid">
					</div>
				</div>
				`
			);
			loadCoins();
	
		default:
			break;
	}

}

function liveReportsUpdate(){
	if(liveReportsArr.length>0 && $('#current-page-title').text()=='Live Reports'){
		let link = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=';
		let lastPart = '&tsyms=USD';
		
		for (const coin of liveReportsArr) {
			link += coin+',';
		}
	
		link += lastPart;
	
		
		$.get(link, (data)=>{
			let time = new Date()
	
			for (const obj of options.data) {
				
				obj.dataPoints.push(
					{
						x: time,
						y: data[obj.name.toUpperCase()].USD,
					}
				)
			}
		})

		$("#graph").CanvasJSChart(options);
	}
}

function clearGraph(){
	for (const obj of options.data) {
				
		obj.dataPoints = [];
	}
}

function scrollDown(){
	$("html, body").animate({ scrollTop: $(window).height()}, 600);
	return false;
}




})