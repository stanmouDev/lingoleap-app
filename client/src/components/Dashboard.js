
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [decks, setDecks] = useState([]);
    const [deckName, setDeckName] = useState('');

    useEffect(() => {
        const fetchDecks = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('http://localhost:3001/api/decks', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setDecks(response.data);
                } catch (error) {
                    console.error('Error fetching decks', error);
                }
            }
        };
        fetchDecks();
    }, []);

    const handleCreateDeck = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post('http://localhost:3001/api/decks', 
                { name: deckName }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setDecks([...decks, response.data]);
            setDeckName('');
        } catch (error) {
            console.error('Error creating deck', error);
        }
    };

    return (
        <div>
            <h2>Your Decks</h2>
            <form onSubmit={handleCreateDeck} className="mb-4">
                <div className="input-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="New deck name" 
                        value={deckName} 
                        onChange={(e) => setDeckName(e.target.value)} 
                        required 
                    />
                    <button type="submit" className="btn btn-primary">Create Deck</button>
                </div>
            </form>

            <div className="list-group">
                {decks.map(deck => (
                    <a href={`/decks/${deck.id}`} key={deck.id} className="list-group-item list-group-item-action">
                        {deck.name}
                    </a>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
