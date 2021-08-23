console.log("Source: https://webflow.com/dashboard/sites/akron-stories-kiosk-app/code");
console.log("current page: " + window.location.pathname);

/**
 * Trac
 */
let kioskScreen = null;

///////////
//
// GLOBALS
//
///////////

// This is used to set a timer to automatically close the "continue watching?" prompt
let continueWatchingPromptTimeout = null;
let userInactivityTimer = null;

// This will automatically close the "continue watching?" prompt
// if the user has been inactive and didn't choose an answer
// By default, it returns to the welcome screen
function autoCloseContinueWatchingPrompt() {
  console.log('Continue watching prompt was shown, but the user did not respond. Returning to welcome screen.');
  showWelcomeScreen();
}

// This will tell the app to listen for user events that indicate an active user
// If detected, the onKioskUserActive handler will be called
function detectActiveUser() {
  console.log('Preparing to detect events that would indicate the kiosk user is active...');

  // These are events that, when dispatched, would indicate an active user...
  let activeUserEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

  activeUserEvents.forEach(function (eventName) {

    // When one of these active events is detected, call the event handler for an active user
    document.addEventListener(eventName, onKioskUserActive, true);
  });
}

// Broadcasts an even to the app that the user has gone several minutes without any interactioin
// with the kiosk
function dispatchUserInactiveForTooLongEvent() {
  window.dispatchEvent(new CustomEvent("akronStories.userInactiveForTooLong"));
}

// return the maximum number of minutes of inactivity allowed
// defaults to 10 minutes if it has not been set
function getMaxMinutesOfInactivity() {
  return parseInt(sessionStorage.getItem("maxMinutesOfInactivity"), 10) || 10;
}

// returns the maximum number of minutes to show the continue
// watching prompt
// defaults to 3 mimnutes if it has not been set
function getMaxMinutesToShowContinueWatchingPrompt() {
  return parseInt(sessionStorage.getItem("maxMinutesToShowContinueWatchingPrompt"), 10) || 3;
}

// 
/**
 * Returns the number of minutes the user has been inactive for
 * 
 * @returns number
 */
function getMinutesOfInactivity() {
  return getMinutesOfInactivitySince(getStartTime())
}

/**
 * Returns the number of minutes the user has been inactive compared to a given point in time
 * 
 * @param {number} startTime 
 * @returns {number} The decimal value representing the elapsted time in minutes.  
 * E.g. 1.5 would be 1 and a half minutes and 0.75 would be 45 minutes
 */
function getMinutesOfInactivitySince(startTime) {
  let millisecondsOfInactivity = Math.floor(
    new Date().getTime() - startTime.getTime()
  );
  return millisecondsOfInactivity / 60000; // 1,000 ms in one second and 60 seconds in one minute
}

// Returns a random URL to one of the Akron Stories
function getRandomStoryLink() {
  let stories = getStories();

  if (!stories || !stories.length || stories.length < 1) {
    alert('ERROR: Could not load stories.');
    return;
  } else {
    console.log("Total stories: ", stories.length);
  }

  let randomStory = stories[Math.floor(Math.random() * stories.length)];
  console.log("Random story: ", randomStory);
  return randomStory.link;
}

function getStartTime() {
  return new Date(sessionStorage.getItem("startTime"));
}

// Gets the stories that were loaded into session storage on the welcome screen
function getStories() {
  return JSON.parse(sessionStorage.getItem("stories"));
}

// Hides an element by it's id
function hide(elementId) {
  document.getElementById(elementId).style.display = "none";
}

function hideContinueWatchingPrompt() {
  hide("js-continue-watching-prompt");
  clearTimeout(continueWatchingPromptTimeout);
}

// returns true if the app is running as an electron app
function isElectron() {
  return window.electron;
}

function isOnStoriesScreen() {
  console.log('checking if we are on stories screen');
  console.log('kioskScreen is set to ', kioskScreen)
  console.log('kioskScreen == "stories"?', kioskScreen == "stories");
  console.log('window.location.pathname is set to ', window.location.pathname);
  console.log('window.location.pathname.indexOf("/stories") == 0?', window.location.pathname.indexOf("/stories"));
  return kioskScreen == "stories" || window.location.pathname.indexOf("/stories") == 0;
}

// This function is called if user activity is detected
function onKioskUserActive() {
  //console.log('Kiosk user is active, restarting inactivity timer.');
  restartTimer();
}

function onKioskUserInactiveForTooLong() {
  //console.log('Kiosk user has been inactive for too long, restarting inactivity timer.');
  //restartTimer();

  if (isOnStoriesScreen()) {
    console.log('Showing continue watching prompt.');
    showContinueWatchingPrompt();
  } else {
    console.log('Showing random story.');
    showRandomStory();
  }
}

// resets the inactity timer by stetting the start time to now
function resetStartTime() {
  let startTime = new Date();
  sessionStorage.setItem("startTime", startTime);
  return startTime;
}

// Resets the starting point of user inactivity and
// then starts the time loop again
function restartTimer() {
  resetStartTime();
  startTimer();
}

// Sets the maximum number of minutes of inactivity
function setMaxMinutesOfInactivity(maxMinutesOfInactivity) {
  return sessionStorage.setItem("maxMinutesOfInactivity", maxMinutesOfInactivity);
}

// sets the maximum number of minutes to show the continue
// watching prompt
function setMaxMinutesToShowContinueWatchingPrompt(maxMinutesToShowContinueWatchingPrompt) {
  return sessionStorage.setItem("maxMinutesToShowContinueWatchingPrompt", maxMinutesToShowContinueWatchingPrompt);
}

function setStories(stories) {
  sessionStorage.setItem("stories", JSON.stringify(stories));
}

// Displays an element by it's id
// Defaults to block display, but second parameter can override to flex, inline, etc.
function show(elementId, display = "block") {
  document.getElementById(elementId).style.display = display;
}

function showContinueWatchingPrompt() {
  show("js-continue-watching-prompt", "flex");
  continueWatchingPromptTimeout = setTimeout(
    autoCloseContinueWatchingPrompt,
    getMaxMinutesToShowContinueWatchingPrompt() * 60000 // 60000 ms = 1 min
  );
}

// Show random story
function showRandomStory() {
  console.log('showing a random story...')
  window.location.pathname = getRandomStoryLink();
}

// The welcome screen is the home screen, so we return to the index
function showWelcomeScreen() {
  window.location.pathname = "/";
}

// Starts the inactivity timer if it has not been started already
function startTimer() {
  //console.log('Starting or resuming inactivity timer loop...');
  // This will first attempt to get a timer out of storage.  If it doesn't exist yet, it will restart the timer
  let startTime = new Date(
    sessionStorage.getItem("startTime") || resetStartTime()
  );

  // This function will run every second (1000ms)
  userInactivityTimer = window.setInterval(function () {

    // How many minutes has the kiosk user been inactive for?
    let minutesElapsed = getMinutesOfInactivitySince(startTime);

    // Have we gone past the maximum number of allowed minutes of inactivy?
    if (minutesElapsed >= getMaxMinutesOfInactivity()) {
      console.log('User has been inactive for too long.  Stopping inactivity timer loop');
      clearInterval(userInactivityTimer);
      resetStartTime()
      dispatchUserInactiveForTooLongEvent();
    }
  }, 1000);

  window.dispatchEvent(new CustomEvent("akronStories.timerStarted"));
  timerStartedAt = getStartTime();
  //console.log('Initial start time: ', timerStartedAt);
  //console.log('Minutes of inactivity since timer initially started: ', getMinutesOfInactivitySince(timerStartedAt));
}


///////////////
//
// EVENTS
//
///////////////
document.addEventListener('DOMContentLoaded', function (event) {
  console.log('DOM is ready, starting timer...')
  startTimer();

  // Leaving this in here for now, as carry over from POC, may not need for
  // final launch
  // If we are viewing in the actual kiosk (and not on the web), then we need to remove
  // the extra padding that is placed on the video element for the embedded
  // video since it is no longer loaded dynamically.
  /*if (isElectron()) {
  let videoPlayer = document.getElementById('js-video-player');
if (videoPlayer) {
  // Hide the navigation menu
  let nav = document.querySelector('.menu-wrapper');
nav.style.display = "none";

// Remove any extra padding on the top of the video
videoPlayer.style.paddingTop = "0%";

// Make the video fill the width of the screen
videoPlayer.width = "100%";

// If user activity is detected, show the nav menu again
window.addEventListener('akronStories.userActive', function (event) {
  nav.style.display = "block";
        })
      }
  }*/
});

// When the user becomes active...
window.addEventListener(
  "akronStories.userActive",
  function (event) {
    onKioskUserActive();
  },
  false
);

// When the user becomes inactive for too long...
window.addEventListener(
  "akronStories.userInactiveForTooLong",
  function (event) {
    onKioskUserInactiveForTooLong();
  },
  false
);

// Once the window loads, start detecting inactivity
window.onLoad = detectActiveUser();