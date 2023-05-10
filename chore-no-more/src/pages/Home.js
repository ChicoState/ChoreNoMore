import React from "react";
import '../App.css';
import Popup from "../components/Popup";
import { useState } from 'react';

function Home() {
    const [buttonPopup, setButtonPopup] = useState(false);

    async function popup(props){

    }

    return(
        <div>
            <div class='chores-display'>
                <div class='header'>
                    <h2>Chores</h2>
                </div>
                <div class='footer'>
                    <button id='addChore' onClick={() => setButtonPopup(true)}>Add Chores</button>
                    <div class='divider' />
                    <button id='assignChore' onClick={() => setButtonPopup(true)}>Assign Chores</button>
                </div>
            </div>
            <Popup trigger={buttonPopup} setTrigger={setButtonPopup}> 
                <h3>Add Chores</h3>
            </Popup>

            <div class='users-display'>
                <div class='header'>
                    <h2>Members</h2>
                </div>
                <div class='footer'>
                    <button id='addMember' onClick={() => setButtonPopup(true)}>Add Member</button>
                    <div class='divider' />
                    <button id='manageHouse' onClick={() => setButtonPopup(true)}>Manage Household</button>
                </div>
            </div>
        </div>
    );
}

export default Home;