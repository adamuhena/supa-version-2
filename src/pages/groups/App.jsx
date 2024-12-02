import React, { useState } from 'react';
import TrainingGroupList from './components/TrainingGroupList';
import TrainingGroupForm from './components/TrainingGroupForm';
import UserAssignment from './components/UserAssignment';
import UserReassignment from './components/UserReassignment';
import GroupEvaluation from './components/GroupEvaluation';
import ReportGenerator from './components/ReportGenerator';
import UserGroups from './components/UserGroups';
import TrainingCenterForm from '../forms/registrationCenter';
import TrainingCenterGroups from './components/TrainingCenterGroups';
import TrainingPeriodForm from './components/TrainingPeriodForm';

const Mygroups = () => {
  const [activeTab, setActiveTab] = useState('groups');
  const [userRole, setUserRole] = useState('admin'); // This should be set based on actual user authentication

  const renderContent = () => {
    switch (activeTab) {
      
      case 'groups':
        return <TrainingGroupList />;
      case 'createPeriod':
        return <TrainingPeriodForm />;
      case 'create':
        return <TrainingGroupForm />;
      case 'assign':
        return <UserAssignment />;
      case 'reassign':
        return <UserReassignment />;
      case 'evaluate':
        return <GroupEvaluation />;
      case 'report':
        return <ReportGenerator />;
      case 'train':
        return <TrainingCenterGroups />;
      case 'users':
        return <UserGroups />;
        
      default:
        return <TrainingGroupList />;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Training Management System</h1>
      <nav className="mb-8">
        <ul className="flex flex-wrap space-x-4">
          <li>
            <button
              onClick={() => setActiveTab('groups')}
              className={`px-4 py-2 rounded ${activeTab === 'groups' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Groups
            </button>
          </li>
          {userRole === 'admin' && (
            <>
            <li>
                <button
                  onClick={() => setActiveTab('createPeriod')}
                  className={`px-4 py-2 rounded ${activeTab === 'createPeriod' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                  Create Period
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('create')}
                  className={`px-4 py-2 rounded ${activeTab === 'create' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                  Create Group
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('assign')}
                  className={`px-4 py-2 rounded ${activeTab === 'assign' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                  Assign Users
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('reassign')}
                  className={`px-4 py-2 rounded ${activeTab === 'reassign' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                  Reassign Users
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('report')}
                  className={`px-4 py-2 rounded ${activeTab === 'report' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                  Reports
                </button>
              </li>
            </>
          )}
          <li>
            <button
              onClick={() => setActiveTab('evaluate')}
              className={`px-4 py-2 rounded ${activeTab === 'evaluate' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Evaluate
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded ${activeTab === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Users
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('train')}
              className={`px-4 py-2 rounded ${activeTab === 'train' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Training
            </button>
          </li>
        </ul>
      </nav>
      {renderContent()}
    </div>
  );
};

export default Mygroups;

