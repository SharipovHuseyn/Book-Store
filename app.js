const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const ejs = require("ejs");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");

const PORT = 1000;
let app = express();
app.use(cookieParser("secret"));
app.set("view engine", "ejs");
let urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(express.static("public"));

console.log("Сервер запушенно!");

const connection = mysql.createConnection({
  host: "localhost", // адрес хоста MySQL сервера
  user: "root", // имя пользователя MySQL
  password: "root", // пароль пользователя MySQL
  database: "librery", // имя базы данных MySQL
  port: 8889, //Порт
});

app.post('/exit', (req, res)=>{
  console.log('exit user')

  res.clearCookie('id')

  res.send('Cookie cleared');
})

app.get("/", urlencodedParser, (req, res) => {
  console.log("Home page");

  const user_id = {
    id: req.cookies.id,
  };

  if(!req.cookies.id){
    res.redirect('http://localhost:1000/chose')
  }

  let book;
  let basketBooks;
  let chosenBook;

  connection.query(
    `SELECT * FROM basket WHERE user_id = ${user_id.id}`,
    (err, result) => {
      if (err) {
        console.error("Ошибка при выполнении запроса: ", err);
      } else {
        console.log("Данные успешно найден!");
        basketBooks = result;
      }
    }
  );

  connection.query("SELECT * FROM `books`", (err, result) => {
    if (err) {
      console.error("Ошибка при выполнении запроса: ", err);
    } else {
      console.log("Данные успешно найден!");
      book = result;
    }
  });

  connection.query(
    `SELECT * FROM chosen WHERE user_id = '${user_id.id}'`,
    (err, result) => {
      if (err) console.error("Ошибка при выполнении запроса: ", err);

      chosenBook = result;
    }
  );

  connection.query("SELECT * FROM `users` WHERE ?", user_id, (err, result) => {
    if (err) {
      console.error("Ошибка при выполнении запроса: ", err);
    } else {
      console.log("Данные успешно найден!");
      result.forEach((item) => {
        res.render("pages/home", {
          data: item,
          profilName: item.name,
          book: book,
          basketBooks: basketBooks,
          chosenBook: chosenBook,
        });
      });
    }
  });
});

app.get("/reg", (req, res) => {
  console.log("Reg page");
  res.render("pages/reg");
});

app.get('/chose', (req, res)=>{
  console.log('chose page')
  res.render('pages/chose')
})

app.post("/reg", urlencodedParser, (req, res) => {
  const reg = {
    name: req.body.user_name,
    fast_name: req.body.user_fast_name,
    mail: req.body.user_mail,
    password: req.body.user_pass,
    age: req.body.user_age,
  };

  connection.query("INSERT INTO users SET ?", reg, (err, result) => {
    if (err) {
      console.error("Ошибка при выполнении запроса: ", err);
    } else {
      console.log("Данные успешно добавлены");
    }
  });

  connection.query(
    `SELECT * FROM users WHERE name = '${reg.name}' AND mail = '${reg.mail}' AND fast_name = '${reg.fast_name}' AND password = '${reg.password}' AND age = '${reg.age}'`,
    (err, result) => {
      if (err) {
        console.error("Ошибка при выполнении запроса: ", err);
      } else {
        console.log("Данные успешно найден!");

        result.forEach((item) => {
          console.log(item.id);
          res.cookie("id", item.id);
        });
      }
      res.redirect("http://localhost:1000/");
    }
  );
});

app.get("/auth", (req, res) => {
  console.log("Auth page");
  res.render("pages/auth");
});

app.post("/auth", urlencodedParser, (req, res) => {
  console.log("Post auth");

  const user = {
    mail: req.body.user_mail,
    password: req.body.user_pass,
  };

  connection.query(
    `SELECT * FROM users WHERE mail = '${user.mail}' AND password = '${user.password}'`,
    user,
    (err, result) => {
      if (err) {
        console.log("Ошибка при выполнения запроса: ", err);
      } else {
        console.log("Данные успешно найдени!");

        result.forEach((item) => {
          console.log(item.id);
          res.cookie("id", item.id);
        });
      }

      res.redirect("http://localhost:1000/");
    }
  );
});

app.get("/basket", (req, res) => {
  console.log("basket page");
  let bookHP;
  let chosenBook;
  const user_id = {
    id: req.cookies.id,
  };

  let basket;
  let basketBookId = [];
  let basketResult = [];
  let bookAuthor = [];  
  let authorBook = [];

  if(!req.cookies.id){
    res.redirect('http://localhost:1000/chose')
  }

  connection.query(
    `SELECT * FROM basket WHERE user_id = '${user_id.id}'`,
    (err, result) => {
      if (err) {
        console.log("Ошибка в запросе: ", err);
      }
      console.log("Данние успешно найдени!!!");
      basket = result;

      for (let h = 0; h < basket.length; h++) {
        basketBookId.push(basket[h].book_id)
        
        connection.query(
          `SELECT * FROM books WHERE id = '${basketBookId[h]}' `,
          (err, result) => {
            if (err) {
              console.error("Ошибка при выполнении запроса: ", err);
            }
            console.log("Книги найдени на карзине");
            let bo = []
            result.forEach((item) => {
                basketResult.push(item);
                bookAuthor.push(item.author)
            });
          }
        );
          setTimeout(()=>{
            connection.query(
                `SELECT * FROM users WHERE id = '${bookAuthor[h]}'`,
                (err, result) => {
                    if (err) {
                    console.error("Ошибка при выполнении запроса: ", err);
                    }
                    result.forEach((item) => {
                        authorBook.push(item.name)
                    });
                }
            );
          }, 50)


        connection.query(
          `SELECT * FROM chosen WHERE user_id = '${user_id.id}'`,
          (err, result) => {
            if (err) console.error("Ошибка при выполнении запроса: ", err);

            chosenBook = result;
          }
        )
      }
    }
  );

  setTimeout(() => {
    connection.query(
      "SELECT * FROM `users` WHERE ?",
      user_id,
      (err, result) => {
        if (err) {
          console.error("Ошибка при выполнении запроса: ", err);
        } else {
          console.log("Данные успешно найден!");
          result.forEach((item) => {
            console.log(authorBook)
            res.render("pages/basket", {
              data: item,
              profilName: item.name,
              basketResult: basketResult,
              chosenBook: chosenBook,
              basket: basket,
              authorBook: authorBook,
            });
          });
        }
      }
    );
  }, 100);
});

app.post("/basket", urlencodedParser, (req, res) => {
  const data = {
    book_id: Math.floor(req.body.book_id),
    user_id: Math.floor(req.cookies.id),
    countBook: 1,
  };

  connection.query("INSERT INTO `basket` SET ?", data, (err, result) => {
    if (err) {
      console.log("Ошибка в запросе: ", err);
    }
  });
});

app.get("/buy", (req, res) => {
  console.log("Buy page");

  const user_id = {
    id: req.cookies.id,
  };

  if(!req.cookies.id){
    res.redirect('http://localhost:1000/chose')
  }

  let purchasesBook

  connection.query(`SELECT * FROM purchases WHERE user_id = '${user_id.id}'`, (err, result)=>{
    if(err) console.log('Ошибка при обработке данных',err)

      purchasesBook = result
  })

  connection.query("SELECT * FROM `users` WHERE ?", user_id, (err, result) => {
    if (err) {
      console.error("Ошибка при выполнении запроса: ", err);
    } else {
      console.log("Данные успешно найден!");
      result.forEach((item) => {
        let newRes = [];

        const promises = purchasesBook.map(item => {
          return new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM books WHERE id = '${item.book_id}'`, (err, result) => {
              if (err) {
                console.error("Ошибка при выполнении запроса: ", err);
                return reject(err);
              }
        
              // В данном случае предполагаем, что result содержит массив
              if (result.length > 0) {
                newRes.push(result[0]); // Добавляем результат в массив
              }
        
              resolve();
            });
          });
        });
        
        Promise.all(promises)
          .then(() => {
            res.render("pages/buy", { data: item, profilName: item.name, newRes: newRes});
          })
          .catch(err => {
            console.error("Ошибка: ", err);
          });
      });
    }
  });
});

app.get("/category", (req, res) => {
  console.log("category page");

  const user_id = {
    id: req.cookies.id,
  };

  if(!req.cookies.id){
    res.redirect('http://localhost:1000/chose')
  }

  connection.query("SELECT * FROM `users` WHERE ?", user_id, (err, result) => {
    if (err) {
      console.error("Ошибка при выполнении запроса: ", err);
    } else {
      console.log("Данные успешно найден!");
      result.forEach((item) => {
        res.render("pages/category", { data: item, profilName: item.name });
      });
    }
  });
});

app.get("/about", (req, res) => {
  console.log("About page");

  const user_id = {
    id: req.cookies.id,
  };

  if(!req.cookies.id){
    res.redirect('http://localhost:1000/chose')
  }

  connection.query("SELECT * FROM `users` WHERE ?", user_id, (err, result) => {
    if (err) {
      console.error("Ошибка при выполнении запроса: ", err);
    } else {
      console.log("Данные успешно найден!");
      result.forEach((item) => {
        res.render("pages/about", { data: item, profilName: item.name });
      });
    }
  });
});

app.get("/chosen", (req, res) => {
  console.log("Chosen page");

  const user_id = {
    id: req.cookies.id,
  };

  if(!req.cookies.id){
    res.redirect('http://localhost:1000/chose')
  }

  let book;
  let basketBooks;
  let chosenBook;

  connection.query(
    `SELECT * FROM basket WHERE user_id = ${user_id.id}`,
    (err, result) => {
      if (err) {
        console.error("Ошибка при выполнении запроса: ", err);
      } else {
        console.log("Данные успешно найден!");
        basketBooks = result;
      }
    }
  );

  connection.query("SELECT * FROM `books`", (err, result) => {
    if (err) {
      console.error("Ошибка при выполнении запроса: ", err);
    } else {
      console.log("Данные успешно найден!");
      book = result;
    }
  });

  connection.query(
    `SELECT * FROM chosen WHERE user_id = '${user_id.id}'`,
    (err, result) => {
      if (err) console.error("Ошибка при выполнении запроса: ", err);

      chosenBook = result;
    }
  );

  connection.query("SELECT * FROM `users` WHERE ?", user_id, (err, result) => {
    if (err) {
      console.error("Ошибка при выполнении запроса: ", err);
    } else {
      console.log("Данные успешно найден!");
      result.forEach((item) => {
        res.render("pages/chosen", {
          data: item,
          profilName: item.name,
          book: book,
          basketBooks: basketBooks,
          chosenBook: chosenBook,
        });
      });
    }
  });
});

app.get("/getBook", (req, res) => {
  console.log("getBook page");

  const user_id = {
    id: req.cookies.id,
  };

  if(!req.cookies.id){
    res.redirect('http://localhost:1000/chose')
  }

  connection.query("SELECT * FROM `users` WHERE ?", user_id, (err, result) => {
    if (err) {
      console.error("Ошибка при выполнении запроса: ", err);
    } else {
      console.log("Данные успешно найден!");
      result.forEach((item) => {
        res.render("pages/getBook", { data: item, profilName: item.name });
      });
    }
  });
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/image/book"); // Папка, куда будут сохраняться файлы
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

app.post(
  "/getBook",
  urlencodedParser,
  upload.single("book_image"),
  (req, res) => {
    const book = {
      book_header: req.body.book_header,
      book_image: req.file.filename,
      book_price: req.body.book_price,
      author: req.cookies.id,
      category: req.body.category
    };
    connection.query("INSERT INTO `books` SET ?", book, (err, result) => {
      if (err) {
        console.log("Ошибка в запросе", err);
      } else {
        console.log("Успешно отправленно!");
        res.redirect("http://localhost:1000/");
      }
    });
  }
);

app.post("/basketDelete", urlencodedParser, (req, res) => {
  console.log("Delete book in basket");
  const id = {
    book_id: req.body.deleid,
  };

  connection.query("DELETE FROM `basket` WHERE ?", id, (err, result) => {
    if (err) {
      console.log("Ошибка при удолении книги из карзини", err);
    }
  });
});

app.post("/UpdateBasketBook", urlencodedParser, (req, res) => {
  console.log("Update basket count book");
  const countBook = {
    book_id: req.body.book_id,
    countBook: req.body.countBook,
  };
  connection.query(
    `UPDATE basket SET countBook = '${countBook.countBook}' WHERE book_id = '${countBook.book_id}'`,
    (err, result) => {
      if (err) console.log("Ошибка при обновления корзини");
      console.log("Все ОК!");
    }
  );
});

app.post("/getChosen", urlencodedParser, (req, res) => {
  console.log("Get chosen");

  const chosenBook = {
    book_id: req.body.book_id,
    user_id: req.cookies.id,
  };

  connection.query("INSERT INTO chosen SET ?", chosenBook, (err, result) => {
    if (err) console.log("Неполатка данных", err);
  });
});

app.post("/deleteChosen", urlencodedParser, (req, res) => {
  const deleteChosen = {
    book_id: req.body.book_id,
    user_id: req.cookies.id,
  };

  connection.query(
    `DELETE FROM chosen WHERE book_id = '${deleteChosen.book_id}' AND user_id = '${deleteChosen.user_id}'`,
    (err, result) => {
      if (err) console.log("Ошибка при удоления данных", err);
    }
  );
});

app.get("/myprofil", (req, res) => {
  console.log("Myprofil page");
  const id = {
    user_id: req.cookies.id,
  };

  if(!req.cookies.id){
    res.redirect('http://localhost:1000/chose')
  }

  let authorBook = []

  connection.query(`SELECT * FROM books WHERE author = '${id.user_id}'`, (err, result)=>{
    if(err) console.log('Ошибка при оброботке данных: ', err)
    
    result.forEach(item =>{
        authorBook.push(item)
    })
  })

  connection.query(
    `SELECT * FROM users WHERE id = '${id.user_id}'`,
    (err, result) => {
      if (err) console.log("Ошибка при оброботке данных: ", err);

      result.forEach((item) => {
        res.render("pages/myprofil", { data: item, authorBook: authorBook });
      });
    }
  );
});

app.get("/aboutBook/:num", (req, res) => {
  console.log("About book page");

  const id = {
    book_id: req.params.num,
    user_id: req.cookies.id,
  };

  if(!req.cookies.id){
    res.redirect('http://localhost:1000/chose')
  }

  let basket
  let chosen

  connection.query(`SELECT * FROM chosen WHERE user_id = '${id.user_id}' AND book_id = '${id.book_id}'`, (err, result)=>{
    if(err) console.log('Ошибка при обработке данных!', err)

    chosen = result
  })

    connection.query(
        `SELECT * FROM basket WHERE book_id = '${id.book_id}' AND user_id = '${id.user_id}'`,
        (err, result) => {
          if (err) {
            console.log("Ошибка при оброботке данных!", err)
          }
          basket = result
        }
    );

  connection.query(
    `SELECT * FROM books WHERE id = '${id.book_id}'`,
    (err, result) => {
      if (err) console.log("Ошибка при оброботке данных!", err);
        
        let author

        connection.query(`SELECT * FROM users WHERE id = '${result[0].author}'`, (err, result)=>{
            if(err) console.log('Ошибка при обработке данных', err)

            author = result[0].name
        })

        setTimeout(() =>{
            result.forEach((item) => {
                console.log(author)
                res.render("pages/aboutBook", { data: item, basket: basket, chosen: chosen, author: author });
              });
        }, 50)
    }
  );
});

app.post('/profilUpdate', urlencodedParser, (req, res)=>{
    console.log('profil Update')
    const dataUser = {
        id: req.cookies.id,
        name: req.body.name,
        mail: req.body.mail,
        age: req.body.age,
        fast_name: req.body.fast_name,
    }
    
    connection.query(`UPDATE users SET name = '${dataUser.name}', mail = '${dataUser.mail}', age = '${dataUser.age}', fast_name = '${dataUser.fast_name}' WHERE id = '${dataUser.id}'`, dataUser,  (err, result)=>{
        if(err) console.log('Ошибка при обработке данных', err)

        console.log('Данные успешно обновены!')
    })
})

app.post('/bookUpdate', urlencodedParser, (req, res)=>{
  console.log('bookUpdate post')

  const bookData = {
    author: req.cookies.id,
    book_id: req.body.book_id,
    book_header: req.body.book_header,
    book_price: req.body.book_price
  }
  console.log(bookData)

  connection.query(`UPDATE books SET book_header = '${bookData.book_header}', book_price = '${bookData.book_price}' WHERE id = '${bookData.book_id}'`, (err, result)=>{
    if(err) console.log('Ошибка прои обработке данных', err)
  })
})

app.get('/product', (req, res) => {
  console.log('Product page');

  const id = {
    user_id: req.cookies.id
  };

  if(!req.cookies.id){
    res.redirect('http://localhost:1000/chose')
  }

  connection.query(`SELECT * FROM books WHERE author = '${id.user_id}'`, (err, result) => {
    if (err) {
      console.log('Ошибка при обработке данных', err);
      return res.status(500).send('Server error');
    }

      res.render('pages/product', { product: result });
    });
});

app.post('/deleteBook', urlencodedParser, (req, res)=>{
  console.log('Delete book post')

  const id = {
    book_id: req.body.book_id
  }

  connection.query(`DELETE FROM books WHERE id = '${id.book_id}'`, (err, result)=>{
    if(err) console.log('Ошибка при обработке данных', err)
  })
})

app.post('/purchases', urlencodedParser, (req, res)=>{
  console.log('purchases post')

  const id = {
    book_id: req.body.book_id,
    user_id: req.cookies.id
  }

  connection.query(`DELETE FROM basket WHERE user_id = '${id.user_id}' AND book_id = '${id.book_id}'`, (err, result)=>{
    if(err) console.log('Ошибка при обработке данных', err)
  })

  connection.query('INSERT INTO purchases SET ?', id, (err, result)=>{
    if(err) console.log('Ошибка при обработке данных', err)
  })
})

app.get('/category/:cty', (req, res)=>{
  console.log('Category page')
  const category = {
    cty: req.params.cty
  }
  const id = {
    user_id: req.cookies.id
  }
  
  if(!req.cookies.id){
    res.redirect('http://localhost:1000/chose')
  }

  let resCty = []
  connection.query(`SELECT * FROM books WHERE category = '${category.cty}'`, (err, result)=>{
    if(err) console.log('Ошибка при обработке данных', err)

    result.forEach(item =>{
      resCty.push(item)
    })
  })
  let basketBooks;
  let chosenBook;

  connection.query(
    `SELECT * FROM basket WHERE user_id = ${id.user_id}`,
    (err, result) => {
      if (err) {
        console.error("Ошибка при выполнении запроса: ", err);
      } else {
        console.log("Данные успешно найден!");
        basketBooks = result;
      }
    }
  );

  connection.query(
    `SELECT * FROM chosen WHERE user_id = '${id.user_id}'`,
    (err, result) => {
      if (err) console.error("Ошибка при выполнении запроса: ", err);

      chosenBook = result;
    }
  );

  connection.query(
    `SELECT * FROM users WHERE id = '${id.user_id}'`,
    (err, result) => {
      if (err) console.log("Ошибка при оброботке данных: ", err);

      result.forEach((item) => {
        res.render("pages/ctyBook", { data: item, profilName: item.name, resCty: resCty, basketBooks: basketBooks, chosenBook, chosenBook});
      });
    }
  );

})
  
app.use((req, res, next) => {
  res.status(404);

  const id = {
    user_id: req.cookies.id
  }

  connection.query(
    `SELECT * FROM users WHERE id = '${id.user_id}'`,
    (err, result) => {
      if (err) console.log("Ошибка при оброботке данных: ", err);

      result.forEach((item) => {
        res.render("pages/error", { data: item, profilName: item.name});
      });
    }
  );
  
});

app.listen(PORT);