/* global STORE, $, cuid, api */

'use strict';

const bookmarks = (function() {
  function renderBookmarkForm(){
    const form = `
            <form>
              <fieldset>
                <legend>Fill out the informaton and rating for the new bookmark</legend>
                <label for="bookmark-title">Bookmark name</label>
                <input type="text" name="Bookmark name" class='name-entry' id="bookmark-title" required><br />
        
                <label for="bookmark-url">URL</label>
                <input type="url" name="URL for bookmark" class='URL-entry' id="bookmark-url" required><br />
                
                <label for="bookmark-description">Description</label>
                <input type="text" name="Description" class='description-entry' id="bookmark-description" required><br>
                   
                    <div class="star-power">
                    <p><input type="radio" name="stars" value="5" id="5-stars"><label for="5-stars"> 5 stars</label></p>
                    <p><input type="radio" name="stars" value="4" id="4-stars"><label for="4-stars"> 4 stars</label></p>
                    <p><input type="radio" name="stars" value="3" id="3-stars"><label for="3-stars"> 3 stars</label></p>
                    <p><input type="radio" name="stars" value="2" id="2-stars"><label for="2-stars"> 2 stars</label></p>
                    <p><input type="radio" name="stars" value="1" id="1-stars"><label for="1-stars"> 1 star </label></p>
                    </div>
                    <button type="reset" class="clear-button">Clear</button>
                  <button type="submit" class="js-bookmark-submit">Submit</button>
              </fieldset>    
            </form>`;        
    if(STORE.displayBookmarkForm === true){
      $('.new-bookmark-form').html(form);
    }
    else{
      $('.new-bookmark-forms').html('');
    }
    
  }
  // });

  function captureBookmark() {
    $('.new-bookmark-form').on('submit','form',function(event) {
      event.preventDefault();
      
      
      console.log('add bookmark done');
      let bookmarkTitle = $('.name-entry').val();
      let urlTitle = $('.URL-entry').val();
      let description = $('.description-entry').val();
      
      let ratingNumber= event.currentTarget.stars.value;
      if(!ratingNumber){
        $('.error').text('You must select a rating');
        $('.error').toggleClass('hidden');
        event.preventDefault();
      } else if (!urlTitle){
        $('.error').text('Please type a valid url');
        $('.error').toggleClass('hidden');
        event.preventDefault();
      } else {
        $('.error').hide();
       
        console.log(bookmarkTitle, urlTitle, description, ratingNumber);
                      
        let displayedBookmarks={
          title: bookmarkTitle,
          url: urlTitle,
          desc: description,
          rating: ratingNumber,
          hiddenDescription: true
        };   
        $('.error').on('click', () =>{
          $('.error').toggleClass('hidden');
        });
        api.createBookmark(displayedBookmarks)
        
          .then(data => {
            console.log(data);
            STORE.bookmarkList.push(data);
            console.log(displayedBookmarks);
            renderBookmarkList();
                
          })
          .catch(err => {
            $('.error').text(err.message);
            $('.error').toggleClass('hidden');
          });
      }
    } 
        
    );}

      
      


  function testClick() {
    $('#click').on('click',  function() {
      console.log('clicked');
      $('h4').toggle();
    });
  }


  function renderBookmark(bookmark){
    
  
    if (!bookmark.hiddenDescription){
      return `<li class='new-bookmark' id="${bookmark.id}">
        <p><button class="expand-button" type="button">Expand</button>
        <button class="delete-button" type="button">Delete</button></p><br>
        <h3>Title: ${bookmark.title} <br>
        Rating: ${bookmark.rating} <br></h3>
        </li>`;
    } else {
      console.log(bookmark.hiddenDescription);
      return `<li class='new-bookmark' id="${bookmark.id}">
      <p><button class="expand-button" type="button">Expand</button>
      <button class="delete-button" type="button">Delete</button></p><br>
      <h3>Title: ${bookmark.title} <br>
      Rating: ${bookmark.rating} <br>
      Description: ${bookmark.desc}<br>
      URL: <a href="https://${bookmark.url}">Visit Site</a></h3>
       </li>`;
    }
    
  }

  function handleFilter(){
    $('.stars-options').on('change', function(){
      console.log('filter happening on dropdown');
      STORE.filterValue= $(this).val();
      console.log(STORE.filterValue);
      bookmarks.renderBookmarkList();
    });
  }  

  function renderBookmarkList(){
    console.log('renderbookmarkList is running');
    let items= STORE.bookmarkList;
    console.log(STORE.filterValue);
    if(STORE.filterValue > 0){
        
      items = STORE.bookmarkList.filter(bookmark => bookmark.rating >= STORE.filterValue);
    }

    const displayList= 
    ` <ul class="bookmark-item">
    ${items.map( bookmark => {
    console.log(bookmark);
    return  renderBookmark(bookmark);})}
    </ul>`; 
              
    $('.js-bookmark-list').html(displayList);

    newExpandBookmark();
    handleDeleteBookmark();
  }
        
        
  function handleAddBookmarkClick(){
    console.log(this);
    $('.add-bookmark').on('click', function(){
      console.log('add bookmark clicked');
      STORE.displayBookmarkForm = !STORE.displayBookmarkForm;
      console.log(this);
      renderBookmarkForm();
    });
  }
        

  function toggleHiddenDescription(){
    
    if (STORE.hideDescription === true){
      $('#full-description').addClass('.hidden');
      console.log('remove class works');
    }
  }
        
        
  function handleDeleteBookmark() {
    $('.delete-button').on('click', function(event){
      console.log('delete button clicked');
      event.preventDefault();
      const id =$(event.currentTarget).closest('li').attr('id');
      console.log(id);
   
      api.deleteItem(id)
        
        .then(data => {
          STORE.bookmarkList = STORE.bookmarkList.filter((bookmark)=> bookmark.id !== id);
          renderBookmarkList();});
    });
  }

  function newExpandBookmark(){

    $('li').on('click', '.expand-button', function(event){
      const id =  $(event.currentTarget).closest('li').attr('id');
      let fullBookmark = STORE.findByID(id);
      fullBookmark.hiddenDescription = !fullBookmark.hiddenDescription;
      console.log(fullBookmark);
      console.log(fullBookmark.hiddenDescription);
      event.preventDefault();            
      console.log('expand button works');
      toggleHiddenDescription();
      renderBookmarkList();
      
    });
  }
      
        
  function render() {
    //This function will save to our store and server and generates bookmark page.
    console.log('render ran');
    
  }      

  function bindEventListeners(){
    handleDeleteBookmark();
    handleAddBookmarkClick();
    handleFilter();
    
    captureBookmark();
    newExpandBookmark();
    testClick();
  }

  return{

    renderBookmark,
    renderBookmarkForm,
    renderBookmarkList,
    bindEventListeners,
    toggleHiddenDescription,
    
    render,
  };

})();
