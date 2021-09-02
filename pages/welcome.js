console.log('Source: https://webflow.com/design/akron-stories-kiosk-app');
console.log('Inside Welcome page...');

// The kioskScreen variable is initialized in the footer code here: https://webflow.com/dashboard/sites/akron-stories-kiosk-app/code
kioskScreen = 'welcome';
console.log('Setting kiosk screen to: ' + kioskScreen);

function loadStoriesIntoStorage() {
  let storyDataElements = document
    .getElementById("js-collection-stories")
    .getElementsByClassName("js-story-data");

  if (!storyDataElements || storyDataElements.length < 1) {
    alert('Could not locate stories on Welcome page.  Please make sure there is a Collection List with a hidden div with an element with an id of "js-collection-stories" with collection items having a class name of "js-story-data"');
  } else {
    let stories = [];
    console.log('storyDataElements', storyDataElements);

    for (el of storyDataElements) {
      stories.push({
        link: el.dataset.storyLink,
        name: el.dataset.storyName
      });
    }

    if (stories.length < 1) {
      alert('Could not load any story data.  Please check that stories have been inserted into the CMS.');
    } else {

      // setStories is defined here: https://webflow.com/dashboard/sites/akron-stories-kiosk-app/code
      setStories(stories);
      console.log('total stories loaded: ' + stories.length);
      console.log('stories: ', stories);
    }
  }
}

function onWelcomeScreenClicked() {
  console.log("welcome screen clicked");

  // This function is defined in the global code
  // https://webflow.com/dashboard/sites/akron-stories-kiosk-app/code
  showRandomStory();
}

document.addEventListener('DOMContentLoaded', function (event) {
  console.log('DOM ready... loading stories into storage...');
  loadStoriesIntoStorage();
});

// When the user clicks anywhere on the Welcome screen,
// except for a nav menu link,
// show a random story
document.addEventListener('click', function (event) {

  console.log('click event detected on welcome screen. event target: ', event.target);
  console.log('event target parent: ', event.target.parentNode);
  console.log('event target grandparent: ', event.target.parentNode.parentNode);

  // Unless the click was in the nav menu, do not follow the link
  let isInNavMenu = event.target.closest('.nav-menu');

  if (isInNavMenu) {
    console.log('Link was in nav menu, so handling click as expected.');
    return;
  } else {
    event.preventDefault();
    //onWelcomeScreenClicked();
  }
}, false);