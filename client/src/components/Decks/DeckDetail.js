
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const DeckDetail = () => {
    const { deckId } = useParams();
    const [allCards, setAllCards] = useState([]);
    const [dueCards, setDueCards] = useState([]);
    const [front, setFront] = useState('');
    const [back, setBack] = useState('');
    const token = localStorage.getItem('token');

    const fetchAllCards = useCallback(async () => {
        if (token) {
            try {
                const response = await axios.get(`http://localhost:3001/api/decks/${deckId}/cards`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAllCards(response.data);
            } catch (error) {
                console.error('Error fetching all cards', error);
            }
        }
    }, [deckId, token]);

    const fetchDueCards = useCallback(async () => {
        if (token) {
            try {
                const response = await axios.get(`http://localhost:3001/api/decks/${deckId}/quiz`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDueCards(response.data);
            } catch (error) {
                console.error('Error fetching due cards', error);
            }
        }
    }, [deckId, token]);

    useEffect(() => {
        fetchAllCards();
        fetchDueCards();
    }, [fetchAllCards, fetchDueCards]);

    const handleAddCard = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:3001/api/decks/${deckId}/cards`, 
                { front, back }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setAllCards([...allCards, response.data]);
            fetchDueCards(); // Re-fetch due cards in case the new card is due today
            setFront('');
            setBack('');
        } catch (error) {
            console.error('Error adding card', error);
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Deck Cards</h2>
                {dueCards.length > 0 && (
                    <Link to={`/decks/${deckId}/quiz`} className="btn btn-success">
                        Review {dueCards.length} Due Card(s)
                    </Link>
                )}
            </div>
            <p>{allCards.length} card(s) in this deck. {dueCards.length} due for review.</p>

            <form onSubmit={handleAddCard} className="mb-4">
                <div className="row">
                    <div className="col">
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Front of card" 
                            value={front} 
                            onChange={(e) => setFront(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="col">
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Back of card" 
                            value={back} 
                            onChange={(e) => setBack(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="col-auto">
                        <button type="submit" className="btn btn-primary">Add Card</button>
                    </div>
                </div>
            </form>

            <div className="row">
                {allCards.map(card => (
                    <div key={card.id} className="col-md-4 mb-3">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{card.front}</h5>
                                <p className="card-text">{card.back}</p>
                            </div>
                             <div className="card-footer text-muted">
                                Next review: {card.next_review_date}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DeckDetail;
