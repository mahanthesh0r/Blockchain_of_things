import React, { Component } from 'react';
import QRCode from 'qrcode'
import ipfs from './ipfs';


class Main extends Component {

    constructor(props){
        super(props)
        this.state = {
     //ipfs
      ipfsHash: null,
     
     }
    this.captureFile = this.captureFile.bind(this);
    this.onSub= this.onSub.bind(this);
    }

    generateQR(_id) {
        let payload = JSON.stringify({
            id: _id,
            rentee: this.props.account.toString()
        });
        console.log(payload)
        QRCode.toCanvas(document.getElementById('canvas'), payload, function(error) {
        if (error) console.error(error)
        //console.log('success!')
        })  
        }

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

        onSub = async(event) => {
            if(event) event.preventDefault();
                 //bring in user's metamask account address
                // const accounts = await web3.eth.getAccounts();
            
             console.log('Sending from Metamask account: ' + this.props.account);
         
             //obtain contract address from storehash.js
             //const ethAddress= await storehash.options.address;
             //this.setState({ethAddress});
         
             //save document to IPFS,return its hash#, and set hash# to state
             //https://github.com/ipfs/js-ipfs/tree/master/packages/ipfs-http-client
             for await (const file of ipfs.add(this.state.buffer)) {
                 this.setState({ipfsHash: file.path})
               console.log(this.state.ipfsHash)
             }
             this.props.sendHash(this.state.ipfsHash)
        }; //onSubmit 


    render() {
        return (
            <main role="main" className="flex-shrink-0">
                <div className="container">
                    <h1 className="mt-5">RENT HOUSE</h1>
                    <div align="center">
                         <canvas id="canvas" align="center" />
                         </div>
                     <div className="row">
                    {this.props.products.map((product, key) => {
                        return (
                     <div key={key} className="col-md-4">
                         <div  className="card mb-4 shadow-sm">
                               
                         <div className="card-body">
                             <p className="card-text"><b>ID:</b> {product.id.toString()}</p>
                             <p className="card-text"><b>Name:</b> {product.name}</p>
                             <p className="card-text"><b>Price:</b> {window.web3.utils.fromWei(product.price.toString(),'Ether')}   ETH</p>
                             <p className="card-text"><b>Number of Rooms:</b> {product.bhk}</p>
                             <p className="card-text"><b>Location:</b> {product.location}</p>
                             <p className="card-text"><b>Owner:</b> {product.owner}</p>
                             <p className="card-text"><b>Rentee:</b> {product.rentee}</p>
                             {(product.purchased) && (this.props.account === product.rentee)
                         ? <div>
                             <button
                         name={product.id} 
                         address={product.rentee}
                         
                         type="button" 
                         className="btn btn-sm btn-outline-primary" 
                         onClick={(event) => {this.generateQR(event.target.name)}}>
                         SHOW QR CODE
                  </button>
                  <hr/>
                  <h3> Upload your Aadhaar card </h3>
          <form onSubmit={this.onSub}>
            <input 
              type = "file"
              onChange = {this.captureFile}
            />
            <p>  </p>
             <button 
             className="btn btn-sm btn-outline-primary"  
             type="submit">
             Upload
             </button>
          </form>
          <hr/>
            <button type="button" onClick={(event) => {this.props.onGetReceipt()}}> Get Transaction Receipt </button>
            
                  </div>
                         : null
                     }
                             <div className="d-flex justify-content-between align-items-center">
                                 <div className="btn-group">
                                    {!product.purchased 
                                     ? <button 
                                            name={product.id} 
                                            value={product.price} 
                                            type="button" 
                                            className="btn btn-sm btn-outline-primary" 
                                            onClick={(event) => {this.props.rentHouse(event.target.name, event.target.value)     
                                                }}>
                                            RENT
                                     </button>
                                     :null 
                                    }
                                 </div>
                                 <div className="btn-group">
                                    {(product.purchased) && (this.props.account === product.owner) 
                                     ? <button 
                                            name={product.id} 
                                            type="button" 
                                            className="btn btn-sm btn-outline-primary" 
                                            onClick={(event) => {this.props.returnHouse(event.target.name)       
                                            }}>
                                            RETURN
                                     </button>
                                     
                                     :null
                                    }
                                 </div>
                             </div>
                         </div>
                     </div>
                    </div>
                        )
                    })}
                    </div>      
                </div>
            </main>
        );
    }
   
}


export default Main;












