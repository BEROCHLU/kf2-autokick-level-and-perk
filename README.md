
# Feature

* You are able to auto-kick level or perk without mutator as Ranked Server.
* I'm not original creator, I fixed a issue and improved, add perk-kick features.  

Original script is here. (not available)  
https://forums.tripwireinteractive.com/forum/killing-floor-2/killing-floor-2-modifications/general-modding-discussion-ad/beta-mod-releases/115511-webadmin-auto-kick-players-by-perk-level

# How to install

1. Install FireFox or Chrome addon Violentmonkey https://addons.mozilla.org/ja/firefox/addon/violentmonkey/  
2. Import KF2auto-kick.user.js by Violentmonkey setting.  
3. Backup and OverWrite 3 files:  
console.html, current_players.html, current_players_row.inc  
location: \<KF2Server\>\KFGame\Web\ServerAdmin  

# How to run

1. Launch KF2 Server.bat
2. Open brower FireFox or Chrome
3. Move to WebAdmin (e.g. http://localhost:8080)  

# How to restrict level or perk

1. Click MANAGEMENT CONSOLE
2. Edit level or perk what you want.

# What is a fixed issue and improved

I fixed and improved things are following:

* Previous auto-kick script could't kick specific player whose name is multi byte character. (e.g. Japanese, Chinese, Korea)  
* It was need to keep open AUTO-KICK page to run auto-kick script.

# How do I individual auto-kick setting for multiple server.

In the case your opened ListenPort is 8080 and 8081.  
Prepare for KF2auto-kick.user.js of two.  
Change @match of UserScript Header.  
One is changed http://\*/ServerAdmin/\* to http://localhost:8080/ServerAdmin/*  
The other is changed http://\*/ServerAdmin/\* to http://localhost:8081/ServerAdmin/*  
