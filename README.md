# Feature

* You are able to auto-kick level or perk without mutator as Ranked Server.
* I'm not original creator, I fixed a issue and improved, add perk-kick features.  

Original script is here. (not available)  
https://forums.tripwireinteractive.com/forum/killing-floor-2/killing-floor-2-modifications/general-modding-discussion-ad/beta-mod-releases/115511-webadmin-auto-kick-players-by-perk-level

# Install

1. Install Chrome* or FireFox. *Recommend Chrome
2. Install browser addon [Violentmonkey](https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag).
3. Download latest release [zip file](https://github.com/BEROCHLU/kf2-autokick-level-and-perk/releases).
4. Import the zip file from Violentmonkey setting.
5. Extract the zip file.
6. Backup and OverWrite 3 files:  
location: \<KF2Server\>\KFGame\Web\ServerAdmin
    * console.html
    * current_players.html
    * current_players_row.inc

# Run

1. Launch KF2 Server.bat
2. Open brower FireFox or Chrome.
3. Move to WebAdmin. (default: http://localhost:8080)  

# Settings
![kf2guide1](https://user-images.githubusercontent.com/42054433/86207426-7da42d00-bba9-11ea-8ff2-bd9d48e8ec7b.png)
Click `MANAGEMENT CONSOLE` in WebAdmin.
* ALLOW MINIMUM PERK LEVEL  
A player below this level will be kicked.

* ALLOW MAXIMUM PERK LEVEL  
A player above this level will be kicked.

* KICK PERK  
Checked perks will be kicked.

* ALLOW ALL PERKS FROM LAST WAVE UNTIL THE BOSS WAVE  
If checked Enable, all perks are allowed between last wave and boss wave. (default: unchecked)
But keep level-kick. When players reach last wave, following message will be announced:  
_Allowed All Perks from last wave until the Boss wave._

These settings will take effect in a few seconds after being changed.

# Confirm

It dose works if you see a number 1 with Violentmonkey icon.  
![monkey](https://user-images.githubusercontent.com/42054433/86208261-269f5780-bbab-11ea-9413-efc7c36ba9db.JPG)

Keep open browser to work auto-kick script. If you close the browser, the script will not work.

# Q&A

# All players name are shown as anonymous in PLAYERS page

![kf2guide2](https://user-images.githubusercontent.com/42054433/86207878-72053600-bbaa-11ea-8d57-5e7614bec9cd.png)
It is not a bug but a feature. All players name are shown as anonymous because to avoid a bug which would not work by GO button. This is not my script bug. This is a known bug caused by the KF2 server not assuming player name whose multibyte-characters. That is why this is not my script bug.

# Does it run with Tampermonkey too?

Yes, if your server under heavy load, Tampermonkey could be better.

# Can I do individual auto-kick setting for multiple server?	

Yes, the setting is independent per url and is stored individually.

# What is a fixed issue and improved

I fixed and improved things are following:

* Previous auto-kick script could't kick specific player whose name is multi byte character. (e.g. Japanese, Chinese, Korea)  
* No need to keep open AUTO-KICK page to enable auto-kick script. This script is valid each page in WebAdmin.
