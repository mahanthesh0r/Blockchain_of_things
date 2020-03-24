import React, { Component } from 'react';

class Main extends Component {
    render() {
        return (
            <main role="main" className="flex-shrink-0">
                <div className="container">
                    <h1 className="mt-5">RENT HOUSE</h1>
                     <div className="row">
                    {this.props.products.map((product, key) => {
                        return (
                     <div key={key} className="col-md-4">
                         <div  className="card mb-4 shadow-sm">
                         <svg className="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: Thumbnail"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c" /><text x="50%" y="50%" fill="#eceeef" dy=".3em">Thumbnail</text></svg>
                         <div className="card-body">
                             <p className="card-text"><b>ID:</b> {product.id.toString()}</p>
                             <p className="card-text"><b>Name:</b> {product.name}</p>
                             <p className="card-text"><b>Price:</b> {window.web3.utils.fromWei(product.price.toString(),'Ether')}   ETH</p>
                             <p className="card-text"><b>Number of Rooms:</b> {product.bhk}</p>
                             <p className="card-text"><b>Location:</b> {product.location}</p>
                             <p className="card-text"><b>Owner:</b> {product.owner}</p>
                             <p className="card-text"><b>Rentee:</b> {product.rentee}</p>
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












