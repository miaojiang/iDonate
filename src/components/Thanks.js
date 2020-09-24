import React from 'react';
import { Link } from 'react-router-dom';    

export default class Thanks extends React.Component {
	render() {
		return (
			<div className=" container">
				<h3 className="card-title">Thank you for your donations!</h3>
				<hr/>
				<Link to="/"><button className="btn btn-primary float-right" style={{  marginRight: "10px" }}>Back to Home</button></Link>
				<br/><br/><br/>
			</div>
		);
	}
}
