import Web3 from 'web3';
import Marketplace from '../contracts/Marketplace.json'

const { Component } = require("react");

 export default class Trade extends Component{

  
    async loadWeb3(){  // chargement de la blockchain
        window.web3=new Web3('HTTP://127.0.0.1:7545');
    }

    async componentWillMount(){
      await this.loadWeb3();
      await this.loadBlockchainData();
     }

     async loadBlockchainData()
     {
      const web3 = window.web3
      //load accounts
      const accounts= await web3.eth.getAccounts();
      this.setState({account:accounts[0]}); // to modify with the right users
      //load smart Contract from complied solidity file
      const networkId= await web3.eth.net.getId()
      const networkData = Marketplace.networks[networkId]
      if(networkData){                                      // check network
        const marketplace = new web3.eth.Contract(Marketplace.abi,networkData.address)  // load the contract 
        console.log(marketplace)
      }
      else {
          window.alert('Marketplace contract not deployed to the detected network')
      }
     }

     constructor(props){
        super(props);
        this.state={
          account:''
        }
     }
  

    render() {
      return (
        <div>
            <nav className='flex-col w-1/6 p-2 h-screen bg-sky-800 text-white'>
                  <h1 className='font-sans font-semibold text-4xl'>Trade Component</h1>
                  <a>account key:{this.state.account}</a>

            </nav>
            
        </div>
      );
    }
}