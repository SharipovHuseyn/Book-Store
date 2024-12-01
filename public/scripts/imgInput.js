const imgShow = document.querySelector('.imgShow')
const inputImageShow = document.querySelector('.input-imageShow')
const btnClearImage = document.querySelector('.btnClearImage')

document.getElementById('file-upload').addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        inputImageShow.classList.add('none')
        imgShow.classList.remove('none')
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        img.classList.add('imageShowStyle')
        imgShow.appendChild(img)
        btnClearImage.classList.remove('none')

        btnClearImage.addEventListener('click', function(){
            imgShow.innerHTML = ''
            inputImageShow.classList.remove('none')
            btnClearImage.classList.add('none')
        })
    }
});