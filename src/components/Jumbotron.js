import React, { Component } from 'react';



class Jumbotron extends Component {
    render() {
        return (
            <div className="jumbotron">
                <div className="container">
                    <h1 className="display-3">Add House</h1>
                    <div className="container">
                        <form onSubmit={(event) =>{
                            event.preventDefault()
                            const name = this.houseName.value
                            const price = window.web3.utils.toWei(this.housePrice.value.toString(),'Ether')
                            const bhk = this.houseBHK.value
                            const location = this.houseLocation.value
                            this.props.createHouse(name,price,bhk,location) 
                        }}>
                            <div className="form-group">
                                <label >House Name</label>
                                <input type="text" ref={(input) => {this.houseName = input}} className="form-control" id="name" aria-describedby="emailHelp" placeholder="Enter Name" />
                            </div>
                            <div className="form-group">
                                <label >Price Per Day</label>
                                <input type="text" ref={(input) => {this.housePrice = input}} className="form-control" id="price" aria-describedby="emailHelp" placeholder="Enter Price" />
                            </div>
                            <div className="form-group">
                                <label >BHK</label>
                                <input type="text" ref={(input) => {this.houseBHK = input}} className="form-control" id="BHK" aria-describedby="emailHelp" placeholder="Enter BHK" />
                            </div>
                            <div className="form-group">
                                <label >Location</label>
                                <input type="text" ref={(input) => {this.houseLocation = input}} className="form-control" id="location" aria-describedby="emailHelp" placeholder="Enter Location" />
                            </div>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form>

                    </div>


                </div>
            </div>
        );
    }
}

export default Jumbotron;
