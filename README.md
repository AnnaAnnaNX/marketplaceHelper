npm i 

node swagger.js

http://localhost:3000/doc/



получение списка ссылок 
http://localhost:3000/doc/#/default/get_rndScripts_getLinks

в файле src/scripts/listGroupRnd.json   - полный списко групп
надо группы, ссылки которых хотите узнать, записать в файл src/scripts/listGroupRndTest.json

если запрос выполнится неудачно, все найденные ссылки сохрнятся в файле result.xlsx в корне

Файл с ссылками первым столбцом имеет ссылку группы, т.о. можно из списка групп src/scripts/listGroupRndTest.json удалять уже найденные группы и выполнять новый поиск только для групп, ссылки которых еще не искались

-----------------
test files for methods
ym_calcEffByPrice
    ym_calcEffByPrice_price.xlsx
    ym_calcEffByPrice_parse.xlsx
ym_calcPriceByEff
    ym_calcPriceByEff_eff.xlsx
    ym_calcPriceByEff_parse.xlsx
ozon_calcEffByPrice
    ozon_calcEffByPrice_price.xlsx
    ozon_calcEffByPrice_purchase.xlsx
    ozon_calcEffByPrice_template.xlsx
ozon_calcPriceByEff
    ozon_calcPriceByEff_eff.xlsx
    ozon_calcPriceByEff_purchase.xlsx
    ozon_calcPriceByEff_template.xlsx
