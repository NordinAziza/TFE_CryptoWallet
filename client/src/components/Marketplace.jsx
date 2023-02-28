import Web3 from 'web3';
import Marketplace from '../contracts/Marketplace.json'

const { Component } = require("react");

 export default class Trade extends Component{

  
    async loadWeb3(){  // chargement de la blockchain
        window.web3=new Web3('HTTP://127.0.0.1:7545');
    }

     async loadBlockchainData()
     {
      const web3 = window.web3
      //load accounts
      const accounts= await web3.eth.getAccounts();
      this.setState({account:accounts[4]}); 
      //load smart Contract from complied solidity file
      const networkId= await web3.eth.net.getId()
      const networkData = Marketplace.networks[networkId]
      if(networkData){                                      // check network
        const marketplace = new web3.eth.Contract(Marketplace.abi,networkData.address)  // load the contract 
        this.setState({marketplace})
        
        const productCount= await marketplace.methods.productCount().call()
        this.setState({productCount})
        // load products
        for(var i=1; i<=productCount;i++)
        {
          const product= await marketplace.methods.products(i).call()
          this.setState({
            products:[...this.state.products,product]
            
          })
        }

        this.setState({loading:false})
        console.log(this.state.products)
      }
      else {
          window.alert('Marketplace contract not deployed to the detected network')
      }
     }

     constructor(props){
        super(props);
        this.state={
          account:'',
          productCount:0,
          products:[],
          loading:true
        }
     }

     createProduct=event =>{
      event.preventDefault();
      this.setState({loading:true})
      let productName=event.target.productName.value;
      let productPrice=window.web3.utils.toWei(event.target.productPrice.value.toString(),'Ether')
      this.state.marketplace.methods.createProduct(productName,productPrice).send({from:this.state.account , gas:9000000})
      .once('receipt',(receipt)=>{
        this.setState({loading:false})
      })
     }

     purchaseProduct(id,price){
      this.setState({loading:true})
      console.log(this.state.account)
      this.state.marketplace.methods.purchasedProduct(id).send({from: this.state.account, value: price, gas: 9000000})
      .once('receipt',(receipt)=>{
        this.setState({loading:false})
      })
     }
  

    render() {
      return (
        <div className='flex flex-wrap items-center justify-center bg-[#03001C] text-cyan-300 h-screen font-mono'>
                  <h1 className='w-full text-center text-2xl'>MarketPlace</h1>
                  
                  <div className='w-1/2 flex  flex-wrap justify-center'>
                      
                      <form onSubmit={this.createProduct} className='w-full p-2 '>
                          <h2>Add product</h2>
                          <input type="text" id='productName' placeholder='Product Name' required className='rounded-md py-2 px-3 text-[#301E67] ' />
                          <input type="text" id='productPrice' placeholder='Product Price' required className='rounded-md py-2 px-3 text-[#301E67] '/>
                          <button type="submit" className=' m-2 border w-20 border-cyan-300 rounded-xl  hover:text-[#A459D1] hover:border-[#A459D1]'>Add Product</button>
                      </form>
                      <table className='w-full self-center '>
                        <thead>
                            <tr>
                                <th scope='col'>#</th>
                                <th scope='col'>Name</th>
                                <th scope='col'>price</th>
                                <th scope='col'>Owner</th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.state.products.map((product,key)=>{
                            return(
                                <tr key={key}>
                                  <td scope='row'>{product.id.toString()}</td>
                                  <td>{product.name}</td>
                                  <td>{window.web3.utils.fromWei(product.price.toString(),'Ether')} Eth</td>
                                  <td>{product.owner}</td>
                                  <td>
                                    {!product.purchased
                                       ? <button
                                          className='border w-20 border-cyan-300 rounded-xl  hover:text-[#A459D1] hover:border-[#A459D1]'
                                          name={product.id}
                                          value={product.price}
                                          onClick={(event=>{
                                          this.purchaseProduct(event.target.name,event.target.value)
                                        })}>
                                          Buy
                                      </button>
                                      :null
                                    }
                                  </td>
                                </tr>
                            )
                          })}
                        </tbody>

                      </table>
                  </div>

        </div>
      );
    }
}