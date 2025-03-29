import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8888/api/users/all-users');
        setUsers(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
      <Navbar />
      
      <div className="users-container">
        <h2 className="users-title">User List</h2>
        
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner" data-testid="loading-spinner"></div>
          </div>
        ) : error ? (
          <div className="error-message" role="alert">
            Error: {error}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Sr. No</th>
                  <th>Name</th>
                  <th>Phone No</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <tr key={user._id || index}>
                      <td>{index + 1}</td>
                      <td>{user.name || 'N/A'}</td>
                      <td>{user.phone || 'N/A'}</td>
                      <td>{user.address || 'N/A'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center' }}>No users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default Users;