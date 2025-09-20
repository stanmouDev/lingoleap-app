
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="p-5 mb-4 bg-light rounded-3">
            <div className="container-fluid py-5">
                <h1 className="display-5 fw-bold">Welcome to LingoLeap</h1>
                <p className="col-md-8 fs-4">Your personal language learning assistant. Create flashcard decks, quiz yourself, and track your progress.</p>
                <Link className="btn btn-primary btn-lg" to="/register">Get Started</Link>
            </div>
        </div>
    );
};

export default Home;
