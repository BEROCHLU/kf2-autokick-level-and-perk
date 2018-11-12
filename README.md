
# Feature

* You are able to auto-kick level or perk without mutator as Ranked Server.
* I'm not original creator, I fixed a issue and improved, add perk-kick features.  

Original script is here. (not available)  
https://forums.tripwireinteractive.com/forum/killing-floor-2/killing-floor-2-modifications/general-modding-discussion-ad/beta-mod-releases/115511-webadmin-auto-kick-players-by-perk-level

# Install

1. Install FireFox or Chrome addon Violentmonkey https://addons.mozilla.org/ja/firefox/addon/violentmonkey/  
2. Import the zip file from Violentmonkey setting.  
3. Backup and OverWrite 3 files:  
console.html, current_players.html, current_players_row.inc  
location: \<KF2Server\>\KFGame\Web\ServerAdmin  

# Run

1. Launch KF2 Server.bat
2. Open brower FireFox or Chrome.
3. Move to WebAdmin. (default: http://localhost:8080)  

# Confirm

It dose works if you see a number 1 with Violentmonkey icon.

# Where is setting which can restrict level or perk?

1. Click MANAGEMENT CONSOLE in WebAdmin.
2. Edit level or perk which you want to restrict. Changed setting is adapted in a few second.  

# What is a fixed issue and improved

I fixed and improved things are following:

* Previous auto-kick script could't kick specific player whose name is multi byte character. (e.g. Japanese, Chinese, Korea)  
* No need to keep open AUTO-KICK page to enable auto-kick script. This script is valid each page in WebAdmin.

# Can I do individual auto-kick setting for multiple server?	

Yes, the setting is independent per url and is stored individually.

# Does it run with Tampermonkey too?

Yes, if your server under heavy load, Tampermonkey could be better.
