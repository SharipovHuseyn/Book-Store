const updateData = document.querySelectorAll('.updateData')
const myDataInput = document.querySelector('.myDataInput')
const dataBlock = document.querySelector('.dataBlock')
const profilBookCart = document.querySelectorAll('.profilBookCart')

const postData = async (url = "", data = {}) => {
    const params = new URLSearchParams();
    for (const key in data) {
        params.append(key, data[key]);
    }
  
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
    });
  
    return response.json();
};

for(let i = 0; i < updateData.length; i++){
    let count = 0

    updateData[i].addEventListener('click', function(event){
        const target = event.target
        

        if(target.className == 'updateImgProfil'){
            count += 1
        }

        if(count % 2 == 1){
            updateData[i].querySelector('.myDataInput').classList.remove('none')
            updateData[i].querySelector('.myDataHeader').classList.add('none')
        }else if(count % 2 == 0){
            updateData[i].querySelector('.myDataInput').classList.add('none')
            updateData[i].querySelector('.myDataHeader').classList.remove('none')
            updateData[i].querySelector('.headData').textContent = updateData[i].querySelector('.myDataInput').value
        }

    })
}

let countBtn = 0

dataBlock.addEventListener('click', function(event){
    const target = event.target

    if(target.className == 'book-buy-button'){

        let name = dataBlock.querySelector('#name').value
        let age = dataBlock.querySelector('#age').value
        let fast_name = dataBlock.querySelector('#fast_name').value
        let mail = dataBlock.querySelector('#mail').value

        postData("/profilUpdate/", { name: name, age: age, mail: mail, fast_name: fast_name }).then(
            (data) => {
              console.log(data);
            }
        ); 
        setTimeout(()=>{
            location.reload()
        }, 30)
    }  
})

for(let n = 0; n < profilBookCart.length; n++){
    profilBookCart[n].addEventListener('click', function(event){
        const target = event.target
        
        if(target.className == 'book-buy-button'){

            let book_header = profilBookCart[n].querySelector('#book_header').value
            let book_price = profilBookCart[n].querySelector('#book_price').value
            let book_id = profilBookCart[n].dataset.id
            console.log(book_id)

            postData("/bookUpdate/", {book_header: book_header, book_price: book_price, book_id: book_id }).then(
                (data) => {
                  console.log(data);
                }
            ); 
            setTimeout(()=>{
                location.reload()
            }, 30)
        }
    })
}