import React, { useEffect, useState } from 'react';
import { useDbData, useAuthState } from '../utilities/firebase';
import { Card, ListGroup } from 'react-bootstrap';
import './SummariesPage.css';

const SummariesPage = () => {
  const [user] = useAuthState();
  const [userData] = useDbData(`/users/${user?.uid}`);
  const [usersData] = useDbData('/users');
  const [summariesData] = useDbData('/Summary');
  const [userMap, setUserMap] = useState({});
  const pastelGreen = '#A8E6CF';
  const colorMap = {};

  useEffect(() => {
    if (usersData) {
      const map = {};
      Object.entries(usersData).forEach(([userId, user]) => {
        map[userId] = user.displayName;
      });
      setUserMap(map);
    }
  }, [usersData]);

  // Big ups to @NoodleSoup0
  // Helper function to get initials
  const getInitials = (name) => name.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
  // Helper function to generate random pastel color
  const randomPastelColor = () => {
    const r = Math.floor(Math.random() * 128 + 127);
    const g = Math.floor(Math.random() * 128 + 127);
    const b = Math.floor(Math.random() * 128 + 127);
    return `rgb(${r}, ${g}, ${b})`;
  };

  if (!userData || !summariesData || !usersData) return <p className="loading-text">Loading...</p>;

  const userSummaries = (userData?.summaries?.map(id => summariesData?.[id]) || []).reverse();

  return (
    <div className="d-flex flex-column align-items-center justify-content-start min-vh-100"
      style={{ padding: '1.0rem', paddingTop: '2.0rem' }}>
      
      <h1 style={{ fontFamily: "Josefin Sans", fontWeight: 'bold'}}>Shopping Summaries</h1>

      { userSummaries.length === 0 ? (
        <p className="no-summaries">No shopping summaries to display.</p>
      ) : (
        userSummaries.map((summary, index) => {
          const userItems = summary.items.filter(item => item.userAdded === user.uid);
          const allItems = summary.items;

          return (
            <Card key={index} className="summaries-card">
              <Card.Body>
                <Card.Title style={{ fontFamily: "Josefin Sans", fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {summary.store} on {new Date(summary.completedAt).toLocaleDateString()}
                </Card.Title>
                <Card.Text style={{ fontFamily: "Josefin Sans", fontSize: '1.1rem' }}>
                  Completed By: {userMap[summary.completedBy] || 'Loading...'}
                </Card.Text>

                {/* Items gotten */}
                <h3>Items gotten:</h3>
                <ListGroup variant="flush" style={{ backgroundColor: 'transparent' }}>
                  {allItems.map((item, idx) => {
                    const addedByName = userMap[item.userAdded] || 'Unknown User';
                    const initials = getInitials(addedByName);

                    if (!colorMap[item.userAdded]) {
                      colorMap[item.userAdded] = item.userAdded === user?.uid ? pastelGreen : randomPastelColor();
                    }

                    return (
                      <ListGroup.Item
                        key={idx}
                        className="shoppinglist-item"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          backgroundColor: '#EAE2D6',
                          border: 'none',
                          padding: '10px',
                          borderRadius: '8px',
                          marginBottom: '10px',
                          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        <div className="user-initial" style={{ backgroundColor: colorMap[item.userAdded] }}>
                          {initials}
                        </div>
                        <div className="shoppinglist-details">
                          <p style={{
                            margin: 0,
                            textDecoration: 'none',
                            color: '#333',
                            fontSize: '1.15rem',
                          }}>
                            {item.itemName}
                          </p>
                        </div>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>

                {/* Users Items */}
                <h3>Your items:</h3>
                {userItems.length > 0 ? (
                  <ListGroup variant="flush" style={{ backgroundColor: 'transparent' }}>
                    {userItems.map((item, idx) => (
                      <ListGroup.Item
                        key={idx}
                        className="shoppinglist-item"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          backgroundColor: '#EAE2D6',
                          border: 'none',
                          padding: '10px',
                          borderRadius: '8px',
                          marginBottom: '10px',
                          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        <div className="user-initial" style={{ backgroundColor: pastelGreen }}>
                          {getInitials(userMap[item.userFulfilled] || 'You')}
                        </div>
                        <div className="shoppinglist-details">
                          <p style={{
                            margin: 0,
                            textDecoration: 'none',
                            color: '#333',
                            fontSize: '1.15rem',
                          }}>
                            {item.itemName}
                          </p>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <p style={{ fontStyle: 'italic', color: '#888' }}>No items were gotten for you in this summary.</p>
                )}
              </Card.Body>
            </Card>
          );
        })
      )}
    </div>
  );
};

export default SummariesPage;
