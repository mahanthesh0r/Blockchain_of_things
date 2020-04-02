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
      loading: true
    }
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
       
      </div>
    );
  }
}

export default App;
