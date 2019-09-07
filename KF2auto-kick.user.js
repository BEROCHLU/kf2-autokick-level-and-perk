// ==UserScript==
// @name         KF2auto-kick
// @namespace    monkey
// @version      0.63
// @description  auto kick Level and Perk
// @author       BEROCHlU
// @match        http://*/ServerAdmin/*
// @grant        none
// @noframes
// ==/UserScript==

/**
 * テンプレートエンジンの変数<%player.name%>が2バイト文字であった場合、サーバから%EF%BF%BDに変換された、文字化けした変数を受け取る。
 * この時、直後の(key: value)のうちvalueが後ろ3バイト欠損する。
 * これはサーバが２バイト文字に対応できてない問題であり、スクリプトの不具合ではない。現状、<%player.name%>を""に置き換えて
 * 変数を受け取らないことで対処している。他にもJSON.parseが厳格すぎてちょっとした1バイト記号でエラーを起こす。
 * やはり<%player.name%>を受け取らないのが現状のベストだ。
 */

let g_time_id;

(() => {
    'use strict';

    let arrKickperk = Array(10);
    let timer_count = 0;

    const asyncPostAll = async (gamer) => {
        let paramkick = new URLSearchParams();
        paramkick.set('playerkey', gamer.key);
        paramkick.set('action', 'kick');

        let paramchat = new URLSearchParams();
        paramchat.set('ajax', '1');
        paramchat.set('message', `auto-kick: ${gamer.perkName}-${gamer.perkLevel}`);
        paramchat.set('teamsay', '-1');

        const promises = [
            fetch('/ServerAdmin/current/players', {
                method: 'POST',
                body: paramkick
            }),
            fetch('/ServerAdmin/current/chat+frame', {
                method: 'POST',
                body: paramchat
            })
        ];

        const _result = await Promise.all(promises);
        console.log(gamer);
    }

    const kickTime = () => {
        fetch('/ServerAdmin/current/players', {
                method: 'GET',
                headers: {
                    "Content-Type": "text/plain; charset=utf-8"
                }
            })
            .then(response => response.text())
            .then(data => {

                if (data.indexOf('There are no players') !== -1) {
                    return;
                }

                const MIN_LV = parseInt(localStorage.getItem("storageMin"));
                const MAX_LV = parseInt(localStorage.getItem("storageMax"));
                arrKickperk = JSON.parse(localStorage.getItem("storageKickperk"));

                const arrPlayers = JSON.parse(data.replace('},]', '}]'));

                for (const gamer of arrPlayers) {
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
        const arrKickperkInit = Array(10).fill('anonymous');

        localStorage.getItem("storageMin") || (localStorage.setItem("storageMin", "0"), console.log("localStorage MinLv initialized"));
        localStorage.getItem("storageMax") || (localStorage.setItem("storageMax", "25"), console.log("localStorage MaxLv initialized"));
        localStorage.getItem("storageKickperk") || (localStorage.setItem("storageKickperk", JSON.stringify(arrKickperkInit)), console.log("localStorage Kickperk initialized"));

        g_time_id = setInterval(kickTime, 16000);
    }
})();