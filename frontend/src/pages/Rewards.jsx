import React, { useState, useEffect } from 'react';

import UserReward from './components/UserReward';
import Header from "./components/Header";

export default function Rewards({ client, user, rewards, theme, setTheme }) {
  

  return (
        <>
        <Header 
            page={"Rewards"}
            theme={theme}
            setTheme={setTheme}/>

        <div id='rewards'>
            {
                rewards.map((reward, i) => (
                    <UserReward 
                    client={client}
                    user={user}
                    name={reward.name}
                    cost={reward.cost}
                    id={reward.id}
                    action={"sell"}
                    key={i}/>
                ))
            }
            {
                rewards.map((reward, i) => (
                    <UserReward 
                    client={client}
                    user={user}
                    name={reward.name}
                    cost={reward.cost}
                    id={reward.id}
                    action={"sell"}
                    key={i}/>
                ))
            }
            {
                rewards.map((reward, i) => (
                    <UserReward 
                    client={client}
                    user={user}
                    name={reward.name}
                    cost={reward.cost}
                    id={reward.id}
                    action={"sell"}
                    key={i}/>
                ))
            }
            {
                rewards.map((reward, i) => (
                    <UserReward 
                    client={client}
                    user={user}
                    name={reward.name}
                    cost={reward.cost}
                    id={reward.id}
                    action={"sell"}
                    key={i}/>
                ))
            }
            {
                rewards.map((reward, i) => (
                    <UserReward 
                    client={client}
                    user={user}
                    name={reward.name}
                    cost={reward.cost}
                    id={reward.id}
                    action={"sell"}
                    key={i}/>
                ))
            }
            {
                rewards.map((reward, i) => (
                    <UserReward 
                    client={client}
                    user={user}
                    name={reward.name}
                    cost={reward.cost}
                    id={reward.id}
                    action={"sell"}
                    key={i}/>
                ))
            }

        </div>
        </>
       
  );
}
