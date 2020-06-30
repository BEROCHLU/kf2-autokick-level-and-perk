// ==UserScript==
// @name         KF2auto-kick
// @namespace    monkey
// @version      2.0.1
// @description  auto kick Level and Perk
// @author       BEROCHlU
// @match        http://*/ServerAdmin/*
// @grant        none
// @noframes
// ==/UserScript==

/**
 * テンプレートエンジンの変数<%player.name%>が2バイト文字であった場合、サーバから%EF%BF%BDに変換された、文字化けした変数を受け取る。
 * この時、直後の連想配列(key: value)のうちvalueが後ろ3バイト欠損する。
 * これはサーバが2バイト文字に対応できてない問題であり、スクリプトの不具合ではない。現状、<%player.name%>を
 * 受け取らないことで対処している。他にもJSON.parseが厳格すぎて" ' \n等の特殊記号でエラーを起こす。
 * やはり<%player.name%>を受け取らないのが現状のベストだ。
 */

let g_time_id;

(() => {
    'use strict';

    let arrKickperk = Array(10);
    let timer_count = 0;
    let announce_count = 0;
    let KICK_INTERVAL = 12000; //number of times the kickTime function has been called

    const asyncPostAll = async (gamer) => {
        const paramkick = new URLSearchParams();
        paramkick.set('playerkey', gamer.key);
        paramkick.set('action', 'kick');

        const paramchat = new URLSearchParams();
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

                timer_count += 1;
                //console.log(`timer_count: ${timer_count} announce_count: ${announce_count}`);

                if (data.indexOf('There are no players') !== -1) {
                    return;
                }

                const MIN_LV = parseInt(localStorage.getItem("storageMin"));
                const MAX_LV = parseInt(localStorage.getItem("storageMax"));
                arrKickperk = JSON.parse(localStorage.getItem("storageKickperk"));
                const isAllowLast = (localStorage.getItem("storageAllowLast") === 'true') ? true : false;

                const parser = new DOMParser();
                const doc = parser.parseFromString(data, "text/html");

                let arrElems = [];
                const elems = doc.querySelectorAll('span.kf2gameinfo');
                elems.forEach(elem => {
                    arrElems.push(elem.dataset.kf2gameinfo);
                });

                const arrGamer = JSON.parse(`[${arrElems.join(',')}]`);

                const arrWaveinfo = doc.querySelector('span.kf2waveinfo').dataset.kf2waveinfo.split(',');
                const waveNum = parseInt(arrWaveinfo[0]);
                const waveMax = parseInt(arrWaveinfo[1]);

                if(waveNum === 3) {
                    announce_count = 0;
                }

                for (const gamer of arrGamer) {
                    if (gamer.perkName === '') {
                        // do nothing
                    } else if (gamer.isSpectator === 'Yes') {
                        // do nothing
                    } else {
                        if (parseInt(gamer.perkLevel) < MIN_LV || MAX_LV < parseInt(gamer.perkLevel)) {
                            asyncPostAll(gamer);
                        } else if (isAllowLast && (waveMax <= waveNum)) { // last wave and boss wave
                            announce_count += 1;
                            if (announce_count === 1 || announce_count === 7) {
                                const paramchat = new URLSearchParams();
                                paramchat.set('ajax', '1');
                                paramchat.set('message', `Allowed All Perks from last wave until the Boss wave.`);
                                paramchat.set('teamsay', '-1');
                                // announce 
                                fetch('/ServerAdmin/current/chat+frame', {
                                    method: 'POST',
                                    body: paramchat
                                });
                            }
                        } else if (arrKickperk.includes(gamer.perkName)) {
                            asyncPostAll(gamer);
                        }
                    }
                } //for
            })
            .catch(e => console.log(e));
        // improve memory leak issue
        if (0 < timer_count && timer_count % 1000 == 0) { // 1000: 3H20M
            clearInterval(g_time_id);
            g_time_id = setInterval(kickTime, KICK_INTERVAL);
            //console.log(`new id: ${g_time_id}`);
        }
    }

    { //main
        const arrKickperkInit = Array(10).fill('anonymous');

        localStorage.getItem("storageMin") || (localStorage.setItem("storageMin", "0"), console.log("localStorage MinLv initialized"));
        localStorage.getItem("storageMax") || (localStorage.setItem("storageMax", "25"), console.log("localStorage MaxLv initialized"));
        localStorage.getItem("storageKickperk") || (localStorage.setItem("storageKickperk", JSON.stringify(arrKickperkInit)), console.log("localStorage Kickperk initialized"));
        localStorage.getItem("storageAllowLast") || (localStorage.setItem("storageAllowLast", "false"), console.log("localStorage AllowLast initialized"));

        g_time_id = setInterval(kickTime, KICK_INTERVAL);
    }
})();