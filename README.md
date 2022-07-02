npm i 

node swagger.js

http://localhost:3000/doc/



получение списка ссылок 
http://localhost:3000/doc/#/default/get_rndScripts_getLinks

в файле src/scripts/listGroupRnd.json   - полный списко групп
надо группы, ссылки которых хотите узнать, записать в файл src/scripts/listGroupRndTest.json

если запрос выполнится неудачно, все найденные ссылки сохрнятся в файле result.xlsx в корне

Файл с ссылками первым столбцом имеет ссылку группы, т.о. можно из списка групп src/scripts/listGroupRndTest.json удалять уже найденные группы и выполнять новый поиск только для групп, ссылки которых еще не искались


