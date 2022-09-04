
// admin mode switch (mainly for preview)

let btn = document.querySelector(".switch");

btn.addEventListener('click', () => {
    if(btn.innerHTML == 'Admin Mode'){
            
        document.getElementById("mode").innerHTML = "Admin Mode";
        let wrapper = document.querySelector(".admin-buttons");
        wrapper.style.display = "flex";
        btn.innerHTML = 'User Mode'

        let claimText = document.querySelectorAll(".claim");
        let itemButtons = document.querySelectorAll(".itemButtons");

        claimText.forEach(element => {
            element.style.display = "none"
        });

        itemButtons.forEach(element => {
            element.style.display = "flex";
        })
    }else {
        document.getElementById("mode").innerHTML = "User Mode";
        let wrapper = document.querySelector(".admin-buttons");
        wrapper.style.display = "none";
        btn.innerHTML = 'Admin Mode'

        let claimText = document.querySelectorAll(".claim");
        let itemButtons = document.querySelectorAll(".itemButtons");

        claimText.forEach(element => {
            element.style.display = "flex"
        });

        itemButtons.forEach(element => {
            element.style.display = "none";
        })
    }
})

// customize panel and addItem box

let customizeBtn = document.querySelector(".customize");
let box = document.querySelector(".customizeBox");
let statusCustomize = false;

customizeBtn.addEventListener('click', () => {
    statusCustomize = !statusCustomize;

    if(statusCustomize){
        box.style.display = "flex";
    }else {
        box.style.display = "none";
    }
})

let addItemBtn = document.querySelector(".addItem");
let statusAddItem = false;
let boxAddItem = document.querySelector(".addItemBox");

addItemBtn.addEventListener('click', () => {
    statusAddItem = !statusAddItem;

    if(statusAddItem){
        boxAddItem.style.display = "flex";

    }else {
        boxAddItem.style.display = "none";
    }
})

// close panels from X

let closeCustomize = document.querySelector(".closeCustomize")
let closeAddItem= document.querySelector(".closeAddItem")

closeCustomize.addEventListener('click', () => {
    box.style.display = "none";
    statusCustomize = false;
})
closeAddItem.addEventListener('click', () => {
    boxAddItem.style.display = "none";
    statusAddItem = false;
})

// buy panel
let bg = document.querySelector(".addon");



// navbar 

let closeMenu = document.querySelector(".closeMenu");
let openMenu = document.querySelector(".openMenu");
let navbar = document.querySelector(".left-menu")

openMenu.addEventListener("click", () => {
    navbar.style.left = "0";
    closeMenu.style.top = "-10px"
    bg.style.display = "block";

})
closeMenu.addEventListener("click", () => {
    navbar.style.left = "-500px";
    closeMenu.style.top = "-50px";
    bg.style.display = "none";

})


