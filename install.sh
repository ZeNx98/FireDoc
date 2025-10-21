#!/usr/bin/env sh
#
# by ZeNx98
#
# Installation script for FireDoc
# https://github.com/ZeNx98/firedoc
#

VERSION="1.0.0"

FIREDOC_BIN="$HOME/.local/bin/firedoc"
FIREDOC_DESKTOP="$HOME/.local/share/applications/firedoc.desktop"
FIREDOC_CONFIG="$HOME/.config/firedoc"
FIREDOC_ICON="$FIREDOC_CONFIG/icon.png"
FIREDOC_STARTPAGE="$FIREDOC_CONFIG/startpage.html"

GOOD="\033[92m✔\033[0m"

# Fancy-schmancy banner
echo -e "\e[1m  _____ _          ___            
 |  ___(_)_ __ ___|   \ ___   ___ 
 | |_  | | '__/ _ \ |) / _ \ / __|
 |  _| | | | |  __/ |/ / (_) | (__ 
 |_|   |_|_|  \___|___/ \___/ \___|  v$VERSION\n\e[0m"


# We generate a new profile and fetch the profile's directory name by finding the
# newest directory in ~/.mozilla/firefox/
# This directory name is appended to the ~/.mozilla/firefox/ to get the profile's path
#
# Credits to u/ashutosharma97 on Reddit for showing how to create new
# Firefox profiles from the CLI: https://bit.ly/3MayLRu+
if [ -d "$HOME/.mozilla" ]; then
   profile_root_directory="$HOME/.mozilla/firefox/$(firefox -CreateProfile firedoc && ls -td | head -1)"
elif [ -d "$HOME/.librewolf" ]; then 
   profile_root_directory="$HOME/.librewolf/$(librewolf -CreateProfile firedoc && ls -td | head -1)"
fi


# The config directory for FireDoc is created and the config files
# are copied into it. 
#
# Config file explainations:
#   icon.png - This image file is used as the icon for the desktop app
#   startpage.html - This is the UI that the user sees if no PDF is selected
mkdir -p "$FIREDOC_CONFIG"
cp resources/icon.png "$FIREDOC_ICON"
cp resources/startpage.html "$FIREDOC_STARTPAGE"

# Copy our custom settings to FireDoc's Firefox profile and
# add the path to the startpage into the settings file
cp resources/user.js "$profile_root_directory/"
sed -i "s|STARTPAGE_PATH|$FIREDOC_STARTPAGE|" "$profile_root_directory/user.js"
printf "%b\n" "$GOOD Configured icon and startpage"


# The 'chrome' directory is created and 'userChrome.css' i copied into it
# 'userChrome.css' contains custom CSS that hides UI elements in Firefox that
# creates the illusion that FireDoc is just a PDF reader and not a web browser
mkdir -p "$profile_root_directory/chrome"
cp resources/userChrome.css "$profile_root_directory/chrome"
printf "%b\n" "$GOOD Configured UI using userChrome.css"


# Copy the 'firedoc' script into ~/.local/bin/ and swap the string FIREDOC_PROFILE
# for the path to FireDoc's Firefox profile
cp resources/firedoc "$FIREDOC_BIN"
chmod +x "$FIREDOC_BIN"
sed -i "s|FIREDOC_PROFILE|$profile_root_directory|" "$FIREDOC_BIN"
printf "%b\n" "$GOOD Added 'firedoc' command to ~/.local/bin/"


# Copy FireDoc's desktop application file into the directory
# which application launchers look for .desktop files.
# Then add the path to the firedoc script and the path to
# the icon that will be used for the desktop application
cp resources/firedoc.desktop "$FIREDOC_DESKTOP"
sed -i "s|FIREDOC_COMMAND|$FIREDOC_BIN|" "$FIREDOC_DESKTOP"
sed -i "s|ICON_FILE_PATH|$FIREDOC_ICON|" "$FIREDOC_DESKTOP"
update-desktop-database > /dev/null 2>&1
printf "%b\n" "$GOOD Installed FireDoc as a desktop application"
printf "%b\n" "$GOOD Installation complete!\n"


message="\033[1;4mWays to use FireDoc\033[0m
1. Launch FireDoc from your application launcher
2. Open a PDF from your file browser
3. Run 'firedoc' from the CLI
   Make sure ~/.local/bin is in your \$PATH\n"

printf "%b\n" "$message"
