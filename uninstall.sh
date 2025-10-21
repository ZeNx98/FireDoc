#!/usr/bin/env bash
#
# by ZeNx98
#
# Uninstall script for FireDoc
# https://github.com/ZeNx98/firedoc
#

printf "%b\n" "\nSorry to see you go (o︵o)\n"

GOOD="\033[92m✔\033[0m"

printf "%b\n" "$GOOD Removed config files"
rm -rf "$HOME/.config/firedoc"

printf "%b\n" "$GOOD Removed CLI program"
rm -f $HOME/.local/bin/firedoc

printf "%b\n" "$GOOD Removed desktop application\n"
rm -f $HOME/.local/share/applications/firedoc.desktop
update-desktop-database > /dev/null 2>&1

printf "%b\n" "A new Firefox window has been launched"
printf "%b\n" "Manually remove the \033[1mfiredoc\033[0m profile"
if command -v firefox > /dev/null; then 
    firefox --new-window "about:profiles"
elif command -v librewolf > /dev/null; then 
    librewolf --new-window "about:profiles"
fi
