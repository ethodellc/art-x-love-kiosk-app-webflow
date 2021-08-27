function onSearchTermEntered(searchTerm) {
  console.log('Search term entered: ' + searchTerm);
  let listItemElements = document.querySelectorAll('.brick-container .brick-owner');
  console.log(listItemElements);

  listItemElements.forEach(function (element) {
    if (element.innerText.toLowerCase().includes(searchTerm.toLowerCase())) {
      console.log('Brick match found: ' + element.innerText);
      element.closest('.brick-list-item').style.display = "block";
    } else {
      element.closest('.brick-list-item').style.display = "none";
    }
  });
}

function onVirtualKeyboardClosed() {
  console.log('Keyboard closed.  Search input element: ', searchInputElement);
  console.log('Search input value: ', searchInputElement.value);
  let searchInputElement = document.getElementById('Search');
  onSearchTermEntered(searchInputElement.value);
}

document.addEventListener('DOMContentLoaded', function (e) {
  let searchInputElement = document.getElementById('search');

  searchInputElement.addEventListener('keyup', function (e) {
    onSearchTermEntered(e.target.value)
  });
});

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
  console.log('setting up observer for watching when virtual keyboard is removed');
  const observer = new MutationObserver(function (mutations_list) {
    mutations_list.forEach(function (mutation) {
      mutation.removedNodes.forEach(function (removed_node) {
        console.log('Node removed: ', removed_node);
        if (removed_node.id == 'KioskBoard-VirtualKeyboard') {
          console.log('Virtual Keyboard has been removed');
          observer.disconnect();
        }
      });
    });
  });

  observer.observe(document.body, { subtree: false, childList: true });
});