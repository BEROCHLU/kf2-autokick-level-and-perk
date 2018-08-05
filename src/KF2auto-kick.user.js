// ==UserScript==
// @name         KF2auto-kick
// @namespace    monkey
// @version      0.3
// @description  auto kick Level and Perk
// @author       BEROCHlU
// @match        http://*/ServerAdmin/*
// @grant        none
// @require      http://localhost:8080/images/jquery.js?gzip
// @noframes
// ==/UserScript==

(function() {

    var MIN_LV;
    var MAX_LV;
    var arrKickperk = new Array(10);

    $( document ).ready(function() {

		var arrKickperkInit = ["Berserker","anonymous","anonymous","anonymous","Demolitionist","Firebug","anonymous","anonymous","anonymous","anonymous"];

		localStorage.getItem("storageMin") || (localStorage.setItem("storageMin", "0"), console.log("localStorage MinLv initialized") );
		localStorage.getItem("storageMax") || (localStorage.setItem("storageMax", "25"), console.log("localStorage MaxLv initialized") );
		localStorage.getItem("storageKickperk") || (localStorage.setItem("storageKickperk", JSON.stringify(arrKickperkInit)), console.log("localStorage Kickperk initialized") );

        setInterval(kickTime, 16000);

    });

    function kickTime() {

        $.get( "/ServerAdmin/current/players", function( data ) {

            if (data.indexOf("There are no players") != -1){
                return;
            }
          
            MIN_LV = parseInt(localStorage.getItem("storageMin") );
			MAX_LV = parseInt(localStorage.getItem("storageMax") );
			arrKickperk = JSON.parse(localStorage.getItem("storageKickperk") );//console.log(MIN_LV,MAX_LV,arrKickperk);

            var players = JSON.parse(data.replace("}, ] }","} ] }"));

            for (var i=0; i<players.player.length; i++){
                if (players.player[i].perkName != ""
                    && (parseInt(players.player[i].perkLevel) < MIN_LV
                    || parseInt(players.player[i].perkLevel) > MAX_LV) ){

                    if(players.player[i].isSpectator == "No"){
                        $.post("/ServerAdmin/current/players", { playerkey: players.player[i].key, action: "kick" })
                        && $.post("/ServerAdmin/current/chat+frame", { ajax: "1", message: "auto-kick " + players.player[i].perkName + "-" + players.player[i].perkLevel, teamsay: "-1"})
                        console.log(players);
                    }
                }else if(arrKickperk.includes(players.player[i].perkName) ){

                    if(players.player[i].isSpectator == "No"){
                        $.post("/ServerAdmin/current/players", { playerkey: players.player[i].key, action: "kick" })
                        && $.post("/ServerAdmin/current/chat+frame", { ajax: "1", message: "auto-kick " + players.player[i].perkName + "-" + players.player[i].perkLevel, teamsay: "-1"})
                        console.log(players);console.log('no demo fire bsk');
                    }
                }
            }
        });
    }
})();