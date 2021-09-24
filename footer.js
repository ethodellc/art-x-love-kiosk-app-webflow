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
  console.log('Continue watching prompt was shown, but the user did not respond.  Hiding the prompt and then returning to the welcome screen');
  hideContinueWatchingPrompt();
  showWelcomeScreen();
}

// This will tell the app to listen for user events that indicate an active user
// If detected, the onKioskUserActive handler will be called
function detectActiveUser() {
  console.log('Preparing to detect events that would indicate the kiosk user is active...');

  // These are events that, when dispatched, would indicate an active user...
  let activeUserEvents = ['mousedown', 'mousemove', 'keyup', 'keypress', 'scroll', 'touchstart'];

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
  let millisecondsOfInactivity = new Date().getTime() - startTime.getTime();
  return millisecondsOfInactivity / 60000; // 1,000 ms in one second and 60 seconds in one minute
}

// Returns a random URL to one of the Akron Stories
function getRandomStoryLink() {
  let stories = getStories();

  if (!stories || !stories.length || stories.length < 1) {
    console.warn('Could not load stories.  Redirecting to welcome page instead.');
    showWelcomeScreen();
  } else {
    console.log("Total stories: ", stories.length);
    let randomStory = stories[Math.floor(Math.random() * stories.length)];
    console.log("Random story: ", randomStory);
    return randomStory.link;
  }
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

/**
 * This function should be called in the event that the kiosk user has been inactive
 * for too long.
 * 
 * If they have been, and are on the stories screen, it will display a "continue watching?" prompt
 * If they have been, and are not on the stories screen, it will show a random story
 * 
 * @see showContinueWatchingPrompt
 * @see showRandomStory
 * @link https://trello.com/c/jOnt9Hdm/35-8-17-21-create-a-continue-watching-prompt
 * @link https://trello.com/c/mSHaOt9y/14-7-29-21-implement-global-inactivity-timer
 */
function onKioskUserInactiveForTooLong() {
  console.log('Kiosk user has been inactive for too long...');

  if (isOnStoriesScreen()) {
    console.log('Since the kiosk user has been inactive on the stories screen, the next step is to show the continue watching prompt.');
    showContinueWatchingPrompt();
  } else {
    console.log('Since the kiosk user is not on the stories screen, the next step is to show a random story.');
    showRandomStory();
  }
}

function onStoriesLinkClicked() {
  showRandomStory();
}

// resets the inactity timer by stetting the start time to now
function resetStartTime() {
  //console.log('Reseting inactivity timer to start tracking now.');
  let startTime = new Date();
  sessionStorage.setItem("startTime", startTime);
  return startTime;
}

// Resets the starting point of user inactivity and
// then starts the time loop again
function restartTimer() {
  resetStartTime();
  startInactivityTimer();
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

/**
 * Shows the continue watching prompt and sets up a timeout function
 * to automically close the continue watching prompt after the max amount
 * of minutes to display has elapsed.
 * 
 * @see autoCloseContinueWatchingPrompt
 * @link https://trello.com/c/jOnt9Hdm/35-8-17-21-create-a-continue-watching-prompt
 */
function showContinueWatchingPrompt() {
  console.log('Showing the continue watching prompt...');
  show("js-continue-watching-prompt", "flex");
  document.getElementById('js-continue-watching-prompt').style.opacity = "100";
  document.getElementById('js-continue-watching-prompt').style.webkitOpacity = "100";
  continueWatchingPromptTimeout = setTimeout(
    autoCloseContinueWatchingPrompt,
    getMaxMinutesToShowContinueWatchingPrompt() * 60000 // 60000 ms = 1 min
  );
}

/**
 * Shows a random story.
 * This will redirect the kiosk user to the story page.
 * 
 * @see getRandomStoryLink
 */
function showRandomStory() {
  console.log('Showing a random story...');

  // Is the continue watching prompt on this page?
  let continueWatchingPrompt = document.getElementById('js-continue-watching-prompt');


  // If so, is it displayed/visible?
  // Then we need to delay showing a random story for now
  if (continueWatchingPrompt && continueWatchingPrompt.style.opacity == "100") {
    console.log('Continue watching prompt is visible, so delaying showing a random story for now.');
    let continueWatchingButton = document.getElementById('js-continue-watching-button');

    continueWatchingButton.addEventListener('click', event => {
      console.log('Kiosk user chose to continue watching.  Resuming the original action of showing a random story...');
      hideContinueWatchingPrompt();
      restartTimer();
      window.location.href = getRandomStoryLink();
    });
  } else {
    window.location.href = getRandomStoryLink();
  }
}

// The welcome screen is the home screen, so we return to the index
function showWelcomeScreen() {
  console.log('Showing the welcome screen...');
  window.location.href = "/";
}

// Starts the inactivity timer if it has not been started already
function startInactivityTimer() {
  console.log('Starting or resuming inactivity timer loop...');
  // This will first attempt to get a timer out of storage.  If it doesn't exist yet, it will restart the timer
  let startTime = new Date(
    sessionStorage.getItem("startTime") || resetStartTime()
  );

  // This function will run every second (1000ms)
  userInactivityTimer = window.setInterval(function () {
    //console.log('kiosk tick');

    // How many minutes has the kiosk user been inactive for?
    let minutesElapsed = getMinutesOfInactivitySince(startTime);
    //console.log('Minutes elapsed: ', minutesElapsed);
    //console.log('Max minutes: ', getMaxMinutesOfInactivity());
    //console.log('Is inactive too long? ', minutesElapsed >= getMaxMinutesOfInactivity());

    // Have we gone past the maximum number of allowed minutes of inactivy?
    if (minutesElapsed >= getMaxMinutesOfInactivity()) {
      console.log('User has been inactive for too long:  ' + minutesElapsed + ' minutes of inactivity. Stopping inactivity timer loop.');
      clearInterval(userInactivityTimer);
      resetStartTime();
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
  console.log('DOM is ready, starting inactivity timer...')
  startInactivityTimer();

  console.log('Overriding footer navigation link for stories link.');
  let footerStoriesLink = document.getElementById('js-footer-stories-link');

  if (footerStoriesLink) {
    footerStoriesLink.addEventListener('click', function (e) {
      e.preventDefault();
      onStoriesLinkClicked();
    });
  }

  console.log('Detecting external images...');
  // Find all collection items that need to set their src attribute from 
  // an external link
  let dynamicImages = document.querySelectorAll('.js-dynamic-external-image');

  if (dynamicImages && dynamicImages.length) {
    // For each collection item found found, set the src of the image to
    // the hidden text field
    dynamicImages.forEach((dynamicImageWrapper) => {
      let dynamicImage = dynamicImageWrapper.querySelector('.js-dynamic-external-image--image');
      let imageLink = dynamicImageWrapper.querySelector('.js-dynamic-external-image--link').innerText;
      dynamicImage.src = imageLink;
    });
  }

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