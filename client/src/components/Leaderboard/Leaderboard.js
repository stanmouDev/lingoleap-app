
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchLeaderboard = async () => {
            if (token) {
                try {
                    const response = await axios.get('http://localhost:3001/api/leaderboard', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setLeaderboard(response.data);
                } catch (error) {
                    console.error('Error fetching leaderboard', error);
                }
            }
        };
        fetchLeaderboard();
    }, [token]);

    return (
        <div>
            <h2>Leaderboard</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Username</th>
                        <th scope="col">XP</th>
                    </tr>
                </thead>
                <tbody>
                    {leaderboard.map((user, index) => (
                        <tr key={user.username}>
                            <th scope="row">{index + 1}</th>
                            <td>{user.username}</td>
                            <td>{user.experience_points}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboard;
