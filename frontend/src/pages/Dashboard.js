import React from 'react';
import PreferencesForm from '../components/PreferencesForm';
import SprintSummary from '../components/SprintSummary';

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <PreferencesForm />
      <SprintSummary />
    </div>
  );
};

export default Dashboard;
