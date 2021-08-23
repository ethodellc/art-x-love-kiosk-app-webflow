console.log('Setting kiosk screen to: ' + kioskScreen);
console.log('Current category slug is: ', currentCategorySlug);
console.log('The next video will play in ' + secondsToWaitUntilNextStory + ' seconds');
console.log('The next video will be: ' + nextStoryPathName);

// Know that we know the current category of the video playing, we can find
// the video navigation menu button for that category
let currentCategoryButton = document.querySelector("[class='story-categories-data'][data-story-category-slug='" + currentCategorySlug + "']").closest('.w-dyn-item').querySelector('.js-video-navigation-menu-button');

console.log('Current category button is: ', currentCategoryButton);

// Trigger a click event on the video navigation menu button that represents the current category of the video that is being played
currentCategoryButton.click();

// Show another story if the user doesn't do anything
// If we want to play sequentially....
// we would need to do a setTimeout, but call a function to play
// the next story, e.g. nextStoryPathName

// If we want to play sequentially....
setTimeout(showRandomStory, secondsToWaitUntilNextStory * 1000);

// Whenever a video navigation menu button is clicked...
document.addEventListener('click', function (event) {

  // If the click event is not for a video navigation button, then exit
  if (!event.target.matches('.js-video-navigation-menu-button')) return

  console.log('Video navigation menu clicked.');

  // Get the story category represented by the button
  let clickedCategorySlug = event.target.closest('.w-dyn-item').querySelector('.story-categories-data').dataset.storyCategorySlug;

  console.log('Category slug of video clicked: ' + clickedCategorySlug);

  // Temporarily make all video navigation menu buttons no longer active
  console.log('Removing "active-video-navigation-menu-button" from all video navigation menu buttons.');
  document.querySelectorAll('.js-video-navigation-menu-button').forEach(el => el.classList.remove('active-video-navigation-menu-button'));

  // Hide all the video thumbnails
  console.log('Hiding all video thumbnails...');
  document.querySelectorAll('.video-collection-group').forEach(el => el.classList.add('hidden'));

  // Make the clicked category button active
  console.log('Adding the "active-video-navigation-menu-button" class to the video navigation menu button that was just clicked');
  event.target.classList.add('active-video-navigation-menu-button');

  // Show the video thumbnails of the category of the button clicked
  console.log('Showing all the video thumbnails for the category related to the button just clicked.  The video-collection-group should have a class called "hidden" which is being removed.');
  document.querySelector('.' + clickedCategorySlug + '-video-collection').closest('.video-collection-group').classList.remove('hidden');

});