/*!
 * Interaction for online textbook.
 * by Juan Carlos Ponce Campuzano 7/Feb/2024
 * Updated: 22/Feb/2024
 * License: CC BY-NC-SA 4.0 DEED
 * Attribution-NonCommercial-ShareAlike 4.0 International
 * https://creativecommons.org/licenses/by-nc-sa/4.0/?ref=chooser-v1
*/

/*
 Content:
 * - Dark mode
 * - Modal
 * - Include HTML
 * - Scroll up to "id" tags for hyperlinks
 * - To top button
 * - Navigation bar interaction
*/

/*---------------------------------------------------------------*/
/* Dark mode function */
const darkModeToggle = document.getElementById('dark-mode-toggle')
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('latex-dark');
});

/*
let darkModeIcon = document.getElementById("dark-mode-toggle");
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.body.classList.add('latex-dark');
  darkModeIcon.innerHTML = '<i class="fa-solid fa-moon"></i>';
} else {
  darkModeIcon.innerHTML = '<i class="fa-regular fa-sun"></i>';
}*/

// Function to replace text for Dark mode
function toggleMode() {
  // Get the element containing the text
  var element = document.getElementById("dark-mode-toggle");

  // Toggle between "text01" and "text02"
  if (element.innerHTML.trim() === '<i class="fa-solid fa-moon"></i>') {
    element.innerHTML = '<i class="fa-regular fa-sun"></i>';
    localStorage.setItem('mode', 'light');
  } else {
    element.innerHTML = '<i class="fa-solid fa-moon"></i>';
    localStorage.setItem('mode', 'dark');
  }
}

// Function to load mode from local storage
function loadMode() {
  var element = document.getElementById("dark-mode-toggle");
  var mode = localStorage.getItem('mode');

  if (mode === 'light') {
    element.innerHTML = '<i class="fa-regular fa-sun"></i>';
  } else if (mode == 'dark') {
    element.innerHTML = '<i class="fa-solid fa-moon"></i>';
    document.body.classList.add('latex-dark');
  } else {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.body.classList.add('latex-dark');
      element.innerHTML = '<i class="fa-solid fa-moon"></i>';
    } else {
      element.innerHTML = '<i class="fa-regular fa-sun"></i>';
    }
  }
}

// Add event listener for mouse click
document.getElementById("dark-mode-toggle").addEventListener("click", toggleMode);

// Load the mode when the page loads
window.onload = loadMode;

/*---------------------------------------------------------------*/


/*---------------------------------------------------------------*/
/* The following is to scroll up to the "id" tag for hyperlinks */
// Function to handle smooth scrolling with offset

function scrollToElementWithOffset(selector, offset) {
  var target = document.querySelector(selector);
  if (target) {
    var targetPosition = target.getBoundingClientRect().top + window.scrollY - offset; // pageYOffset is deprecated :(
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
}

// Adding event listeners to all links with the class 'scroll-link'
var links = document.querySelectorAll('a[href^="#"]');
links.forEach(function (link) {
  link.addEventListener('click', function (event) {
    event.preventDefault();
    var targetId = this.getAttribute('href');
    scrollToElementWithOffset(targetId, 50); // 50px offset, I want it below the navbar
  });
});

/*---------------------------------------------------------------*/


/*---------------------------------------------------------------*/
/* Button to the top */
// Get the button

let mybutton = document.getElementById("toTop");
//let prevScrollpos = window.scrollY;

window.onscroll = function () { scrollFunction() };

// When the user scrolls down 500px from the top of the document, show the button
function scrollFunction() {
  //let currentScrollPos = window.scrollY;
  //if (prevScrollpos > currentScrollPos) {
  mybutton.style.display = "none";
  //} else {
  if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
    mybutton.style.display = "block";
  }
  //}
  //prevScrollpos = currentScrollPos;
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  let tocLinks = document.querySelectorAll('.toc-chapter a');
  tocLinks.forEach((link) => {
    //link.classList.remove('active');
    link.classList.remove('highlight');
  });
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

/*---------------------------------------------------------------*/


/*---------------------------------------------------------------*/
/* Interaction with the fixed navbar on the top */
/* left-link right-link */
const leftLink = document.getElementById('prev-link');
const rightLink = document.getElementById('next-link');
const centerLink = document.getElementById('center-link');

// Function to handle hover events for links
function handleLinkHover(event, originalSelector, hoverSelector) {
  // Find the original and hover content elements
  const contentOriginal = centerLink.querySelector(originalSelector);
  const contentHover = centerLink.querySelector(hoverSelector);

  // Check if the content elements exist before manipulating them
  if (contentOriginal && contentHover) {
    // Toggle display based on event type 
    if (event.type === 'mouseenter') {
      contentOriginal.style.display = 'none';
      contentHover.style.display = 'inline';
    } else if (event.type === 'mouseleave') {
      contentOriginal.style.display = 'inline';
      contentHover.style.display = 'none';
    }
  }
}

// Add event listeners only if the elements exist
if (leftLink) {
  leftLink.addEventListener('mouseenter', (event) => {
    handleLinkHover(event, '.content-original', '.content-hover-previous');
  });

  leftLink.addEventListener('mouseleave', (event) => {
    handleLinkHover(event, '.content-original', '.content-hover-previous');
  });
}

if (rightLink) {
  rightLink.addEventListener('mouseenter', (event) => {
    handleLinkHover(event, '.content-original', '.content-hover-next');
  });

  rightLink.addEventListener('mouseleave', (event) => {
    handleLinkHover(event, '.content-original', '.content-hover-next');
  });
}

if (centerLink) {
  centerLink.addEventListener('mouseenter', (event) => {
    // When hovering on center link, show general hover content 
    handleLinkHover(event, '.content-original', '.content-hover');
  });

  centerLink.addEventListener('mouseleave', (event) => {
    // When leaving center link, show original content 
    handleLinkHover(event, '.content-original', '.content-hover');
  });
}

/*---------------------------------------------------------------*/


/*---------------------------------------------------------------*/
// Toc for each chapter

window.addEventListener('scroll', function () {
  let sections = document.querySelectorAll('div[id^="section"]');
  let tocLinks = document.querySelectorAll('.toc-chapter a');
  let scrollPosition = window.scrollY;

  sections.forEach((section, index) => {
    let sectionTop = section.offsetTop - 100; // Adjust as needed
    let sectionBottom = sectionTop + section.clientHeight;

    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
      tocLinks.forEach((link) => {
        //link.classList.remove('active');
        link.classList.remove('highlight');
      });
      //tocLinks[index].classList.add('active');
      tocLinks[index].classList.add('highlight');
    }
  });
});

/*---------------------------------------------------------------*/


/*---------------------------------------------------------------*/
/* 
 I need the following code to show 
 modal for the "support message"
*/
// Get the modal
let modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
//btn.onclick = function() {
//  modal.style.display = "block";
//}

function showMessage() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
  clearInterval(myInterval);
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
    clearInterval(myInterval);
  }

}

let myInterval = setInterval(function () {
  showMessage();
}, 60000);
// 3000 3 seconds
// 8000 8 seconds
// 30000 30 seconds
// 60000 1 min
// 120000 2 min
// 300000 5 mins
// 600000 10 mins
// 1200000 20 mins
// 1800000 30 mins

/*---------------------------------------------------------------*/


/*--------------- Stop scrolling on iframes ---------------------*/
var iframeContainers = document.querySelectorAll('.iframeContainer');

// Add event listeners for mouse entering and leaving each iframe
iframeContainers.forEach(function (container) {
  container.addEventListener('mouseenter', function () {
    // Hide overflow of the body when mouse enters iframe area
    document.body.style.overflow = 'hidden';
  });

  container.addEventListener('mouseleave', function () {
    // Show overflow of the body when mouse leaves iframe area
    document.body.style.overflow = 'auto';
  });
});
/*---------------------------------------------------------------*/


/*---------------------------------------------------------------*/
/* 
  The follwing function is to include an HTML file in the slides
  Source: https://www.w3schools.com/howto/howto_html_include.asp
*/
function includeHTML() {
  let z, i, elmnt, file, xhttp;
  /*loop through a collection of all HTML elements:*/
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /*make an HTTP request using the attribute value as the file name:*/
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            elmnt.innerHTML = this.responseText;
          }
          if (this.status == 404) {
            elmnt.innerHTML = "Page not found.";
          }
          /*remove the attribute, and call this function once more:*/
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      /*exit the function:*/
      return;
    }
  }
};

// Finally call this funciton to include HTML
includeHTML();

/*---------------------------------------------------------------*/