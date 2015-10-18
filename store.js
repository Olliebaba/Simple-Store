
// places cursor at end of input/contenteditable element
function placeCaretAtEnd(el) {
  el.focus();
  if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
    var range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  } else if (typeof document.body.createTextRange != "undefined") {
    var textRange = document.body.createTextRange();
    textRange.moveToElementText(el);
    textRange.collapse(false);
    textRange.select();
  }
}

$('.store-product').on('click', function() {
  if ($(this).html() != $('.selected').html() ) {
    $('.selected').removeClass('selected').removeClass('valError');
    $(this).addClass('selected');
  }
  
});

// only allows 'data-maxlength' number of chars on contenteditable box
// also strips any non-integer values
$('.store-product [contenteditable="true"]').on('keyup', function(e) {
  var maxLength = $(this).attr('data-maxlength');

  //strips all but integers
  if ($(this).html().replace(/\d+/g, "").length > 0) {
    $(this).html($(this).html().replace(/\D+/g, ""));
    placeCaretAtEnd($(this)[0]);
  }
  // deletes nums that exceed data-maxlength
  if ($(this).html().length > maxLength) {
    $(this).html($(this).html().substring(0, maxLength));
    placeCaretAtEnd($(this)[0]);
  }
});

// Add to cart handler
$('.buy').on('click', function() {
  var myGC = $(this).attr('data-gc');
  var myVal = $('[class="' + myGC + '"]').html();
  // strips 0 if is at beginning
  if (myVal.substring(0, 1) == '0') {
    if (myVal.length == 2) {
      myVal = myVal.slice(1);
    } else if (myVal.length > 2) {
      myVal = myVal.slice(1, -1);
    }
    $('[class="' + myGC + '"]').html(myVal);
  }
  // error if value isn't greater than 1 or contains non-integers
  if (myVal < 1 || myVal.replace(/\d+/g, "").length > 0) {
    $(this).parents('.store-product').addClass('valError');
  } else if (myVal > 0 && $(this).parents('.store-product').hasClass('valError')) {
    $(this).parents('.store-product').removeClass('valError');
  }
  // adds value to associated cart element
  if (myVal > 0) {
    // detect if we're showing the corresponding <li> already
    if (!$('input[name="' + myGC + '"]').parents('li').hasClass('hasValue')) {
        var cartContainerHeight = $('#cartContainer div').height();
        var inputRowHeight = $('input[name="' + myGC + '"]').parents('div').height();
      // if we're in mobile view, adjust cart height this way
      if (mobileView()) {
        // - 15 on line below accomodates for issue with absolutely positioned pseudo elemtent on cart heading
        var hasContentsDifference;
        if (!$('#cartContainer').hasClass('hasContents')) hasContentsDifference = 15;
        
        var newMobileHeight = cartContainerHeight + inputRowHeight - hasContentsDifference;
        $('#cartContainer').attr('data-height' , (newMobileHeight + "px")).height(newMobileHeight);
      // otherwise handle it this way  
      } else {
        console.log('not mobile view');
        var cartContentsHeight = inputRowHeight + $('.cartContents > div').height();
        if (cartContentsHeight > cartContainerHeight) {
          $('#cartContainer').attr('data-height' , (cartContentsHeight + "px")).height(cartContentsHeight);
        }
      }
      $('input[name="' + myGC + '"]').parents('li').addClass('hasValue');
    }
    // assign value to iput field
    $('input[name="' + myGC + '"]').val(myVal);
    // if cart doesn't yet have items, add .hasContents
    if (!$('#cartContainer').hasClass('hasContents')) $('#cartContainer').addClass('hasContents');
    // opens cart if it's closed
    if ($('#cartContainer').hasClass('close')) $('[data-trigger="#cartContainer"]').click();
  }
});

// makes the 'view cart' buttons trigger the accordion element.
$('.cart').on('click', function() {
  $('[data-trigger="#cartContainer"]').click()
});

// removes value from input field as well as from contenteditable div
// checks to see if any other inputs have value, if not, shows 'no cart contents' message
$('[data-remove]').on('click', function() {
  var myGC = $(this).attr('data-remove');
  $('[class="' + myGC + '"]').html('0');
  $('input[name="' + myGC + '"]').val('');
  
  var cartContainerHeight = $('#cartContainer > div').height();
  var inputRowHeight = $('input[name="' + myGC + '"]').parents('div').height();
  // if in mobile view adjust container height this way
  if (mobileView()) {
    // the + 15 on the code below
    // fixes issue with absolutely positioned pseudo element
    // - 15 on line below accomodates for issue with absolutely positioned pseudo elemtent on cart heading
    var hasContentsDifference;
    if ($('.hasValue').length == 1) hasContentsDifference = 15;
        
     var newMobileHeight = cartContainerHeight - inputRowHeight + hasContentsDifference;
     $('#cartContainer').attr('data-height' , (newMobileHeight + "px")).height(newMobileHeight);
  // otherwise adjust height this way
  } else {
    var customerInfoHeight = $('#customerInfo > div').height();
     var cartContentsHeight = $('.cartContents > div').height() - inputRowHeight; // RECOFIGURE
    // shink the container's data-height/height if removing the <li>
    // make it appropriate
    if (cartContentsHeight > customerInfoHeight) {
      $('#cartContainer').attr('data-height' , (customerInfoHeight + "px")).height(customerInfoHeight);
    } 
  }
  $(this).parents('li').removeClass('hasValue');
  if ($('.cartContents li.hasValue').length == 0) {
    $('#cartContainer').removeClass('hasContents');
  }
});

$('.closer').on('click', function(e) {
  if (!$('#cartContainer').hasClass('close')) {
    $('#cartContainer').height('');
  } else {
    $('#cartContainer').height($('#cartContainer').attr('data-height'));
  }
  $('#cartContainer').toggleClass('close');
});

function setDataHeight() {
  $('#cartContainer').height('auto').each(function() {
    $('#cartContainer').attr('data-height', $('#cartContainer').height());
  }).height(''); 
};
setDataHeight();


var mobileView = function (){
  var result;
  (!$('[data-trigger="#cartContainer"]').is(':visible')) ? result = true : result = false ;
  return result;
};

