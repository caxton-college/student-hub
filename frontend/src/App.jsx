import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Navbar from './pages/components/Navbar';
import Profile from './pages/Profile';
import Suggestions from './pages/Suggestions';
import Announcements from './pages/Announcements';
import Polls from './pages/Polls';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
	baseURL: 'http://192.168.1.64:8000',
});

document.documentElement.setAttribute('data-theme', 'light');

function App() {
	const [user, setUser] = useState({
		loggedIn: false,
		name: '',
		surname: '',
		email: '',
		role: 0,
		points: 0,
		likes: 0,
	});

	useEffect(() => {
		checkUser();
	}, []); // Empty dependency array ensures it runs only once on mount

	const checkUser = () => {
		
			client.get('/api/get_csrf_token').then(function (response) {
				client.get('/api/user', {
					headers: {
						'X-CSRFToken': response.data.csrfToken,
					},
				}).then(
					function (response) {
						setUser({
							loggedIn: true,
							name: response.data.user.name,
							surname: response.data.user.surname,
							email: response.data.user.email,
							role: response.data.user.role,
							points: response.data.user.points,
							likes: response.data.user.likes,
						});
						
					},
				)
			});
		
	};

	return (
		<>
			<Routes>
				<Route path="/" element={<Profile user={user} setUser={setUser} client={client} />} />
				<Route path="/suggestions" element={<Suggestions user={user} client={client} checkUser={checkUser} which={"popular"}/>}/>
				<Route path="/announcements" element={<Announcements user={user} client={client} />} />
				<Route path="/polls" element={<Polls user={user} client={client} />} />
			</Routes>
			<Navbar />
		</>
	);
}

export default App;
