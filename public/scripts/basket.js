const book = document.querySelectorAll(".basketBtn");
const basketButton = document.querySelectorAll(".basketButton");
const basketBag = document.querySelectorAll(".basketBag");
const basketBags = document.querySelector(".basketBags");
let resultPrice = document.querySelector(".resultPrice")

for (let i = 0; i < book.length; i++) {
  book[i].addEventListener("click", function (event) {
    const target = event.target;
    let count = 0;

    if (target.className == "book-buy-button") {
      count += 1;
    }

    if (count === 1) {
      book[i].querySelector(".book-buy-button").disabled = true;
      book[i].querySelector(".book-buy-button").textContent = "В корзине";
      book[i].querySelector(".book-buy-button").classList.add("onBasket");

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

      postData("/basket/", { book_id: book[i].dataset.id }).then((data) => {
        console.log(data);
      });
    }
  });
}

let price = 0

for (let j = 0; j < basketBag.length; j++) {

  let count = Math.floor(basketBag[j].querySelector(".countBookValue").textContent);
  price += count * Math.floor(basketBag[j].querySelector(".priceB").textContent)

  basketBag[j].addEventListener("click", function (event) {
    const target = event.target;
    let noneBlock = false

    if (target.className == "minusCount") {
      if (count == "1") {
        noneBlock = true
        price -= Math.floor(basketBag[j].querySelector(".priceB").textContent)
        resultPrice.textContent = price
      } else {
        count -= 1;
        price -= Math.floor(basketBag[j].querySelector(".priceB").textContent)
        resultPrice.textContent = price
      }
    } 

    if (target.className == "plusCount") {
      if (count < 10) {
        count += 1;
        noneBlock = false
        price += Math.floor(basketBag[j].querySelector(".priceB").textContent)
        resultPrice.textContent = price
      } else {
        count = count;
        resultPrice.textContent = price
      }
    }

    if (target.className == "close") {
      noneBlock = true
    }

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

    postData("/UpdateBasketBook/", { book_id: basketBag[j].dataset.id, countBook: count }).then((data) => {
      console.log(data);
    });

    if (noneBlock == true) {
      basketBag[j].className = "none"

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

      postData("/basketDelete/", { deleid: basketBag[j].dataset.id }).then(
        (data) => {
          console.log(data);
        }
      );
    }

    basketBag[j].querySelector(".countBookValue").textContent = count;
  });
  resultPrice.textContent = price

}
