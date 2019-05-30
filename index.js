
'use strict';

/* global $, bookmarks, cuid, api, STORE */











// function error() {
//   //This function will handle all errors with our bookmarks.
//   if (items) {
//     generateErrorMessage(message);
//   }

// }

// function generateErrorMessage(message) {
//   return `
//      <section class="error-content">
//        <button id="cancel-error">X</button>
//        <p>${message}</p>
//      </section>
//    `;
// }




function main() {

  api.getBookmarks()
    
    .then(data => {
      console.log(data);
      STORE.bookmarkList = data;
      bookmarks.renderBookmarkList();  
    }); 
  
  bookmarks.bindEventListeners();
   
}

$(main);

