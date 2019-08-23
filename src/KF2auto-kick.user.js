// ==UserScript==
// @name         KF2auto-kick
// @namespace    monkey
// @version      0.4
// @description  auto kick Level and Perk
// @author       BEROCHlU
// @match        http://*/ServerAdmin/*
// @grant        none
// @require      http://localhost:8080/images/jquery.js?gzip
// @noframes
// ==/UserScript==

let g_time_id;

(function() {
    'use strict';

    let arrKickperk = new Array(10);
    let timer_count = 0;

    const kickTime = () => {
        fetch('/ServerAdmin/current/players')
            .then(response => response.text())
            .then(data => {

                if (data.indexOf("There are no players") != -1) {
                    return;
                }

                const MIN_LV = parseInt(localStorage.getItem("storageMin"));
                const MAX_LV = parseInt(localStorage.getItem("storageMax"));

                arrKickperk = JSON.parse(localStorage.getItem("storageKickperk")); //console.log(MIN_LV,MAX_LV,arrKickperk);

                const players = JSON.parse(data.replace("}, ] }", "} ] }"));

                for (let gamer of players.player) {
                    if (gamer.perkName != "" &&
                        (parseInt(gamer.perkLevel) < MIN_LV ||
                            parseInt(gamer.perkLevel) > MAX_LV)) {

                        if (gamer.isSpectator == "No") {
                            $.post("/ServerAdmin/current/players", {
                                    playerkey: gamer.key,
                                    action: "kick"
                                }) &&
                                $.post("/ServerAdmin/current/chat+frame", {
                                    ajax: "1",
                                    message: `auto-kick: ${gamer.perkName}-${gamer.perkLevel}`,
                                    teamsay: "-1"
                                })
                            console.log(players);
                        }
                    } else if (arrKickperk.includes(gamer.perkName)) {

                        if (gamer.isSpectator == "No") {
                            $.post("/ServerAdmin/current/players", {
                                    playerkey: gamer.key,
                                    action: "kick"
                                }) &&
                                $.post("/ServerAdmin/current/chat+frame", {
                                    ajax: "1",
                                    message: `auto-kick: ${gamer.perkName}-${gamer.perkLevel}`,
                                    teamsay: "-1"
                                })
                            console.log(players);
                            console.log('no demo fire bsk');
                        }
                    }
                }
                timer_count += 1;
            })
            .catch(e => {
                console.log(e);
            });
        // test code
        if (timer_count > 9000) {// 1H:225 20H:4500
            clearInterval(g_time_id);
            g_time_id = setInterval(kickTime, 16000);
            timer_count = 0;
        }
    }

    $(document).ready(function() {

        var arrKickperkInit = ["anonymous", "anonymous", "anonymous", "anonymous", "anonymous", "anonymous", "anonymous", "anonymous", "anonymous", "anonymous"];

        localStorage.getItem("storageMin") || (localStorage.setItem("storageMin", "0"), console.log("localStorage MinLv initialized"));
        localStorage.getItem("storageMax") || (localStorage.setItem("storageMax", "25"), console.log("localStorage MaxLv initialized"));
        localStorage.getItem("storageKickperk") || (localStorage.setItem("storageKickperk", JSON.stringify(arrKickperkInit)), console.log("localStorage Kickperk initialized"));

        g_time_id = setInterval(kickTime, 16000);
    });
})();