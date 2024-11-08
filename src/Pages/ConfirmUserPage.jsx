import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ConfirmUserPage = () => {
  const [statusMessage, setStatusMessage] = useState('Confirming your participation...');
  const navigate = useNavigate();

  useEffect(() => {
    const confirmUser = async () => {
      // Parse the query parameters from the hash part of the URL
      const hashParams = new URLSearchParams(window.location.hash.split('?')[1]);
      const token = hashParams.get('token');
      if (!token) {
        setStatusMessage('Invalid or missing confirmation token.');
        return;
      }

      try {
        const response = await fetch(`https://us-central1-commoncart-1458a.cloudfunctions.net/confirmUserInCart?token=${token}`);

        if (!response.ok) {
          throw new Error('Failed to confirm user.'); // Handle non-200 responses
        }

        const responseData = await response.text(); // Assuming the function returns plain text
        setStatusMessage(responseData);

        // Redirect to the main page after 3 seconds
        setTimeout(() => {
          navigate('/'); // Adjust the path based on your main page
        }, 3000);
      } catch (error) {
        setStatusMessage('An error occurred while confirming your participation.');
        console.error('Error:', error);
      }
    };

    confirmUser();
  }, [navigate]);

  return (
    <div>
      <h1>{statusMessage}</h1>
      <p>Redirecting to the main page in 3 seconds...</p>
    </div>
  );
};

export default ConfirmUserPage;
//http://localhost:5173/#/confirm?token=MktsZnYwSk1UeGJIUjduQzJLa0hlQ2NxRzlUMjoxNzMwODg3OTUzMDU1