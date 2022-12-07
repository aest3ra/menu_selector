import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const LandingPage = () => {
	

	useEffect(() => {
		

		
		/*
		Axios.get('/api/data/seoulsmap').then((response) => {
		});	
		*/
	}, []);

	return (
	
			
			
			<div
				id="map"
				style={{ width: '90%', height: '70vh', marginLeft: 'auto',marginRight: 'auto',marginTop: '0px', borderRadius: '10px' }}
			>
				<div>
					<React.Fragment>						
						메인
					</React.Fragment>
				</div>
			</div>

	);
};

export default LandingPage;