function addSearchButtonToVirtualKeyboard() {

  // Only add the search button if the "P" button is on the keyboard
  // and the SEARCH button has not already been added.
  let pButton = document.querySelector('.kioskboard-key-p');
  let searchButton = document.querySelector('.kioskboard-key-close');
  if (pButton && !searchButton) {
    let searchButtonHtml = `<span style="font-family:sans-serif,sans-serif;font-weight:normal;font-size:22px; width:140px; max-width:140px;"
    class="kioskboard-key kioskboard-key-close" data-index="9" data-value=""
    onclick="window.document.body.click();">SEARCH</span>`;
    let pButton = document.querySelector('.kioskboard-key-p');
    pButton.insertAdjacentHTML("afterend", searchButtonHtml);
  }
}

function onSearchTermEntered(searchTerm) {
  if (!searchTerm || searchTerm == "" || searchTerm == " ") {
    console.log('Search term triggered, but no search term entered, returning.  Search term value: ', searchTerm);
    return;
  }

  console.log('Search term entered: ' + searchTerm);
  let totalMatches = 0;
  let listItemElements = document.querySelectorAll('.brick-container .js-brick-description-container');

  listItemElements.forEach(function (element) {
    if (element.innerText.toLowerCase().includes(searchTerm.toLowerCase())) {
      console.log('Brick match found: ' + element.innerText);
      totalMatches++;
      element.closest('.brick-list-item').style.display = "block";

      // Also display the brick description
      element.closest('.js-brick-description-container').style.display = "block";
    } else {
      element.closest('.brick-list-item').style.display = "none";

      // Also hide the brick description
      element.closest('.js-brick-description-container').style.display = "none";
    }
  });

  if (totalMatches > 0) {
    document.getElementById('search-not-found').style.display = "none";
  } else {
    document.getElementById('search-not-found').style.display = "block";
  }
}

function onVirtualKeyboardClosed() {
  console.log('onVirtualKeyboardClosed triggered');
  let searchInputElement = document.getElementById('Search');
  console.log('Keyboard closed.  Search input element: ', searchInputElement);
  console.log('Search input value: ', searchInputElement.value);
  onSearchTermEntered(searchInputElement.value);
}

function onVirtualKeyboardOpened() {
  console.log('onVirtualKeyboardOpened triggered');
  // When the virtual keyboard is displayed, display the button to close it
  let closeKeyboardButton = document.getElementById('js-close-keyboard');
  closeKeyboardButton.style.display = 'block';
  addSearchButtonToVirtualKeyboard();
}

// Once the DOM is ready...
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('DOM ready:  Adding event listener to search field...');

  window.document.body.addEventListener('click', function (e) {
    console.log('Click detected on the page.  Target: ', e.target);
  });

  let searchInputElement = document.getElementById('Search');

  searchInputElement.addEventListener('click', function (e) {
    console.log('click event detected on search input');
    onVirtualKeyboardOpened();
  });

  searchInputElement.addEventListener('click', function (e) {
    console.log('search input has received focus');
  });

  searchInputElement.addEventListener('keyup', function (e) {
    console.log('keyup event detected on search input');
    onSearchTermEntered(e.target.value);
  });

  // Whenever a brick owner is clicked, display the description for the brick
  // When it is clicked again, hide it.
  // SEE: https://trello.com/c/v9ddieAF/56-8-30-21-after-search-results-are-shown-on-find-my-brick-page-display-the-brick-content-if-someone-clicks-on-their-name
  document.querySelectorAll('.js-brick-owner-container').forEach(function (brickOwnerContainer) {
    brickOwnerContainer.addEventListener('click', function (clickEvent) {
      console.log('Brick owner container clicked.');
      console.log('Brick owner container element: ', brickOwnerContainer);
      console.log('Brick container: ', brickOwnerContainer.closest('.brick-container'));
      console.log('Brick descriptoin container: ', brickOwnerContainer.closest('.brick-container').querySelector('.js-brick-description-container'));
      let brickDescriptionContainer = brickOwnerContainer.closest('.brick-container').querySelector('.js-brick-description-container');

      if (brickDescriptionContainer) {
        console.log('Checking brick style display... is this next value not equal to block?');
        console.log(brickDescriptionContainer.style.display);
        if (!brickDescriptionContainer.style.display || brickDescriptionContainer.style.display != "block") {
          console.log('attempting to display brick description', brickDescriptionContainer);
          console.log('style.display before: ', brickDescriptionContainer.style.display);
          brickDescriptionContainer.style.display = "block";
          console.log('style.display after: ', brickDescriptionContainer.style.display);
        } else {
          console.log('attempting to hide brick description', brickDescriptionContainer);
          brickDescriptionContainer.style.display = "none";
        }
      } else {
        console.warn('Could not find a brick description container for brick owner container:', brickOwnerContainer);
      }
    });
  })
});

// Set up Keyboard once DOM is ready
document.addEventListener('DOMContentLoaded', function (event) {
  console.log('DOM ready on find my brick page.');
  console.log('initializing virtual keyboard');

  KioskBoard.Init({
    /*!
     * Required
     * Have to define an Array of Objects for the custom keys. Hint: Each object creates a row element (HTML) on the keyboard.
     * e.g. [{"key":"value"}, {"key":"value"}] => [{"0":"A","1":"B","2":"C"}, {"0":"D","1":"E","2":"F"}]
     */
    keysArrayOfObjects: [
      {
        "0": "Q",
        "1": "W",
        "2": "E",
        "3": "R",
        "4": "T",
        "5": "Y",
        "6": "U",
        "7": "I",
        "8": "O",
        "9": "P"
      },
      {
        "0": "A",
        "1": "S",
        "2": "D",
        "3": "F",
        "4": "G",
        "5": "H",
        "6": "J",
        "7": "K",
        "8": "L"
      },
      {
        "0": "Z",
        "1": "X",
        "2": "C",
        "3": "V",
        "4": "B",
        "5": "N",
        "6": "M"
      }
    ],

    /*!
     * Required only if "keysArrayOfObjects" is "null".
     * The path of the "kioskboard-keys-${langugage}.json" file must be set to the "keysJsonUrl" option. (XMLHttpRequest to getting the keys from JSON file.)
     * e.g. '/Content/Plugins/KioskBoard/dist/kioskboard-keys-english.json'
     */
    keysJsonUrl: null,

    /*
     * Optional: (Special Characters Object)
     * Can override default special characters object with the new/custom one.
     * * e.g. {"key":"value", "key":"value", ...} => {"0":"#", "1":"$", "2":"%", "3":"+", "4":"-","5":"*"}
     */
    specialCharactersObject: null,

    // Optional: (Other Options)
    language: 'en', // Language Code (ISO 639-1) for custom keys (for language support) => e.g "en" || "tr" || "es" || "de" || "fr" etc.
    theme: 'light', // The theme of keyboard => "light" || "dark" || "flat" || "material" || "oldschool"
    capsLockActive: true, // Uppercase or lowercase to start. Uppercase when "true"
    allowRealKeyboard: true, // Allow or prevent real/physical keyboard usage. Prevented when "false"
    cssAnimations: true, // CSS animations for opening or closing the keyboard
    cssAnimationsDuration: 360, // CSS animations duration as millisecond
    cssAnimationsStyle: 'slide', // CSS animations style for opening or closing the keyboard => "slide" || "fade"
    keysAllowSpacebar: true, // Allow or deny Spacebar on the keyboard. The keyboard is denied when "false"
    keysSpacebarText: 'Space', // Text of the space key (spacebar). Without text => " "
    keysFontFamily: 'sans-serif', // Font family of the keys
    keysFontSize: '22px', // Font size of the
    keyskeysFontWeight: 'normal', // Font weight of the keys
    keysIconSize: '25px', // Size of the icon keys// v1.1.0 and the next versions
    allowMobileKeyboard: true, // Allow or prevent mobile keyboard usage. Prevented when "false"

    //v1 .3 .0 and the next versions
    autoScroll: true, // Scrolls the document to the top of the input/textarea element. The default value is "true" as before.Prevented when "false"
  });

  KioskBoard.Run('.js-kioskboard-input');
});

document.addEventListener('DOMContentLoaded', function (event) {
  console.log('setting up observer for watching when virtual keyboard is opened or closed...');
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      console.log('Looping through DOM mutations...');
      // Loop through any nodes that were added and look for the virtual keyboard
      mutation.addedNodes.forEach(function (addedNode) {
        console.log('Node added: ', addedNode);
        if (addedNode.id == 'KioskBoard-VirtualKeyboard') {
          console.log('Virtual keyboard has been added.');
          onVirtualKeyboardOpened();
        }
      });

      // Loop through any nodes that were removed and look for the virtual keyboard
      mutations.forEach(function (mutation) {
        mutation.removedNodes.forEach(function (removedNode) {
          console.log('Node removed: ', removedNode);
          if (removedNode.id == 'KioskBoard-VirtualKeyboard') {
            console.log('Virtual keyboard has been removed.');
            onVirtualKeyboardClosed();
          }
        });
      });
    });
  });

  // childList will listen for when HTML is added or removed
  // subTree means we will not just examine document.body, but also all of its subnodes
  observer.observe(document.body, { subtree: true, childList: true });
});