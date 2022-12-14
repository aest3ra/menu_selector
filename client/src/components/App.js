import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation} from 'react-router-dom';
import NavBar from './views/NavBar/NavBar';
import Footer from './views/Footer/Footer';
import AIcontent from './views/AIcontent/AIcontent';
import Loading from './views/Loading/Loading';
import AImap from './views/AImap/AImap';
import LandingPage from './views/LandingPage/LandingPage';



function App() {
	
	const [loading, setLoading] = useState(true);
	const location = useLocation();
	
	
	useEffect(() => {
		setTimeout(() => {
			setLoading(false);
		}, 2000);
	}, []);

	if (loading) {
		return <Loading></Loading>;
	}


	return (
		
			<div>
				<NavBar />
				<div style={{ minHeight: 'calc(100vh - 80px)', paddingTop: '50px' }}>
					<Routes>
						<Route path="/" element={<LandingPage />} />
						<Route path="/AIcontent" element={<AIcontent />} />
						<Route path="/AImap" element={<AImap />} />
						
						
					</Routes>
				</div>
				<Footer />
			</div>
		
	);
}

export default App;
