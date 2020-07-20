import React, { Component } from 'react';
import ipfs from './ipfs';
import {Button,ButtonToolbar} from 'react-bootstrap';
import ReceiptModal from './ReceiptModal';
import * as ml5 from 'ml5'

let classifier;
class Main extends Component {


    constructor(props){
        super(props)
        this.imgRef = React.createRef();
        this.state = {
            addModalShow:false,
            //ipfs
             ipfsHash: null,
             productID: null,
             NumOfDays: 1,
             pic: '',
             documentId: {type: '',loaded: false}
             
     
     }
    this.captureFile = this.captureFile.bind(this);
    this.onSub= this.onSub.bind(this);
    this.doDecrement = this.doDecrement.bind(this);
    this.doIncrement = this.doIncrement.bind(this);
    this.classifyDoc = this.classifyDoc.bind(this);
    this.gotResults = this.gotResults.bind(this);
    }

    componentDidMount(){
        const url = 'https://teachablemachine.withgoogle.com/models/p3y2_Uyuj/'
        classifier = ml5.imageClassifier(url + 'model.json',() =>{
            console.log("ML5 loaded")
        });
    }

   async classifyDoc(img){
        if(classifier){
            classifier.classify(img, this.gotResults);
        }
       
    }

    gotResults(err, results) {
        if(err){
            console.log(err)
        }
        this.setState({documentId:{
            ...this.state.documentId,
            type: results[0].label,
            loaded: true
        }})
        
    }

     

      

    doDecrement(event){
        event.preventDefault()
        if(this.state.NumOfDays > 1){
            this.setState({ NumOfDays: this.state.NumOfDays -1});
        } else {
            this.setState({NumOfDays: 1});
        }
    }

    doIncrement(event){
        event.preventDefault()
        if(this.state.NumOfDays){
            this.setState({NumOfDays: this.state.NumOfDays + 1})
        } else {
            this.setState({NumOfDays: 1});
        }
    }

    handleChange(event){
        this.setState({NumOfDays: event.target.value})
    }

    

         captureFile(event){
            event.stopPropagation()
            event.preventDefault()
            const file = event.target.files[0]
            const ImgData = URL.createObjectURL(event.target.files[0])
            this.setState({pic:ImgData})
            let reader = new window.FileReader()
            reader.readAsArrayBuffer(file)
            reader.onloadend = () => {
              this.setState({buffer:Buffer(reader.result)})
              const imgPreview = document.getElementById('imgP')
              this.classifyDoc(imgPreview)
            }
          };

        onSub = async(event) => {
            if(event) event.preventDefault();
                 //bring in user's metamask account address
                // const accounts = await web3.eth.getAccounts();
            
             console.log('Sending from Metamask account: ' + this.props.account);
             console.log(this.state.productID)
         
         
             //save document to IPFS,return its hash#, and set hash# to state
             //https://github.com/ipfs/js-ipfs/tree/master/packages/ipfs-http-client
             for await (const file of ipfs.add(this.state.buffer)) {
                 this.setState({ipfsHash: file.path})
               console.log(this.state.ipfsHash)
             }
             this.props.sendHash(this.state.productID,this.state.ipfsHash)
        }; //onSubmit 


    render() {
        let addModalClose =() => this.setState({addModalShow:false})
        return (
            <main role="main" className="flex-shrink-0">
                <div className="container">
                    <h1 className="mt-5">RENT HOUSE</h1>
                   
                     <div className="row">
                    {this.props.products.map((product, key) => {
                        return (
                     <div key={key} className="col-md-4">
                         <div  className="card mb-4 shadow-sm">
                               
                         <div className="card-body">
                             <p className="card-text"><b>ID:</b> {product.id.toString()}</p>
                             <p className="card-text"><b>Name:</b> {product.name}</p>
                             <p className="card-text"><b>Price Per Day:</b> {window.web3.utils.fromWei(product.price.toString(),'Ether')}   ETH</p>
                             <p className="card-text"><b>Number of Rooms:</b> {product.bhk}</p>
                             <p className="card-text"><b>Location:</b> {product.location}</p>
                             <p className="card-text"><b>Owner:</b> {product.owner}</p>
                             <p className="card-text"><b>Rentee:</b> {product.rentee}</p>
                             {(product.purchased) && (this.props.account === product.rentee)
                         ? <div>
                             
                  <hr/>
                  <h3> Upload your ID </h3>
          <form onSubmit={this.onSub}>
            <input 
              type = "file"
              onChange = {this.captureFile}
              ref={this.imgRef}
            />
            {this.state.pic ? (
                <img
                src={this.state.pic}
                style={{width: 200, height: 100}}
                ref={this.imgRef}
                id="imgP"
                />
             ): null
        }
        {this.state.documentId.loaded 
        ? <p className="mt-2">Document Uploaded: <b>{this.state.documentId.type}</b></p>
        :null }
            
            <p> </p>
             <button 
             className="btn btn-sm btn-outline-primary"  
             type="submit"
             onClick={(event)=>{this.setState({productID:product.id})}}>

             Upload
             </button>
          </form>
          <hr/>
           <ButtonToolbar>
               <Button 
               variant='primary'
               onClick={(event) =>{ this.props.onGetReceipt(); this.setState({addModalShow:true});}}>Get Receipt</Button>
               <ReceiptModal 
               show={this.state.addModalShow}
               onHide={addModalClose}
               id={product.id}
               trans={this.props.transactionHash}
               block_no={this.props.blockNumber}
               block_hash={this.props.blockHash}
               from={this.props.from}
               to={this.props.to}
               gas_used={this.props.gasUsed}
               ipfs_hash={this.state.ipfsHash}
               
               />
           </ButtonToolbar>
                  </div>
                         : null
                     }
                             <div className="d-flex justify-content-between align-items-center">
                                 <div className="btn-group">
                                    {!product.purchased && !(this.props.account === product.owner)
                                     ? <div> 
                                    <p className="card-text"><b>Number of days:</b>  </p>  
                                     <div className="input-group"> 
                                     <input type="button" value="-" onClick={this.doDecrement} className="button-minus" data-field="quantity"></input>
                                     <input type="number" step="1" max="" value={this.state.NumOfDays} onChange={this.handleChange} name="quantity" className="quantity-field"></input>
                                     <input type="button" value="+" onClick={this.doIncrement} className="button-plus" data-field="quantity"></input>
                                     </div>
                                   
                                     <button 
                                            name={product.id} 
                                            value={product.price} 
                                            type="button" 
                                            className="btn btn-sm btn-outline-primary" 
                                            onClick={(event) => {this.props.rentHouse(event.target.name, event.target.value,this.state.NumOfDays)     
                                                }}>
                                            RENT
                                     </button>
                                     </div>
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












