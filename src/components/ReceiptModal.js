import React, { Component } from 'react';
import {Modal, Button} from 'react-bootstrap';


 class ReceiptModal extends Component{
    constructor(props){
        super(props);
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
        
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={this.props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
        )
    }

}
export default ReceiptModal;