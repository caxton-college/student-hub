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
import Search from './pages/Search';
import Activate from './pages/Activate';
import Disabled from './pages/Disabled';
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
    const [theme, setTheme] = useState('light'); 
    const [allRewards, setAllRewards] = useState([]);
    const [userRewards, setUserRewards] = useState([]);
    const [selected, setSelected] = useState(window.location.pathname);

    const [isAccessible, setIsAccessible] = useState(true);

    // Check if the user is logged in, if no error, user authenticated
	const checkUser = () => {	
        client.get('/api/user', {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }

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
                
                getPolls(true);
                getAnnouncements(true);
                getSuggestions(true);
            },
        )

	};

    function setRewardsId(id, name) {
        setUser({
            loggedIn: true,
            name: user.name,
            surname: user.surname,
            email: user.email,
            role: user.role,
            points: user.points,
            likes: user.likes,
            userSuggestions: user.user_suggestions,
            user_id: user.user_id,
            rewards_id: id, // ID of the user for which to show rewards (always user_id unless role = teacher)
            rewards_name: name
        });
    }

    // Get suggestion with a given order
    function getSuggestions(force=false, newOrder="new") {
		if (suggestions.length === 0 | force) {
            if(user.loggedIn) {
                client.get(
                    `api/${newOrder}_suggestions`,
                    {
                        headers: {
                            'Authorization': `Token ${localStorage.getItem('token')}`
                        }
                    }
                ).then(function(response) {
                    setSuggestions(response.data);
                    getSuggestionLikeData(response.data);
                    
                })
            } else {
                client.get(
                    `api/${newOrder}_suggestions`
                ).then(function(response) {
                    setSuggestions(response.data);
                    getSuggestionLikeData(response.data);
                    
                })
            }
			
		}
	}


    // Get all announcements
    function getAnnouncements(force) {
		if (announcements.length === 0 | force) {

            if (user.loggedIn) {
                client.get(
                    "api/announcements",
                    {
                        headers: {
                            'Authorization': `Token ${localStorage.getItem('token')}`
                        }
                    }
                ).then(function(response) {
                    setAnnouncements(response.data);
                    
                })
            } else {
                client.get(
                    "api/announcements"
                ).then(function(response) {
                    setAnnouncements(response.data);
                    
                })
            }
			
		}
	}
    
    // Get all polls
	function getPolls(force) {
		if (polls.length === 0 | force) {
            if(localStorage.getItem('token')) {
                client.get(
                    "api/polls",
                    {
                        headers: {
                            'Authorization': `Token ${localStorage.getItem('token')}`
                        }
                    }
                ).then(function(response) {
                    setPolls(response.data);
                })

            } else {
                client.get(
                    "api/polls"
                ).then(function(response) {
                    setPolls(response.data);
                })
            }
			
		}
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
        if(!user.loggedIn) {
            return;
        }

        // Fetch data when the component mounts
        client.get(`/api/user_rewards?user=${user.rewards_id}`,
        {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
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
            client.get(`/api/all_rewards`,
            {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            })
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
    }, [user]);


    useEffect(() => {
		checkUser();
        getSuggestions();
        getAnnouncements();
        getPolls();
        getAllRewards();

        const checkTime = () => {            
            // Disable P1 and P2: between 9:40 and 11:30            
            if (isTimeWithinRange(9, 40, 11, 35) || isTimeWithinRange(12, 0, 13, 35) || isTimeWithinRange(14, 50, 16, 30)) {
                setIsAccessible(false);
            } else {
                setIsAccessible(true);
            }
          };
      
        checkTime();
        // Optionally set an interval to check the time every minute
        const interval = setInterval(checkTime, 10000);
    
        // Clean up the interval when the component unmounts
        return () => clearInterval(interval);
            
	}, []);

    function isTimeWithinRange(startHour, startMinutes, endHour, endMinutes) {
        const currentTime = new Date().getHours() * 60 + new Date().getMinutes();
        const startTime = startHour * 60 + startMinutes;
        const endTime = endHour * 60 + endMinutes;
    
        // Handle cases where the range crosses midnight (e.g., 23:00 to 01:00)
        if (startTime <= endTime) {
            return currentTime >= startTime && currentTime <= endTime;
        } else {
            return currentTime >= startTime || currentTime <= endTime;
        }
    }

	return (
		<>
            {isAccessible ? (
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
                                selected={selected}
                                setSelected={setSelected}
                                
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
                                checkUser={checkUser}
                                polls={polls} 
                                setPolls={setPolls}
                                getPolls={getPolls}
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

                        <Route path="/search" element={
                            <Search 
                                user={user}
                                client={client}
                                rewards={allRewards}
                                theme={theme}
                                setTheme={setTheme}
                                setRewardsId={setRewardsId}
                            />
                        }/>
                        <Route path="/activate" element={
                            <Activate 
                                user={user}
                                client={client}
                            />
                        }/>

                    </Routes>

                    <Navbar 
                        selected={selected}
                        setSelected={setSelected}
                    />
                    
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
        ) : (
            <Disabled />

        )}
		</>
        
	);
}

export default App;
