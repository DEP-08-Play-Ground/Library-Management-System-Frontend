let navUItemList = document.querySelectorAll(".sidebar .nav-item");

for (const navItem of navUItemList){
    navItem.addEventListener('click',navItemListener);
}

function navItemListener(this:HTMLLIElement){

    switch (this.querySelector<HTMLParagraphElement>('.nav-link p')!.innerText){
        case "Dashboard":
            window.location.replace('index.html');
            break;
        case "Manage Books":
            window.location.replace('manage-books.html');
            break;
        case "Manage Members":
            window.location.replace('manage-members.html');
            break;
        case "Issue Books":
            window.location.replace('issue-books.html');
            break;
        case "Manage Returns":
            window.location.replace('return-books.html');
            break;
        default:
            window.location.replace('settings.html');
            break;
    }
}

switch(window.location.pathname){
    case "/": case "/index.html":
        navUItemList.item(0).querySelector(".nav-link")!.classList.add('active');
        break;
    case "/manage-books.html":
        navUItemList.item(1).querySelector(".nav-link")!.classList.add('active');
        break;
    case "/manage-members.html":
        navUItemList.item(2).querySelector(".nav-link")!.classList.add('active');
        break;
    case "/issue-books.html":
        navUItemList.item(3).querySelector(".nav-link")!.classList.add('active');
        break;
    case "/return-books.html":
        navUItemList.item(4).querySelector(".nav-link")!.classList.add('active');
        break;
    default:
        navUItemList.item(5).querySelector(".nav-link")!.classList.add('active');
        break;
}
