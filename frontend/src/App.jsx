import React, { useState, useEffect, useReducer } from 'react';
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
// Fetch the CSRF token on component mount
client.get('/api/get_csrf_token')
.then(response => {
    client.defaults.headers.common['X-CSRFToken'] = response.data.csrfToken;
}) .catch(error => {
    console.error('Error fetching CSRF token:', error);
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
    const [suggestions, setSuggestions] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [polls, setPolls] = useState([]);
	const [userSuggestions, setUserSuggestions] = useState([]);
    const [suggestionsLikeData, setSuggestionsLikeData] = useState({});
    const [pollsOptionsLikeData, setPollsOptionsLikeData] = useState({});

	const checkUser = () => {	
        client.get('/api/user', {
            
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

	};

    function getSuggestions(force=false, newOrder="new") {
		if (suggestions.length === 0 | force) {
			client.get(
				`api/${newOrder}_suggestions`
			).then(function(response) {
				setSuggestions(response.data);
                getSuggestionLikeData(response.data);
				
			})
		}
	}

    function getAnnouncements() {
		if (announcements.length === 0) {
			client.get(
				"api/announcements"
			).then(function(response) {
				setAnnouncements(response.data);
				
			})
		}
	}
    

	function getPolls() {
		if (polls.length === 0) {
			client.get(
				"api/polls"
			).then(function(response) {
				setPolls(response.data);
                getPollsOptionsLikeData(response.data);
			})
		}
	}

	
    function getUserSuggestions() {
       
        client.get("api/user_suggestions")
        .then(function (response) {
            setUserSuggestions(response.data);
            
        });


        
    }


    function getPollsOptionsLikeData(pollsData) {
        let newPollsOptionsLikeData = {};
       
        let i = 0;
        pollsData.forEach(poll => {
            let optionsLikeData = {};
            
            poll.options.forEach(option => {
                let optionLikeData = {}
                optionLikeData["likes"] = option.likes;
                optionLikeData["liked"] = option.liked

                optionsLikeData[option.id] = optionLikeData;
            })
            newPollsOptionsLikeData[i] = optionsLikeData;
            i++;
        })
        setPollsOptionsLikeData(newPollsOptionsLikeData);
        
    }

    function getSuggestionLikeData(suggestionData) {
        
        let newSuggestionLikeData = {}
        suggestionData.forEach((suggestion) => {
            newSuggestionLikeData[suggestion.id] = {
                liked: suggestion.liked,
                likes: suggestion.likes
            }
        }) 
            
        
        setSuggestionsLikeData(newSuggestionLikeData);
    }

    useEffect(() => {
		checkUser();
        getSuggestions();
        getAnnouncements();
        getPolls();
        
        getUserSuggestions();
       
        
            
	}, []);

	return (
		<>
          
			<Routes>
				<Route path="/" element={
                    <Profile 
                        user={user} 
                        checkUser={checkUser} 
                        client={client} 
                        userSuggestions={userSuggestions}
                        setUser={setUser}/>}
                        
                    />
				<Route path="/suggestions" element={
                    <Suggestions 
                        user={user} 
                        client={client} 
                        checkUser={checkUser} 
                        which={"new"}
                        suggestions={suggestions}
                        getSuggestions={getSuggestions}
                        suggestionsLikeData={suggestionsLikeData}
                        setSuggestionsLikeData={setSuggestionsLikeData}
                    />
                }/>

				<Route path="/announcements" element={
                    <Announcements 
                        user={user} 
                        client={client} 
                        announcements={announcements}
                    />
                }/>
				<Route path="/polls" element={
                    <Polls 
                        user={user} 
                        client={client} 
                        polls={polls}
                        checkUser={checkUser}
                        pollsOptionsLikeData={pollsOptionsLikeData}
                        setPollsOptionsLikeData={setPollsOptionsLikeData}
                    />
                    
                }/>
			</Routes>
			<Navbar />
		</>
	);
}

export default App;
