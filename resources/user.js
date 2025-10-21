// Custom homepage/startpage
user_pref("browser.startup.homepage", "STARTPAGE_PATH");

// Enable ability to use userChrome.css
user_pref("toolkit.legacyUserProfileCustomizations.stylesheets", true);

// Disable welcome screen
user_pref("browser.aboutwelcome.enabled", false);

// Force showing title bar with window controls (important for KDE)
user_pref("browser.tabs.inTitlebar", 0);
