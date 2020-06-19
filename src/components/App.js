import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3'
import Marketplace from '../abis/Marketplace.json'
import Navbar from './Navbar'
import Jumbotron from './Jumbotron'
import Main from './Main'





class App extends Component {

  

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockChainData()
    
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockChainData() {
    const web3 = window.web3
    //Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkID = await web3.eth.net.getId()
    const networkData = Marketplace.networks[networkID]
    if (networkData) {
      const marketplace = web3.eth.Contract(Marketplace.abi, networkData.address)
      const productCount = await marketplace.methods.productCount().call()
      this.setState({productCount})
      //Load products
      for(var i =1; i <= productCount; i++){
        const product = await marketplace.methods.houses(i).call()
        this.setState({
          products: [...this.state.products,product]
        })
      }
      console.log(productCount.toString())
      console.log(this.state.products)
      
      this.setState({ marketplace })
      this.setState({ loading: false })
    } else {
      window.alert('Marketplace contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      productCount: 0,
      products: [],
      loading: true,
      //ipfs
      transactionHash: '',
      buffer:'',
      ethAddress:'',
      blockNumber:'',
      gasUsed:'',
      from:'',
      to:'',
      blockHash:'',
      txReceipt: ''   
      
    }

    this.createHouse = this.createHouse.bind(this)
    this.rentHouse = this.rentHouse.bind(this)
    this.returnHouse = this.returnHouse.bind(this)
    this.sendHash = this.sendHash.bind(this)
    this.getHash = this.getHash.bind(this)
    this.verifyQR = this.verifyQR.bind(this)
  }

  onGetReceipt = async () => {
    const web3 = window.web3
    try{
        this.setState({blockNumber:"waiting.."});
        this.setState({gasUsed:"waiting..."});
        this.setState({blockHash: "waiting.."});
        this.setState({from: "waiting.."});
        this.setState({to: "waiting..."});
       // console.log(this.state.blockNumber)

        // get Transaction Receipt in console on click
        // See: https://web3js.readthedocs.io/en/1.0/web3-eth.html#gettransactionreceipt
        await web3.eth.getTransactionReceipt(this.state.transactionHash, (err, txReceipt)=>{
          console.log(err,txReceipt);
          this.setState({txReceipt});
        }); //await for getTransactionReceipt

        await this.setState({blockNumber: this.state.txReceipt.blockNumber});
        await this.setState({gasUsed: this.state.txReceipt.gasUsed});  
        await this.setState({blockHash: this.state.txReceipt.blockHash});
        await this.setState({from: this.state.txReceipt.from});
        await this.setState({to: this.state.txReceipt.to});
        console.log(this.state.blockNumber) 
      } //try
    catch(error){
        console.log(error);
      } //catch
  } //onClick

  createHouse(name,price,bhk,location) {
    this.setState({loading:true})
    this.state.marketplace.methods.createHouse(name,price,bhk,location).send({from: this.state.account})
    .once('receipt', (receipt) => {
      this.setState({loading:false})
    })
  }

  rentHouse(id,price,NumofDays) {
    this.setState({loading:true})
    var totalPrice = price*NumofDays
    console.log(totalPrice)
    
    this.state.marketplace.methods.rentHouse(id).send({from: this.state.account, value: totalPrice})
    .once('receipt', (receipt) => {
      this.setState({loading:false})
    })
  }

  returnHouse(id) {
    this.setState({loading:true})
    this.state.marketplace.methods.returnHouse(id).send({from: this.state.account})
    .once('receipt', (receipt) => {
      this.setState({loading:false})
    })
  }

  sendHash(id,ipfsHash){
    this.state.marketplace.methods.sendHash(id,ipfsHash).send({from: this.state.account}, (error, transactionHash) => {
                 console.log(transactionHash);
                 this.setState({transactionHash});
                this.getHash(1)
               }); 
  }
  getHash(id){
    this.state.marketplace.methods.getHash(id).call({from: this.state.account}, function(error,res){
     console.log("getHash: ", res)
   })
   this.verifyQR(1,this.state.account)
      
    
  }

  verifyQR(id,verifyRentee){
    this.state.marketplace.methods.verifyQR(id,verifyRentee).call({from: this.state.account},function(error,res){
      console.log("VerifyRentee: ", res)
    })
   
    
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
       <Jumbotron createHouse={this.createHouse}/>
       {this.state.loading ? <div id="loading" className="text-center"><p className="text-center">Loading...</p> </div>
       :<Main products={this.state.products}  
              rentHouse={this.rentHouse}  
              returnHouse={this.returnHouse} 
              account={this.state.account} 
              sendHash={this.sendHash}
              transactionHash={this.state.transactionHash}
              blockNumber={this.state.blockNumber}
              blockHash={this.state.blockHash}
              gasUsed={this.state.gasUsed}
              from={this.state.from}
              to={this.state.to}
              onGetReceipt={this.onGetReceipt}
             
               /> }
               
              
      </div>
    );
  }
}

export default App;
