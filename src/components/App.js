import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3'
import Marketplace from '../abis/Marketplace.json'
import Navbar from './Navbar'
import Jumbotron from './Jumbotron'
import Main from './Main'
import ipfs from './ipfs';


class App extends Component {

  async componentDidMount(){
    console.log(ipfs.id())
  }

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
      ipfsHash:null,
      buffer:'',
      ethAddress:'',
      blockNumber:'',
      transactionHash:'',
      gasUsed:'',
      txReceipt: ''   
    }

    this.captureFile = this.captureFile.bind(this);
    this.onSub= this.onSub.bind(this);
   

    this.createHouse = this.createHouse.bind(this)
    this.rentHouse = this.rentHouse.bind(this)
    this.returnHouse = this.returnHouse.bind(this)
    //this.verifyOwnership = this.verifyOwnership.bind(this)
  }

  createHouse(name,price,bhk,location) {
    this.setState({loading:true})
    this.state.marketplace.methods.createHouse(name,price,bhk,location).send({from: this.state.account})
    .once('receipt', (receipt) => {
      this.setState({loading:false})
    })
  }

  rentHouse(id,price) {
    this.setState({loading:true})
    this.state.marketplace.methods.rentHouse(id).send({from: this.state.account, value: price})
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

  // verifyOwnership(id,rentee){
  //   var verify = this.state.marketplace.methods.verifyOwnership(id,rentee).send({from: this.state.account})
  //   console.log(verify);
  // }


  captureFile(event){
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]
    let reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({buffer:Buffer(reader.result)})
      console.log('buffer',this.state.buffer)
    }
  };


  onGetReceipt = async () => {

    try{
        this.setState({blockNumber:"waiting.."});
        this.setState({gasUsed:"waiting..."});

        // get Transaction Receipt in console on click
        // See: https://web3js.readthedocs.io/en/1.0/web3-eth.html#gettransactionreceipt
        await Web3.eth.getTransactionReceipt(this.state.transactionHash, (err, txReceipt)=>{
          console.log(err,txReceipt);
          this.setState({txReceipt});
        }); //await for getTransactionReceipt

        await this.setState({blockNumber: this.state.txReceipt.blockNumber});
        await this.setState({gasUsed: this.state.txReceipt.gasUsed});   
        console.log(this.state.blockNumber) 
      } //try
    catch(error){
        console.log(error);
      } //catch
  } //onClick

  onSub = async(event) => {
   if(event) event.preventDefault();
    console.log("0nSub called")

    //bring in user's metamask account address
  // const accounts = await web3.eth.getAccounts();
   
    console.log('Sending from Metamask account: ' + this.state.account);

    //obtain contract address from storehash.js
    //const ethAddress= await storehash.options.address;
    //this.setState({ethAddress});

    //save document to IPFS,return its hash#, and set hash# to state
    //https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add 
    for await (const file of ipfs.add(this.state.buffer)) {
      console.log(file.path)
    }
    
  //   ipfs.add("this.state.buffer",(error,result) => {
  //   if(error){
  //     console.error(error)
  //     return
  //   }
    
  //   this.setState({ ipfsHash: result[0].hash})
  //   return console.log('ipfsHash',this.state.ipfsHash)
  //  })
     
      
      //setState by setting ipfsHash to ipfsHash[0].hash 
      

      // call Ethereum contract method "sendHash" and .send IPFS hash to etheruem contract 
      //return the transaction hash from the ethereum contract
      //see, this https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#methods-mymethod-send
      
      /*storehash.methods.sendHash(this.state.ipfsHash).send({
        from: accounts[0] 
      }, (error, transactionHash) => {
        console.log(transactionHash);
        this.setState({transactionHash});
      }); //storehash */ 
      
     //await ipfs.add
    
  }; //onSubmit 

  


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
             // verifyOwnership = {this.verifyOwnership}
               /> }
               
               <h3> Choose file to send to IPFS </h3>
          <form onSubmit={this.onSub}>
            <input 
              type = "file"
              onChange = {this.captureFile}
            />
             <button 
             bsstyle="primary" 
             type="submit"> 
             Send it 
             </button>
          </form>
          <hr/>
            <button onClick = {this.onGetReceipt}> Get Transaction Receipt </button>
      </div>
    );
  }
}

export default App;
