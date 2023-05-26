const { expect } = require("chai");
const fs = require("fs");
describe("NFTstaker", () => {
  let TokenErc20;
  let tokenErc20;
  let TokenErc721;
  let tokenErc721;
  let Main;
  let main;
  let owner;
  let buyer;

  beforeEach(async () => {
    TokenErc20 = await ethers.getContractFactory("erc20");

    tokenErc20 = await TokenErc20.deploy();

    TokenErc721 = await ethers.getContractFactory("Erc721");

    tokenErc721 = await TokenErc721.deploy();


    Main = await ethers.getContractFactory("NFTstaker");


    main = await Main.deploy(tokenErc20.address, tokenErc721.address);
    [owner,buyer] =  await ethers.getSigners();

    

  });

  it("item id should increase after calling resgister function ",async function () {
    var itemId = main.itemId();
    main.ItemReg("sdfghjk","sffdghjk",100);
    var itemIdAfter = main.itemId();
    expect (itemId).not.to.equal(itemIdAfter);
    
  });

  it("owner shouldnot be calling function", async function(){
    
    await main.connect(owner).ItemReg("dfv","DF",100);

    await expect(main.connect(owner).BuyItem(1)).to.be.revertedWith("owner can't buy");
  });

  it("initialy while buying recipient should be 0", async function(){
    await main.connect(owner).ItemReg("dfv","DF",100);
    var resp = await main.Item(1);
    var respii = await(resp.recipient);
    await (main.connect(buyer).BuyItem(1));
    var afetrResp = await main.Item(1);
    var rEspii = await(afetrResp.recipient);
    expect(respii).not.to.be.equal(rEspii);
  });


  it("Erc20 token should be transfered by the buyer ", async function(){
    await main.connect(owner).ItemReg("dfv","DF",100);
    await (main.connect(buyer).BuyItem(1));
    var bal = await(tokenErc20.balanceOf(main.address));
    var cont = await main.Item(1);
    var price = await cont.price;
    expect (bal).to.be.equal(price);


  });

  it("Erc721 Nft should be minted to the buyer end", async function(){
    await main.connect(owner).ItemReg("dfv","DF",100);
    await (main.connect(buyer).BuyItem(1));
    
    var cont = await main.Item(1);
    var nFTcreated = await cont.NFTcreated;
    var bal = await(tokenErc721.balanceOf(buyer.address));
    expect (bal).to.be.equal(nFTcreated);

  });

  it("checking whether the item is approved by both buyer and seller", async function(){
    await main.connect(owner).ItemReg("dfv","DF",100);
    await (main.connect(buyer).BuyItem(1));
    await (main.connect(buyer).approveItem(1,true));
    await (main.connect(owner).approveItem(1,true));
    var cont = await main.Item(1);
    var appOwner = await cont.approvalByOwner;
    var appBuyer = await cont.approvalBySeller;
    expect (appBuyer).to.be.equal(appOwner);
    expect (appBuyer).to.be.equal(true);
  })

  it("only owner have right to transfer ownership", async function(){
    await main.connect(owner).ItemReg("dfv","DF",100);
    await (main.connect(buyer).BuyItem(1));
    await (main.connect(buyer).approveItem(1,true));
    await (main.connect(owner).approveItem(1,true));
    await expect(main.connect(buyer).transferOwnership(1)).to.be.revertedWith("only owner can transfer ownership");

  })


  it("nft should be burned after transfering", async function(){
    await main.connect(owner).ItemReg("dfv","DF",100);
    await (main.connect(buyer).BuyItem(1));
    await (main.connect(buyer).approveItem(1,true));
    await (main.connect(owner).approveItem(1,true));
    await (main.connect(owner).transferOwnership(1)); 
    var cont = await main.Item(1);
    var nFTcreated = await cont.NFTcreated;
    var bal = await(tokenErc721.balanceOf(buyer.address));
    expect (bal).to.be.equal(nFTcreated);
  });

  it("erc20 should be tranfered to owner after transfering ownership", async function(){
    await main.connect(owner).ItemReg("dfv","DF",100);
    await (main.connect(buyer).BuyItem(1));
    await (main.connect(buyer).approveItem(1,true));
    await (main.connect(owner).approveItem(1,true));
    await (main.connect(owner).transferOwnership(1));

    var bal = await(tokenErc20.balanceOf(owner.address));

    var balance = await(tokenErc20.totalSupply());
    var cont = await main.Item(1);
    var price = await cont.price; 
    var priceFor = price + balance
    expect (bal).to.be.equal(priceFor);

  });

  it("erc20 balance after transfering ownership should be reduced", async function(){
    await main.connect(owner).ItemReg("dfv","DF",100);
    await (main.connect(buyer).BuyItem(1));
    await (main.connect(buyer).approveItem(1,true));
    await (main.connect(owner).approveItem(1,true));
    var bal = await(tokenErc20.balanceOf(main.address));
    await (main.connect(owner).transferOwnership(1));
    var balance = await(tokenErc20.balanceOf(main.address));
    expect (bal).not.to.be.equal(balance);
  });


  it("nft should be burned after canceling", async function(){
    await main.connect(owner).ItemReg("dfv","DF",100);
    await (main.connect(buyer).BuyItem(1));
    await (main.connect(owner).cancelItemOrder(1)); 
    var cont = await main.Item(1);
    var nFTcreated = await cont.NFTcreated;
    var bal = await(tokenErc721.balanceOf(buyer.address));
    expect (bal).to.be.equal(nFTcreated);
  });

  it("erc20 should be tranfered to recipient after canceling", async function(){
    await main.connect(owner).ItemReg("dfv","DF",100);
    await (main.connect(buyer).BuyItem(1));
    var cont = await main.Item(1);
    var price = await cont.price; 
    await (main.connect(owner).cancelItemOrder(1));

    var bal = await(tokenErc20.balanceOf(buyer.address));
    expect (bal).to.be.equal(price);

  });

  it("erc20 balance after canceling should be reduced", async function(){
    await main.connect(owner).ItemReg("dfv","DF",100);
    await (main.connect(buyer).BuyItem(1));
    var bal = await(tokenErc20.balanceOf(main.address));
    await (main.connect(owner).cancelItemOrder(1));
    var balance = await(tokenErc20.balanceOf(main.address));
    expect (bal).not.to.be.equal(balance);
  });
});