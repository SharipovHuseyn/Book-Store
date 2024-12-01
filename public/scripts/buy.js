const buyBook = document.querySelector('.buyBook')

let countBuy = 0

buyBook.addEventListener('click', function (event){
  const target = event.target

  if(target.className == 'book-buy-button'){
    countBuy += 1
  }

  if(countBuy === 1){
    basketBag.forEach( item=>{

      postData("/purchases/", { book_id:  item.dataset.id}).then(
        (data) => {
          console.log(data);
        }
      );
      
    })
  }
})