import React from 'react';
import '../../styles/CreateAccount.css'; // Import the CreateAccount.css file

const CreateAccount = ({ username, onCreateAccount, onCancel }) => {
  return (
    <div className="create-account">
      <p>Username {username} cannot be found.</p>
      <p>Do you want to create a new account?</p>
      <button onClick={onCancel}>No</button>
      <button onClick={onCreateAccount}>Yes</button>
    </div>
  );
};

export default CreateAccount;
