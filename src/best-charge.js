const {loadAllItems} = require('../src/items');
const {loadPromotions} = require('../src/promotions');
function bestCharge(inputs) {
  let simpleInput=simpleInputs(inputs);
  let initReceipts=initReceipt(simpleInput)
  let caculateHalfPromotion=caculateHalfPromotions(initReceipts);
  let caculateOriginPromotion=caculateOriginPromotions(initReceipts);
  let caculatePromotion=caculatePromotions(initReceipts);
  let printReceipt=printReceipts(initReceipts);
  console.info(simpleInput)
  console.info(initReceipts)
  console.info(caculateHalfPromotion)
  console.info(caculateOriginPromotion)
  console.info(caculatePromotion)
  console.info(printReceipt)
  return printReceipt;
}
//格式化输入 16行
function simpleInputs(inputs){
  let simpleInput=[];
  for(let input of inputs)
  {
    if(input.indexOf(" x")!==-1)
    {
      let temp=input.split(" x");
      simpleInput.push({"id":temp[0],"count":parseFloat(temp[1])});
    }
  }
  return simpleInput;
}
//初始化小票 17行
function initReceipt(simpleInput){
  let initReceipts=[];
  let allItems=loadAllItems();
  for(let item of simpleInput){
    for (let items of allItems){
      if(items.id===item.id){
        initReceipts.push({
          id:items.id,
          count:item.count,
          name:items.name,
          price:items.price});
      }
    }
  }
  return initReceipts;
}
//半价优惠计算
function caculateHalfPromotions(initReceipts){
  let promotions=loadPromotions();
  let sum=0;
  for(let promotion of promotions){
    if (promotion.type === '指定菜品半价') {
      for (let item of initReceipts) {
        let promoteItems=promotion.items;
        if(promoteItems.indexOf(item.id)!==-1){
          sum+=item.count*(item.price/2);
        }else{
          sum+=item.count*item.price;
        }

      }
    }
  }
  return sum;
}
//无优惠计算总价价格
function caculateOriginPromotions(initReceipts){
  let sum=0
  for (let item of initReceipts) {
    sum+=item.count*item.price;
  }
  return sum;
}

//计算优惠
function caculatePromotions(initReceipts){
  let promotion="";
  let OriginSum=caculateOriginPromotions(initReceipts);
  let halfSum=caculateHalfPromotions(initReceipts);
  if((OriginSum-halfSum)>=6){
    promotion+=`
使用优惠:
指定菜品半价(黄焖鸡，凉皮)，省${(OriginSum-halfSum)}元
-----------------------------------
总计：${halfSum}元
===================================`;
    return promotion;
  }else if(OriginSum>30){
    promotion+=`
使用优惠:
满30减6元，省6元
-----------------------------------
总计：${(OriginSum-6)}元
===================================`;
  }else if((OriginSum-halfSum)>0){
    promotion+=`
使用优惠:
指定菜品半价(黄焖鸡，凉皮)，省${(OriginSum-halfSum)}元
-----------------------------------
总计：${halfSum}元
===================================`;
  }else{
    promotion+=`
总计：${OriginSum}元
===================================`
  }
  return promotion;
}
//打印输出
function printReceipts(initReceipts){
  let bodyReceipt=caculatePromotions(initReceipts);
  let headReceipts="";
  for(let item of initReceipts){
    headReceipts += "\n";
    headReceipts += `${item.name} x ${item.count} = ${item.price*item.count}元`
  }
  const result = `============= 订餐明细 =============${headReceipts}\n-----------------------------------${bodyReceipt}`	//
  return 	result;
}




module.exports = {simpleInputs,initReceipt,caculateHalfPromotions,caculateOriginPromotions,caculatePromotions,printReceipts,bestCharge}


