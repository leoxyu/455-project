import React from 'react';

const CreateAccount = ({ username, onCreateAccount, onCancel }) => {
  return (
    <div>
      <p>Username {username} cannot be found.</p>
      <p>Do you want to create a new account?</p>
      <button onClick={onCancel}>No</button>
      <button onClick={onCreateAccount}>Yes</button>
    </div>
  );
};

export default CreateAccount;