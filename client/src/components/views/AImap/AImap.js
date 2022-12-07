import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Axios from 'axios'


const InfoButton = styled.button`
	background-color: white;
	color: ${(props) => props.color};
	width: 80px;
	height: 40px;
	position: absolute;
	padding: 0;
	margin: 10px;
	border: 1px solid ${(props) => props.color};
`;

const Container = styled.div`
  margin-left:auto;
  margin-right:auto;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  margin-top: 10px;
  background-color: #FFFFFF;
  flex-direction: column;
  position:relative;
  @media (min-width: 800px) {
    width: 600px;
    height: 94vh;
    /* border:1px solid #95afc0; */
    /* border-left:1px solid #95afc0;
    border-right:1px solid #95afc0; */
  }
`;

const AImap = () => {


	
	const aicontent = useSelector((state) => state.user);
	

	
	useEffect(() => {
		

		let body = {
			ainame: aicontent.aiSuccess.prediction,
			ainame2: aicontent.aiSuccess.prediction1,
			ainame3:aicontent.aiSuccess.prediction2,
		};
		console.log(body)
		/*
		Axios.post('/api/data/aimap',body)
        .then(response => {
            
		
		// 마커 이미지의 이미지 주소입니다
			
			
		});
		*/
	}, []);

	return (
		<Container>
			
			<div
				id="map"
				style={{ width: '90%', height: '70vh', marginLeft: 'auto',marginRight: 'auto',marginTop: '0px', borderRadius: '10px' }}
			>
				<div>
					<React.Fragment>
						hello
					</React.Fragment>
				</div>
			
			</div>

			<br />
			<br />
			<br />
			<br />
		</Container>
	);
};

export default AImap;