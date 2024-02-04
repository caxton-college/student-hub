import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import axios, { all } from 'axios';
import Navbar from './pages/components/Navbar';

// Toast: Info pop-ups
import { ToastContainer } from 'react-toastify';

import Profile from './pages/Profile';
import Suggestions from './pages/Suggestions';
import Announcements from './pages/Announcements';
import Polls from './pages/Polls';
import Rewards from './pages/Rewards';

// Axios settings for authentication
axios.defaults.xsrfCookieName = 'X-CSRFToken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

      
const client = axios.create({
    baseURL: `http://${window.location.hostname}:8000`, // Constructing the baseURL dynamically
});

// Fetch the CSRF token
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
	});

    const [suggestions, setSuggestions] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [polls, setPolls] = useState([]);
	const [userSuggestions, setUserSuggestions] = useState([]);
    const [suggestionsLikeData, setSuggestionsLikeData] = useState({});
    const [pollsOptionsLikeData, setPollsOptionsLikeData] = useState({});
    const [theme, setTheme] = useState('light'); 
    const [allRewards, setAllRewards] = useState([]);
    const [userRewards, setUserRewards] = useState([]);

    // Check if the user is logged in, if no error, user authenticated
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
                    userSuggestions: response.data.user.user_suggestions,
                    user_id: response.data.user.user_id,
                    rewards_id: response.data.user.user_id // ID of the user for which to show rewards (always user_id unless role = teacher)
                });
                
            },
        )

	};


    // Get suggestion with a given order
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


    // Get all announcements
    function getAnnouncements(force) {
		if (announcements.length === 0 | force) {
			client.get(
				"api/announcements"
			).then(function(response) {
				setAnnouncements(response.data);
				
			})
		}
	}
    
    // Get all polls
	function getPolls(force) {
		if (polls.length === 0 | force) {
			client.get(
				"api/polls"
			).then(function(response) {
				setPolls(response.data);
                getPollsOptionsLikeData(response.data);
			})
		}
	}

	// Get suggestion made by the current user (not currently in use)
    function getUserSuggestions() {
       
        client.get(
            "api/user_suggestions"
            ).then(function (response) {
            setUserSuggestions(response.data);
        });


        
    }

    // Set a state with poll like data (allows the maintenance of the visual state)
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

    // Set a state with Suggestion like data (allows the maintenance of the visual state)
    function getSuggestionLikeData(suggestionData) {
        
        let newSuggestionLikeData = {}
        suggestionData.forEach((suggestion) => {
            newSuggestionLikeData[suggestion.id] = {
                liked: suggestion.liked,
                likes: suggestion.likes,
                pinned: suggestion.pinned
            }
        }) 
            
        
        setSuggestionsLikeData(newSuggestionLikeData);
    }

   

    function getUserRewards() {
        // Fetch data when the component mounts
        client.get(`/api/user_rewards?user=${user.rewards_id}`)
        .then(function (response) {
            setUserRewards(response.data);
        })
        .catch(error => {
            console.error("Error fetching rewards:", error);
        });
    }

    

    function getAllRewards() {

        if (allRewards.length === 0) {
            // Fetch data when the component mounts
            client.get(`/api/all_rewards`)
            .then(function (response) {
                setAllRewards(response.data);
            })
            .catch(error => {
                console.error("Error fetching rewards:", error);
            });
        }
        
    }

    useEffect(() => {
        getUserRewards();
    }, [user.rewards_id]);


    useEffect(() => {
		checkUser();
        getSuggestions();
        getAnnouncements();
        getPolls();
        getAllRewards();
            
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
                        setUser={setUser}
                        theme={theme}
                        setTheme={setTheme}
                    />
                }/>
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
                        theme={theme}
                        setTheme={setTheme}
                    />
                }/>

				<Route path="/announcements" element={
                    <Announcements 
                        user={user} 
                        client={client} 
                        announcements={announcements}
                        getAnnouncements={getAnnouncements}
                        theme={theme}
                        setTheme={setTheme}
                    />
                }/>
				<Route path="/polls" element={
                    <Polls 
                        user={user} 
                        client={client} 
                        polls={polls}
                        checkUser={checkUser}
                        getPolls={getPolls}
                        pollsOptionsLikeData={pollsOptionsLikeData}
                        setPollsOptionsLikeData={setPollsOptionsLikeData}
                        theme={theme}
                        setTheme={setTheme}
                    />
                }/>

                <Route path="/rewards" element={
                    <Rewards 
                        user={user}
                        client={client}
                        rewards={userRewards}
                        theme={theme}
                        setTheme={setTheme}
                        type={"view"}
                        getAllRewards={getAllRewards}
                        getUserRewards={getUserRewards}
                        checkUser={checkUser}
                    />
                }/>

                <Route path="/shop" element={
                    <Rewards 
                        user={user}
                        client={client}
                        rewards={allRewards}
                        theme={theme}
                        setTheme={setTheme}
                        type={"shop"}
                        getAllRewards={getAllRewards}
                        getUserRewards={getUserRewards}
                        checkUser={checkUser}
                    />
                }/>

			</Routes>

			<Navbar />
            
            <ToastContainer
                position="top-right"
                autoClose={300000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={document.documentElement.getAttribute('data-theme')}
            />
		</>
	);
}

export default App;
