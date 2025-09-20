import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Quiz = () => {
    const { deckId } = useParams();
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [quizFinished, setQuizFinished] = useState(false);
    const token = localStorage.getItem('token');

    const fetchDueCards = useCallback(async () => {
        if (token) {
            try {
                const response = await axios.get(`http://localhost:3001/api/decks/${deckId}/quiz`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.length === 0) {
                    // No cards due, maybe show a message and redirect
                    setQuizFinished(true);
                } else {
                    setCards(response.data);
                }
            } catch (error) {
                console.error('Error fetching due cards', error);
            }
        }
    }, [deckId, token]);

    useEffect(() => {
        fetchDueCards();
    }, [fetchDueCards]);

    const handleReview = async (quality) => {
        const cardId = cards[currentCardIndex].id;
        try {
            await axios.post(`http://localhost:3001/api/cards/${cardId}/review`, 
                { quality }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            // Move to the next card
            setIsFlipped(false);
            if (currentCardIndex < cards.length - 1) {
                setCurrentCardIndex(currentCardIndex + 1);
            } else {
                setQuizFinished(true);
            }
        } catch (error) {
            console.error('Error reviewing card', error);
        }
    };

    if (quizFinished) {
        return (
            <div className="text-center">
                <h2>Review Session Finished!</h2>
                <p className="fs-4">You have completed all due cards for this deck.</p>
                <Link to={`/decks/${deckId}`} className="btn btn-primary me-2">Back to Deck</Link>
                <button onClick={() => navigate(0)} className="btn btn-secondary">Review Again</button>
            </div>
        );
    }

    if (cards.length === 0) {
        return (
            <div className="text-center">
                <h2>No cards due for review right now!</h2>
                <Link to={`/decks/${deckId}`} className="btn btn-primary">Back to Deck</Link>
            </div>
        );
    }

    const currentCard = cards[currentCardIndex];

    return (
        <div>
            <div className="progress mb-4">
                <div 
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${((currentCardIndex + 1) / cards.length) * 100}%` }}
                    aria-valuenow={currentCardIndex + 1}
                    aria-valuemin="0"
                    aria-valuemax={cards.length}
                >
                    {currentCardIndex + 1} / {cards.length}
                </div>
            </div>

            <div className="card text-center my-4" style={{ minHeight: '250px' }}>
                <div className="card-body d-flex flex-column align-items-center justify-content-center">
                    <h3 className="card-title">{currentCard.front}</h3>
                    {isFlipped && <p className="card-text fs-4 mt-3">{currentCard.back}</p>}
                </div>
            </div>

            {!isFlipped ? (
                <div className="text-center">
                    <button onClick={() => setIsFlipped(true)} className="btn btn-primary">Show Answer</button>
                </div>
            ) : (
                <div className="d-flex justify-content-around">
                    <button onClick={() => handleReview(1)} className="btn btn-danger">Again (1 min)</button>
                    <button onClick={() => handleReview(3)} className="btn btn-warning">Hard (1 day)</button>
                    <button onClick={() => handleReview(4)} className="btn btn-success">Good (3 days)</button>
                    <button onClick={() => handleReview(5)} className="btn btn-info">Easy (7 days)</button>
                </div>
            )}
        </div>
    );
};

export default Quiz;