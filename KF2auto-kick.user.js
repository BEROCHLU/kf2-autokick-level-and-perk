// ==UserScript==
// @name         KF2auto-kick
// @namespace    monkey
// @version      0.6
// @description  auto kick Level and Perk
// @author       BEROCHlU
// @match        http://*/ServerAdmin/*
// @grant        none
// @require      http://localhost:8080/images/jquery.js?gzip
// @noframes
// ==/UserScript==

/**
 * テンプレートエンジンの変数<%player.name%>が２バイト文字であった場合、サーバから%EF%BF%BDに変換された、文字化けした変数を受け取る。
 * この時、kickに必要な<%player.playerkey%>が下３桁欠けた値となりkickできなくなる。
 * これはサーバが２バイト文字に対応できてない問題であり、スクリプトの不具合ではない。現状、<%player.name%>を""に置き換えて
 * 変数を受け取らないことで対処している。
 */

let g_time_id;

(() => {
    'use strict';

    let arrKickperk = Array(10);
    let timer_count = 0;

    const asyncPostAll = async (gamer) => {
        const promises = [
            $.post('/ServerAdmin/current/players', {
                playerkey: gamer.key,
                action: 'kick'
            }),
            $.post('/ServerAdmin/current/chat+frame', {
                ajax: '1',
                message: `auto-kick: ${gamer.perkName}-${gamer.perkLevel}`,
                teamsay: '-1'
            })
        ];

        let result = await Promise.all(promises);
        //console.log(result);
        console.log(gamer);
    }

    const kickTime = () => {
        fetch('/ServerAdmin/current/players')
            .then(response => response.text())
            .then(data => {

                if (data.indexOf('There are no players') !== -1) {
                    return;
                }

                const MIN_LV = parseInt(localStorage.getItem("storageMin"));
                const MAX_LV = parseInt(localStorage.getItem("storageMax"));
                arrKickperk = JSON.parse(localStorage.getItem("storageKickperk")); //console.log(MIN_LV,MAX_LV,arrKickperk);

                const players = JSON.parse(data.replace("}, ] }", "} ] }"));

                for (let gamer of players.player) {
                    if (gamer.perkName === '') {
                        // do nothing
                    } else if (gamer.isSpectator === 'Yes') {
                        // do nothing
                    } else {
                        if (parseInt(gamer.perkLevel) < MIN_LV || MAX_LV < parseInt(gamer.perkLevel)) {
                            asyncPostAll(gamer);
                        } else if (arrKickperk.includes(gamer.perkName)) {
                            asyncPostAll(gamer);
                        }
                    }
                }
                timer_count += 1;
                //console.log(timer_count)
            })
            .catch(e => {
                console.log(e);
            });
        // improve memory leak issue
        if (timer_count > 800) { // 1H:225 20H:4500
            clearInterval(g_time_id);
            g_time_id = setInterval(kickTime, 16000);
            timer_count = 0;
            //console.log(`new id:${g_time_id}`);
        }
    }

    { //main
        //let arrKickperkInit = ["anonymous", "anonymous", "anonymous", "anonymous", "anonymous", "anonymous", "anonymous", "anonymous", "anonymous", "anonymous"];
        const arrKickperkInit = Array(10).fill('anonymous');

        localStorage.getItem("storageMin") || (localStorage.setItem("storageMin", "0"), console.log("localStorage MinLv initialized"));
        localStorage.getItem("storageMax") || (localStorage.setItem("storageMax", "25"), console.log("localStorage MaxLv initialized"));
        localStorage.getItem("storageKickperk") || (localStorage.setItem("storageKickperk", JSON.stringify(arrKickperkInit)), console.log("localStorage Kickperk initialized"));

        g_time_id = setInterval(kickTime, 16000);
    }
})();