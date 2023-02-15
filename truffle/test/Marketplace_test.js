const { assert } = require('chai')

const Marketplace = artifacts.require('./Marketplace.sol')
require('chai')
.use(require('chai-as-promised'))
.should()

contract('Marketplace',([deployer,seller,buyer])=>{   //comptes de utilisateur de la blockchain
    let marketplace

    before(async()=>{
        marketplace = await Marketplace.deployed() // deployment du contrat sur la block chain
    })

   describe('deployment',async()=>{ 
    it('deploys succesfully',async()=>{  // test du deployment 
        const address = await marketplace.address
        assert.notEqual(address,0x0)
        assert.notEqual(address,'')
        assert.notEqual(address,null)
        assert.notEqual(address,undefined)
    })
    it('has a name',async()=>{   // test du nom
        const name = await marketplace.name()
        assert.equal(name,'Wallet')
    })
   })

   describe('products',async()=>{    
    let result,productCount
     
    before(async()=>{
        result  = await marketplace.createProduct("shitcoin",web3.utils.toWei('1','Ether'), {from:seller})  //{from:seller} metadata compte vendeur
        productCount= await marketplace.productCount()
    })

    it('creates products', async () =>{    // test de le creation du produit
        //success
        assert.equal(productCount,1)
        const event= result.logs[0].args
        assert.equal(event.id.toNumber(),productCount.toNumber(),'id is correct')
        assert.equal(event.name,'shitcoin',' name is correct')
        assert.equal(event.price,'1000000000000000000',' price is correct')
        assert.equal(event.owner, seller,'owner is correct')
        assert.equal(event.purchased,false ,'purchased is correct')
        // failures
        await marketplace.createProduct('',web3.utils.toWei('1','Ether'), {from:seller}).should.be.rejected; 

        await marketplace.createProduct('shitcoin', 0, {from:seller}).should.be.rejected;
    })
    
    it('lists products',async()=>{
        const product= await marketplace.products(productCount)
        assert.equal(product.id.toNumber(),productCount.toNumber(),'id is correct')
        assert.equal(product.name,'shitcoin',' name is correct')
        assert.equal(product.price,'1000000000000000000',' price is correct')
        assert.equal(product.owner, seller,'owner is correct')
        assert.equal(product.purchased,false ,'purchased is correct')
    })

    it('sells products',async()=>{
        //track seller balance
        let oldSellerBalance
        oldSellerBalance = await web3.eth.getBalance(seller)
        oldSellerBalance = new web3.utils.BN(oldSellerBalance) //bn = big numbers
        //success
        result= await marketplace.purchasedProduct(productCount,{from:buyer,value: web3.utils.toWei('1','Ether')})
        //checklogs
        const event= result.logs[0].args
        assert.equal(event.id.toNumber(),productCount.toNumber(),'id is correct')
        assert.equal(event.name,'shitcoin',' name is correct')
        assert.equal(event.price,'1000000000000000000',' price is correct')
        assert.equal(event.owner, buyer,'owner is correct')
        assert.equal(event.purchased,true ,'purchased is correct')

        //check thats the seller received the funds
        let newSellerBalance
        newSellerBalance= await web3.eth.getBalance(seller)
        newSellerBalance= new web3.utils.BN(newSellerBalance)

        let price
        price = web3.utils.toWei('1','ether')
        price = new web3.utils.BN(price)

       const expectedBlanace = oldSellerBalance.add(price)
       assert.equal(newSellerBalance.toString(),expectedBlanace)

       //failure: tries to buy a product that doesn't exist
       await marketplace.purchasedProduct(99,{from:buyer, value:web3.utils.toWei('1','ether')}).should.be.rejected
       //failure: tries to buy with insufficient balance
       await marketplace.purchasedProduct(productCount,{from:buyer, value:web3.utils.toWei('0.5','ether')}).should.be.rejected
       //failure: deployer tries to buy is own product
       await marketplace.purchasedProduct(productCount,{from:deployer, value:web3.utils.toWei('1','ether')}).should.be.rejected
       //failure: buyer tries to buy again
       await marketplace.purchasedProduct(productCount,{from:buyer, value:web3.utils.toWei('1','ether')}).should.be.rejected
    })
        
   })

})