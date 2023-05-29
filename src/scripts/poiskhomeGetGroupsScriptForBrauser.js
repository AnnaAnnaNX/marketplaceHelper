let nodes = document.querySelectorAll('.pop-menu-right')
let menu = [];
let list = [];
for(let node of nodes) {
    const category1El = node.querySelector('.category-name');
    const category1 = {name: category1El.innerText};

    const lis = node.querySelectorAll('li');
    let category2 = null;
    for(let li of lis) {
        console.log(li.classList.value);
        if (li.classList.value ==='pop-menu-group-title') {
            category2 = {
                name: li.innerText,
                link: li.querySelector('a').href,
            }
        } else {
            const category3 = {
                name: li.innerText,
                link: li.querySelector('a').href,
            };
            if (!category2) {
                list.push([category1, category3, null]);
            } else {
                list.push([category1, category2, category3]);
            }
        }
    }

    // list.push([category1]);
}
console.log(list);
