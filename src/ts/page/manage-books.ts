const btnNew = document.querySelector<HTMLButtonElement>('#btn-new')!;
const frmBook = document.querySelector<HTMLFormElement>('#frm-books')!;
const txtId =document.querySelector<HTMLInputElement>('#txt-id')!;
const txtName =document.querySelector<HTMLInputElement>('#txt-name')!;
const txtAuthor =document.querySelector<HTMLInputElement>('#txt-author')!;
const txtBookType =document.querySelector<HTMLInputElement>('#txt-bookType')!;
const txtPreview =document.querySelector<HTMLInputElement>('#txt-preview')!;
const divThumbnail =document.querySelector<HTMLDivElement>('#image-preview')!;
const lblPreview =document.querySelector<HTMLLabelElement>('#lbl-preview')!;
const btnRemove =document.querySelector<HTMLButtonElement>('#btn-remove')!;
const pagination =document.querySelector<HTMLUListElement>('.pagination')!;
const btnSave =document.querySelector<HTMLButtonElement>('.btn-save')!;
const btnClear =document.querySelector<HTMLButtonElement>('.btn-clear')!;

let blobUrl:null|string = null;

setEnableForm(false);
function setEnableForm(enable:boolean = true){
    for (const element of frmBook.elements) {
        if (element instanceof HTMLInputElement || element instanceof HTMLButtonElement){
            element.disabled = !enable;
        }
    }
}

txtPreview.addEventListener('input',()=>{
   if (txtPreview.files![0]){
       lblPreview.innerText=txtPreview.files![0].name;
       blobUrl = URL.createObjectURL(txtPreview.files![0]);
       divThumbnail.style.backgroundImage=`url(${blobUrl})`;
       btnRemove.disabled=false;
   }
});

btnNew.addEventListener('click',()=>{
    setEnableForm();
    frmBook.reset();
    lblPreview.innerText='';
    divThumbnail.style.backgroundImage='';
    btnRemove.disabled=true;
});

btnRemove.addEventListener('click',()=>{
   txtPreview.value='';
   if (blobUrl) URL.revokeObjectURL(blobUrl);
   divThumbnail.style.backgroundImage='';
   lblPreview.innerText='';
   btnRemove.disabled=true;
});

frmBook.addEventListener('submit',(e)=>{
    e.preventDefault();
    if (btnSave.innerText==="EDIT") {
        setEnableForm();
        btnSave.innerText = 'Save';
        btnRemove.disabled = !divThumbnail.style.backgroundImage;
    }
    const inputElms =[txtId,txtName,txtAuthor,txtBookType];
    const invalidInputElms = inputElms.filter(value => !value.classList.contains('is-valid'));
    if (invalidInputElms.length>0){
        invalidInputElms.forEach(value => value.classList.add('is-invalid'));
        invalidInputElms[0].focus();
    }

    /*Todo: send the data to the backend*/

});

frmBook.addEventListener('reset',(e)=>{
    const inputElms =[txtId,txtName,txtAuthor,txtBookType];
    inputElms.forEach(value => value.classList.remove('is-invalid','is-valid'));
    inputElms[0].focus();
    btnRemove.click();
});

txtId.addEventListener('input',checkValidity);
txtName.addEventListener('input',checkValidity);
txtAuthor.addEventListener('input',checkValidity);
txtBookType.addEventListener('input',checkValidity);

function checkValidityOfID(){
    return /^B\d{3}$/.test(txtId.value);
}

function checkValidityOfName(){
    return /^[A-Za-z\d]+$/.test(txtName.value);
}

function checkValidityOfAuthor(){
    return /^[A-Za-z ]+$/.test(txtAuthor.value);
}

function checkValidityOfBookType(){
    return /^[A-Za-z ]+$/.test(txtAuthor.value);
}

function checkValidity(e:Event){
    (e.target as HTMLInputElement).classList.remove('is-valid','is-invalid');
    if (e.target===txtId){
        checkValidityOfID() ? txtId.classList.add('is-valid'):txtId.classList.add('is-invalid');
    }else if (e.target===txtName){
        checkValidityOfName() ? txtName.classList.add('is-valid'):txtName.classList.add('is-invalid');
    }else if (e.target===txtAuthor){
        checkValidityOfAuthor() ? txtAuthor.classList.add('is-valid'):txtAuthor.classList.add('is-invalid');
    }else if (e.target===txtBookType){
        checkValidityOfBookType() ? txtBookType.classList.add('is-valid'):txtBookType.classList.add('is-invalid');
    }
}

const pageSize=5;
const booksCount=55;
let activePage = 1;

initPagination(1);

function initPagination(page: number = 1){
    let pages = Math.ceil(booksCount / pageSize);
    if (page < 1 || page > pages ) page = pages;
    activePage = page;
    let end = page + 4;
    let start = page - 5;
    if (end > pages){
        start -= (end - pages);
        end = pages;
    }
    if (start < 1){
        end += (1 - start);
        if (end > pages) end = pages;
        start = 1;
    }
    let html = `<li class="page-item"><a class="page-link" href="#">&laquo;</a></li>`;
    for (let i = start; i <= end; i++) {
        html += `<li class="page-item ${i===page?'active':''}"><a class="page-link" href="#">${i}</a></li>`
    }
    html += `<li class="page-item"><a class="page-link" href="#">&raquo;</a></li>`;
    pagination.innerHTML = html;
}

pagination.addEventListener('click', (e)=> {
    let elm = (e.target as HTMLElement);
    if (elm.tagName === 'A'){
        if (elm.innerText === '«'){
            initPagination(--activePage);
        }else if (elm.innerText === '»'){
            initPagination(++activePage);
        }else{
            initPagination(+elm.innerText);
        }
        e.stopPropagation();
    }

});

const tblBooks = document.querySelector<HTMLTableElement>("table")!;
tblBooks.querySelector("tbody")!.addEventListener('click', (e)=>{
    if ((e.target as HTMLElement).classList.contains('trash') ||
        (e.target as HTMLElement).classList.contains('fa-trash')){
        e.stopPropagation();
        const elm = e.target as HTMLElement;
        const row = elm.closest<HTMLTableRowElement>('tr')!;
        const isbn = (row.querySelector<HTMLDivElement>(".isbn")!.innerText);
        const promise = Swal.fire({
            title: 'Confirm?',
            text: `Are you sure to delete the ${isbn}?`,
            icon: 'question',
            confirmButtonText: 'Yes',
            denyButtonText: 'No',
            showDenyButton: true
        }) as Promise<any>;
        promise.then((resolve)=> {
            if (resolve.isConfirmed){
                frmBook.reset();
                row.remove();
            }
        });
    }
});

declare const Swal: any;
tblBooks.addEventListener('click',(e)=>{
    const row = (e.target as HTMLElement).closest<HTMLTableRowElement>('tr')!;
    tblBooks.querySelectorAll("tr").forEach(elm=>elm.classList.remove('selected'));
    row.classList.add("selected");

    const id = row.querySelector<HTMLDivElement>(".id")!.innerText;
    const name = row.querySelector<HTMLDivElement>(".book-name")!.innerText;
    const author = row.querySelector<HTMLDivElement>(".book-author")!.innerText;
    const bookPreview = row.querySelector<HTMLImageElement>(".book-preview")!;

    txtId.value=id;
    txtName.value=name;
    txtAuthor.value=author;
    txtName.classList.add('is-valid');
    txtId.classList.add('is-valid');
    txtAuthor.classList.add('is-valid');
    txtBookType.classList.add('is-valid');
    divThumbnail.style.backgroundImage=`url(${bookPreview.src})`
    btnSave.innerText='EDIT';
    btnSave.disabled=false;
});
