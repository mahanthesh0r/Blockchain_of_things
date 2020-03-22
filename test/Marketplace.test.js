const Marketplace = artifacts.require('/Users/macbook/Documents/blockchain_iot/marketplace/src/contracts/Marketplace.sol')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Marketplace', ([deployer,seller,buyer]) => {
    let marketplace

    before(async () => {
        marketplace = await Marketplace.deployed()
    })
    describe('deployment', async () => {
        it('deploys successfully',async () => {
            const address = await marketplace.address 
            assert.notEqual(address,0x0)
            assert.notEqual(address,'')
            assert.notEqual(address,null)
            assert.notEqual(address,undefined)
        })
        
        it('has a name', async () => {
            const name = await marketplace.name()
            assert.equal(name,'Mahanthesh Marketplace')
        })
    })

    describe('houses', async () => {
        let results, productCount

         before(async () => {
            results = await marketplace.createHouse('ABC House',web3.utils.toWei('1','Ether'),'2BHK','HSR Layout', {from: seller})
            productCount = await marketplace.productCount()
        })
        
        it('creates houses', async () => {
           //SUCCESS
           assert.equal(productCount,1)
           const event = results.logs[0].args
           assert.equal(event.id.toNumber(),productCount.toNumber(), 'id is correct')
           assert.equal(event.price,'1000000000000000000','price is correct')
           assert.equal(event.bhk,'2BHK','BHK is correct')
           assert.equal(event.location,'HSR Layout','location is correct')
           assert.equal(event.owner,seller,'owner is correct')
           assert.equal(event.rentee,0,'buyer is correct')
           assert.equal(event.purchased,false,'purchased is correct')

           //FAIL : Product must have a name
          await await marketplace.createHouse('',web3.utils.toWei('1','Ether'),'2BHK','HSR Layout', {from: seller}).should.be.rejected;

           //FAIL : Product must have a price
           await await marketplace.createHouse('ABC House',0 ,'2BHK','HSR Layout', {from: seller}).should.be.rejected;

           console.log(results.logs[0].args)

        })

        it('lists houses', async () => {
            const house = await marketplace.houses(productCount)
            assert.equal(house.id.toNumber(),productCount.toNumber(), 'id is correct')
            assert.equal(house.price,'1000000000000000000','price is correct')
            assert.equal(house.bhk,'2BHK','BHK is correct')
            assert.equal(house.location,'HSR Layout','location is correct')
            assert.equal(house.owner,seller,'owner is correct')
            assert.equal(house.rentee,0,'buyer is correct')
            assert.equal(house.purchased,false,'purchased is correct')
 
         })

         it('sells houses', async () => {
             //TRACK THE SELLER BALANCE
             let oldSellerBalance
             oldSellerBalance = await web3.eth.getBalance(seller)
             oldSellerBalance = new web3.utils.BN(oldSellerBalance)


             //SUCCESS:buyer makes purchase
           results = await marketplace.rentHouse(productCount, { from: buyer, value: web3.utils.toWei('1','Ether') })

           //check logs
           const event = results.logs[0].args
           assert.equal(event.id.toNumber(),productCount.toNumber(), 'id is correct')
           assert.equal(event.price,'1000000000000000000','price is correct')
           assert.equal(event.bhk,'2BHK','BHK is correct')
           assert.equal(event.location,'HSR Layout','location is correct')
           //assert.equal(event.owner,buyer,'owner is correct')
           assert.equal(event.owner,seller,'owner is correct')
           assert.equal(event.rentee,buyer,'buyer is correct')
           assert.equal(event.purchased,true,'purchased is correct')


           //CHECK THAT SELLER RECIEVED THE FUNDS
            let newSellerBalance = await web3.eth.getBalance(seller)
            newSellerBalance = new web3.utils.BN(newSellerBalance)

            let price
            price = web3.utils.toWei('1','Ether')
            price = new web3.utils.BN(price)

            console.log(oldSellerBalance, newSellerBalance, price)

            const expectedBalance = oldSellerBalance.add(price)

            assert.equal(newSellerBalance.toString(), expectedBalance.toString())

            //FAILURE: tries to buy a product that does not exist i.e, product id doesn't exist 
            await marketplace.rentHouse(99,{from: buyer, value: web3.utils.toWei('1','Ether')}).should.be.rejected
            //FAILURE: Buyer tries to buy without enough ether
            await marketplace.rentHouse(productCount,{from: buyer, value: web3.utils.toWei('0.5','Ether')}).should.be.rejected
            //FAILURE: Deployer tries to buy the product, i.e., product can't be purchased twice
            await marketplace.rentHouse(productCount,{from: deployer, value: web3.utils.toWei('1','Ether')}).should.be.rejected
            //FAILURE:Buyer tries to buy again, i.e., buyer can't be the seller
            await marketplace.rentHouse(productCount,{from: buyer, value: web3.utils.toWei('1','Ether')}).should.be.rejected
            console.log(results.logs[0].args)
 
         })

         it('returns house', async () => {
            
            //SUCCESS:Rentee returns the House
            const data = await marketplace.returnHouse(productCount, {from: seller})

            const eventData = data.logs[0].args
            console.log(eventData)
            assert.equal(eventData.id.toNumber(),productCount.toNumber(), 'id is correct')
           assert.equal(eventData.price,'1000000000000000000','price is correct')
           assert.equal(eventData.bhk,'2BHK','BHK is correct')
           assert.equal(eventData.location,'HSR Layout','location is correct')
           //assert.equal(event.owner,buyer,'owner is correct')
           assert.equal(eventData.owner,seller,'owner is correct')
           assert.equal(eventData.rentee,0x0,'buyer is correct')
           assert.equal(eventData.purchased,false,'purchased is correct')

 
         })

    })

})