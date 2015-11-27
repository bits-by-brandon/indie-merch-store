$(document).ready(function () {

   var $checkoutBtn = $('#checkoutBtn');
   var $feature = $('.feature');
   var $featureBack = $('.featureBack');
   var $featureIcon = $('.featureIcon');
   var $albumWrapper = $('.albumWrapper');
   var $loginWindow = $('#loginWindow');
   var $menuIcon = $('#menuIcon');
   var $loadMore = $('.loadMore');
   var $loadMoreP = $('.loadMore p');
   var loadMore = '<div class="loadMore"><p>more<br><span>&#10095;</span></p><object class="loadIcon" data="images/logo_icon.svg" type="image/svg+xml"></object></div>';
   var loadScroll = 0;
   var catSelect = "shirts";
   var cart = [];
   var readyState = true;
   var confirmed = false;

   function storageClear(){
      sessionStorage.clear(); 
   }

   //storageClear();

   parallax();
   assignBox();
   loadCart();
   updateCart();
   updateBadge();
   refreshDelete();
   setQty();
   calculatePrices();


   $loginWindow.fadeOut(0);

   $(window).scroll(function(){
      parallax();

      //check if linfinite scroll is on page
      if($('.loadMore').length !== 0) {
         if($(window).scrollTop() == $(document).height() - $(window).innerHeight()){
            if (readyState === true){
               readyState = false;
               addBoxes(24);
            }
         }
         loadParallax();
      }
   });

   $(window).resize(function(){
      parallax();
   });

   $checkoutBtn.click(function(){
      $('.cartCheckout').toggleClass('up');
      $('.checkoutFullTotals').toggleClass('active');
      $('#shoppingCart').toggleClass('active');
      $('.checkoutForm').removeClass('active');
      $checkoutBtn.toggleClass('active');
      if ($checkoutBtn.html() == 'Checkout'){
         $('#checkoutConfirmBtn').addClass('active');
         $checkoutBtn.html('Edit Order');
      }else{
         $('#checkoutConfirmBtn').removeClass('active');
         $checkoutBtn.html('Checkout');
         confirmed = false;
      }
   });

   $('#checkoutConfirmBtn').click(function(){
      confirmed = true;
      $('.checkoutForm').addClass('active');
      $('#checkoutConfirmBtn').removeClass('active');
   });

   $('#login').click(function(){
      if ( $loginWindow.is(":visible") ){
         $loginWindow.removeClass('active');
         $('#login').removeClass('active');
         window.setTimeout(function(){
            $loginWindow.fadeOut(200);
         },300);
      } else {
         $loginWindow.fadeIn(0);
         $('#login').addClass('active');
         $loginWindow.addClass('active');
      }
   });

   function refreshDelete(){
      $('.delete').click(function(){
         var theCurrentItem = $(this).parent();
         removeCartItem(theCurrentItem);
         theCurrentItem.remove();
      });
   }

   $('.categories li').click(function(){
      $('.categories li').removeClass('active');
      $(this).addClass('active');
      var oldCat = catSelect;
      catSelect = $(this).find("a").html();
      if(oldCat != catSelect){
         $('.itemBox').fadeOut();
         addBoxes(12);
      }
   });

   $('#shop').click(function(){
      toggleCart();
   });

   $('.lightbox').click(function(){
      toggleCart();
   });

   function toggleCart(){
      $('body').toggleClass('noscroll');
      $('.lightbox').fadeToggle(300);
      $('#cart').toggleClass('active');
      $('.cartCheckout').toggleClass('active');
      if( confirmed === true ){ 
         $('.checkoutForm').toggleClass('active');
      }else{
         $('.checkoutForm').removeClass('active');
      }
      console.log('toggling #shop');

   }

   function setQty(){
      $('.cartItem .cartInfo .specs label input').change(function(){
         newQty = $(this).val();
         currItem = $(this).closest('.cartItem');
         currItem.type = $(currItem).data('type');
         currItem.id = $(currItem).data('id');

         console.log(currItem.id);
         console.log(cart);
         for(i = 0; i < cart.length; i++){
            if (cart[i].id == currItem.id){
               cart[i].quantity = newQty;
            }
         }
         saveCart();
         calculatePrices();

      });
   }

   function assignBox(){
      $('.detailBox').unbind('click');
      $('.detailBox').click(function(){
         addCart($(this).parent());
         console.log('assignBox');
      });
   }

   function removeCartItem(item){
      var itemType = item.data('type');
      var itemId = item.data('id');
      for(i = 0; i < cart.length; i++){
         if (cart[i].type == itemType && cart[i].id == itemId){
            cart.splice(i, 1);
         }
      }
      updateBadge();
      saveCart();
      calculatePrices();
   }

   function loadParallax(){
      loadScroll = ($(window).scrollTop() + $(window).innerHeight() ) - $loadMore.offset().top;
      $loadMoreP.css('transform',  'translateY('+ (loadScroll / 2) +'px)');
   }

   function parallax(){
      if ($feature.length > 0) {
         var viewableOffset = ($feature.offset().top - $(window).scrollTop())-70;
         $featureBack.css({
            'top': ((viewableOffset/ 3)* -1)
         });
         $featureIcon.css({
            'top': ((viewableOffset/ 4)* -1) + 300
         });
      }
   }

   $menuIcon.click(function(){
      open();
   });

   function open(){
      $("#ham-toggle").toggleClass('active');
      $("#sideNav").toggleClass('sideNavActive');
      $('#menuIcon').unbind('click');
      $('#menuIcon').click(function(){
         close();
      });
      $('body').css({
         'overflow': 'hidden' ,
      });
   }

   function close(){
      $("#ham-toggle").toggleClass('active');
      $("#sideNav").toggleClass('sideNavActive');
      $('#menuIcon').unbind('click');
      $('#menuIcon').click(function(){
         open();
      });
      $('body').css({
         'overflow': 'auto' ,
      });
   }

   function addCart(item){

      var inCart = false;

      var addedItem = {
         'type': item.data('type'),
         'id': item.data('id'),
         'quantity': 1,
      };

      for(i = 0; i < cart.length; i++){
         if(cart[i].type == addedItem.type && cart[i].id == addedItem.id){
            console.log('thats already in here!');
            inCart = true;
         }
      }

      if(inCart === false){
         cart.push(addedItem);
         addToCart(addedItem);
         updateBadge();
         saveCart();
      }
   }

   function updateBadge(){
      $('#badge').html(cart.length);
      if(cart.length > 0){
         $('#badge').css('opacity', 1);
      }else{
         $('#badge').css('opacity', 0);
      }
   }

   function saveCart(){
      sessionStorage.cart = JSON.stringify(cart);
   }

   function addToCart(item){

      console.log(item);

      var currentItem = data[item.type][item.id];

      var cartItem = '<div class="cartItem add height right" data-type='+ item.type +' data-id='+ item.id +'> <img src="'+ currentItem.image +'" alt="'+ currentItem.type +' "> <div class="cartInfo"> <h3>'+ currentItem.band +'</h3><p>'+ currentItem.name +'</p><div class="specs"><p>sm</p><p>male</p><label for="quantity">qty<input name="quantity" type="number" value="1"></label><h3 class="cartPrice green">$'+ currentItem.price +'</h3></div></div><span class="delete"></span></div>';

      console.log(cart);

      $('#cart').scrollTop(0).addClass('peek');

      $(cartItem).prependTo( $('#shoppingCart') );

      calculatePrices();

      window.setTimeout(function(){
         $('.cartItem').removeClass('height');
      },300);
      window.setTimeout(function(){
         $('.cartItem').removeClass('right');
      },600);
      window.setTimeout(function(){
         $('#cart').removeClass('peek');
      },1200);

      refreshDelete();
      setQty();
   }

   function calculatePrices(){
      var subTotal = 0;
      var discountTotal = 0;
      var tax = 0;
      var shipping = 8.99;
      var total = 0;

      for(i = 0; i < cart.length; i++){

         var currCart = data[cart[i].type][cart[i].id];                                     //currCart is set to the current cart item in the loop
         var currDiscount = 0;

         if( currCart.discount === false){                                                  //check database to see if cart item has a discount
            subTotal = subTotal + (currCart.price * cart[i].quantity);                     //if item no discount, set the subtotal
         }else{
            var discountText = currCart.discount;
            var discountOpPosition = discountText.search(/[\$\%]/);
            var discountOperation = discountText.substring(discountOpPosition, discountOpPosition + 1);
            if(discountOperation == '$'){

               currDiscount = parseInt( discountText.substring( 1, discountText.indexOf(' ') ), 10 );
               console.log('currDiscount= ' + currDiscount);

            }else if(discountOperation == '%'){

               currDiscount = currCart.price * 0.01 * (parseInt( discountText.substring( 0, discountText.indexOf('%') ), 10 ));
               console.log('currDiscount= ' + currDiscount);

            }else{
               console.log("error, discount not recognized");
            }
            console.log(discountOperation);
            discountTotal = discountTotal + (currDiscount * cart[i].quantity);
            subTotal = ( subTotal + ( currCart.price * cart[i].quantity ) - discountTotal );
         }

      }

      tax = ((subTotal + shipping) * 0.07);
      total = subTotal + shipping + tax;

      $('#discountTotal').html('$' + parseInt(discountTotal).toFixed(2));
      $('#checkoutSubTotal').html('$' + parseInt(subTotal).toFixed(2));
      $('#taxesTotal').html('$' + parseInt(tax).toFixed(2));
      $('#total').html('$' + parseInt(total).toFixed(2));
   }

   function updateCart(){
      cart.forEach(function(unit){

         var currentItem = data[unit.type][unit.id];
         var cartItem = '<div class="cartItem add" data-type='+ unit.type +' data-id='+ unit.id +'> <img src="'+ currentItem.image +'" alt="'+ currentItem.type +'"> <div class="cartInfo"> <h3>'+ currentItem.band +'</h3><p>'+ currentItem.name +'</p><div class="specs"><p>sm</p><p>male</p><label for="quantity">qty<input name="quantity" type="number" value="'+ unit.quantity +'"></label><h3 class="cartPrice green">$'+ currentItem.price +'</h3></div></div><span class="delete"></span></div>';

         $(cartItem).prependTo( $('#shoppingCart') );

      });
   }

   function loadCart(){
      if(sessionStorage.cart !== undefined){
         cart = JSON.parse(sessionStorage.cart);
      }        
   }

   function loadBox(){
      $(".loadMore p").addClass('active');
      $(".loadIcon").addClass('active');
   }

   function addBoxes (amount) {

      loadBox();

      window.setTimeout(function(){

         $(".loadMore").addClass('close');

         for (i=1; i<=amount; i++){
            var category = catSelect;
            var itemLength = data[category].length;
            var rand = Math.floor(Math.random() * itemLength);
            var item = "<div class='itemBox' data-type='"+category+"' data-id='"+rand+"'><div class='detailBox'><i class='fa fa-cart-plus fa-2x'></i></div><img src='"+ data[category][rand].image +"' alt='shirt'><div class='boxInfo'><p>"+ data[category][rand].band +"<br>"+ data[category][rand].name +"</p><p class='price'>$"+data[category][rand].price +"</p>";

            if(data[category][rand].discount === false){
               item += "</div></div>";
            }else{
               item += "<div class='discount'><p>" + data[category][rand].discount + "</p></div></div></a>";
            }

            $( item ).appendTo(".gridWrapper");
         }
         assignBox();
         window.setTimeout(function(){
            $(".loadMore").remove();
            $( loadMore ).appendTo(".gridWrapper");
               $loadMoreP = $(".loadMore p");
               $loadMore = $(".loadMore");
            readyState = true;
         },300);


      },2000);

   }
});
