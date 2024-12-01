const chosenBtn = document.querySelectorAll(".chosenBtn");

chosenBtn.forEach(book => {
    book.addEventListener('click', function (event) {
            
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

        const target = event.target.closest('img');
        if (!target) return;
        
        const bookId = book.dataset.id;

        if (target.classList.contains("offChosen")) {
            target.src = "/image/icon/inStar.png";
            target.classList.replace('offChosen', 'onChosen');

            postData("/getChosen/", { book_id: bookId }).then((data) => {
                console.log(data);
            }).catch((error) => {
                console.error(error);
                target.src = "/image/icon/unStar.png";
                target.classList.replace('onChosen', 'offChosen');
            });
        } else if (target.classList.contains("onChosen")) {
            target.src = "/image/icon/unStar.png";
            target.classList.replace('onChosen', 'offChosen');

            postData("/deleteChosen/", { book_id: bookId }).then((data) => {
                console.log(data);
            }).catch((error) => {
                console.error(error);
                target.src = "/image/icon/inStar.png";
                target.classList.replace('offChosen', 'onChosen');
            });
        }
    });
});

const chosenElements = document.querySelectorAll('.chosenChose');
chosenElements.forEach(chosenElement => {
    const onChosenBlock = chosenElement.querySelector('.onChosenBlock');
    const offChosenBlock = chosenElement.querySelector('.offChosenBlock');

    // if (onChosenBlock) {
    //     offChosenBlock.classList.add('none');
    // }
});
