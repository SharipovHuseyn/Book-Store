const profil = document.querySelector('.profil')
const controlProfil = document.querySelector('.controlProfil')
const hiddenBlock = document.querySelector('.hiddenBlock')
const headerItem = document.querySelectorAll('.header-item')
const headerItems = document.querySelector('.header-items')
const url = new URL(window.location.href);

let count = 0

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

controlProfil.addEventListener('click', function(event){
    const target = event.target

    if(target.className == 'WellcomeUser'){
        console.log('hallo')
    }
    if(target.className == 'profil'){
        count += 1
    }

    if(count % 2 == 1){
        hiddenBlock.classList.remove('none')
    }else if(count % 2 == 0){
        hiddenBlock.classList.add('none')
    }

    if(target.id == 'exit'){
        postData("/exit/").then((data) => {
            console.log(data);
        });
    }
})

console.log(url.pathname.replace(/[\/%:\\]/g, ''))

for(let i = 0; i < headerItem.length; i++){
  switch(url.pathname.replace(/[\/%:\\]/g, '')){
    case '':
      headerItem[0].classList.add('colorBlue')
      break;
    case 'category':
      headerItem[1].classList.add('colorBlue')
      break;
    case 'about':
      headerItem[2].classList.add('colorBlue')
      break;
    case 'chosen':
      headerItem[3].classList.add('colorBlue')
      break;
    case 'basket':
      headerItem[4].classList.add('colorBlue')
      break;
    case 'buy':
      headerItem[5].classList.add('colorBlue')
      break;
  }
} 