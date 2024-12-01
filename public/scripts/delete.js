const productsBlock = document.querySelectorAll('.productsBlock')
const productBlock = document.querySelectorAll('.productBlock')

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

for(let i = 0; i < productBlock.length; i++){
    let count = 0
    productBlock[i].addEventListener('click', function(event){
        const target = event.target

        if(target.className == 'delete-book-button'){
            count += 1
        }
        
        if(count === 1){
            productBlock[i].classList.add('none')
            console.log(productBlock[i].dataset.id)
            postData("/deleteBook/", { book_id: productBlock[i].dataset.id }).then(
                (data) => {
                  console.log(data);
                }
            );
        }
    })

}