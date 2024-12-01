const search = document.querySelector('.search');
const bookNames = document.querySelectorAll('.book-name');
const searchEls = document.querySelectorAll('.searchEl');

search.addEventListener('input', function() {
    if (search.value === '') {
        searchEls.forEach(el => el.classList.remove('none'));
    } else {
        const searchValue = search.value.toLowerCase();
        bookNames.forEach((bookName, i) => {
            if (bookName.textContent.toLowerCase().startsWith(searchValue)) {
                searchEls[i].classList.remove('none');
            } else {
                searchEls[i].classList.add('none');
            }
        });
    }
});
