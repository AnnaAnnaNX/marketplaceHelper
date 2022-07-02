let nodes = document.querySelectorAll('.category-dropdown-list a')
list = [];
for(let el of nodes) {
   list.push(el.getAttribute('href'));    
}
console.log(list.length);
let uniqList = [...new Set(list)];
console.log(uniqList);
console.log(uniqList.length);
let text = uniqList.map((el) => (`'${el}',`)).join('\n');
text;