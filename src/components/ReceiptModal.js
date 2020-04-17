import React, { Component } from 'react';
import {Modal, Button} from 'react-bootstrap';
import QRCode from 'qrcode'


 class ReceiptModal extends Component{
    constructor(props){
        super(props);
    }
    
    generateQR(_id,_ipfs,_tx,_from) {
      console.log("hash", _ipfs)
      let payload = JSON.stringify({
          id: _id,
          ipfsHash: _ipfs,
          transactionHash: _tx,
          from: _from
      });
      console.log(payload)
      QRCode.toCanvas(document.getElementById('canvas'), payload, function(error) {
      if (error) console.error(error)
      //console.log('success!')
      })  
      }

    render(){
        return(
            <Modal
      {...this.props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
        Transaction Receipt
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        
          <h6>Transaction Hash:</h6> <p>{this.props.trans}</p>
          <h6>From:</h6><p>{this.props.from}</p>
          <h6>to:</h6><p>{this.props.to} </p>
         <h6>BlockNumber:</h6><p>{this.props.block_no}</p>
         <h6>BlockHash:</h6><p> {this.props.block_hash}</p>
         <h6>Gas Used:</h6><p>{this.props.gas_used}</p>
         <h6>IPFS Hash</h6><p>{this.props.ipfs_hash}</p>
         <hr />
         <div align="center">
              <canvas id="canvas" align="center" />
           </div>
      </Modal.Body>
      <Modal.Footer>
        <button
                         id={this.props.id} 
                         type="button" 
                         className="btn btn-sm btn-outline-primary" 
                         onClick={(event) => {this.generateQR(event.target.id,this.props.ipfs_hash,this.props.trans,this.props.from)}}>
                         SHOW QR CODE
                  </button>
                  <Button variant="danger" onClick={this.props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
        )
    }

}
export default ReceiptModal;