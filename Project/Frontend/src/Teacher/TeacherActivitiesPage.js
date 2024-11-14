import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import styles from './TeacherActivitiesPage.module.css';  // Import the updated CSS Module

const TeacherActivitiesPage = () => {
  const [activities, setActivities] = useState([]);
  const [level, setLevel] = useState('');
  const [editMode, setEditMode] = useState(false);  // New state to toggle edit mode
  const [editingActivity, setEditingActivity] = useState(null);  // Store the activity being edited
  const navigate = useNavigate();

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/activities/fetch-activities');
      if (!response.ok) {
        console.log('Failed to fetch activities:', response.statusText);
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setActivities(data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const handleLevelChange = async (activityId, newLevel) => {
    try {
      const response = await fetch(`http://localhost:5000/api/activities/${activityId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level: newLevel }),
      });
      const updatedActivity = await response.json();
      setActivities(activities.map(activity => activity._id === activityId ? updatedActivity : activity));
    } catch (error) {
      console.error('Error updating activity level:', error);
    }
  };

  const handleEditClick = (activity) => {
    setEditMode(true); // Set edit mode to true
    setEditingActivity(activity); // Store the activity being edited
  };

  const handleCancelEdit = () => {
    setEditMode(false); // Cancel editing
    setEditingActivity(null); // Reset editing state
  };

  const handleCreateActivityClick = () => {
    navigate('/activity-selection');  // Navigate to the Activity Selection page
  };

  return (
    <div className={styles['activities-page']}>
      <header className={styles['activities-header']}>
        <img src={logo} alt="Logo" className={styles['activities-logo']} />
        <nav className={styles['activities-nav']}>
          <button className={styles['nav-button']} onClick={() => navigate('/teacher')}>الرجوع</button>
        </nav>
      </header>

      <main className={styles['activities-main']}>
        <h2 className={styles['activities-title']}>إدارة الأنشطة</h2>
        <p>هنا يمكنك تعديل الأنشطة المتوفرة وإضافة مستويات جديدة.</p>
        <div className={styles['activities-section']}>
          <h3>الأنشطة المضافة</h3>
          <div className={styles['activities-list']}>
            {activities.map((activity) => (
              <div key={activity._id} className={styles['activity-card']}>
                <h4>{activity.name}</h4>
                <p>النوع: {activity.type}</p>
                <p>المستوى الحالي: {activity.level}</p>
                <label>
                  أدخل المستوى الجديد:
                  <input
                    type="number"
                    min="1"
                    value={level || activity.level}
                    onChange={(e) => setLevel(e.target.value)}
                  />
                </label>
                <button
                  className={`${styles['update-level-button']}`}
                  onClick={() => handleLevelChange(activity._id, level || activity.level)}
                >
                  تحديث المستوى
                </button>

                {/* Edit Button */}
                <button
                  className={`${styles['edit-button']} ${editMode && activity._id === editingActivity?._id ? 'active' : ''}`}
                  onClick={() => handleEditClick(activity)}
                >
                  {editMode && activity._id === editingActivity?._id ? 'إلغاء التعديل' : 'تعديل'}
                </button>

                {/* Edit Feedback */}
                <div className={`${styles['edit-feedback']} ${editMode && activity._id === editingActivity?._id ? 'active' : ''}`}>
                  تعديل قيد التنفيذ...
                </div>

                {/* If in edit mode, display the editing activity's details */}
                {editMode && activity._id === editingActivity?._id && (
                  <div>
                    <textarea
                      value={editingActivity.name}
                      onChange={(e) => setEditingActivity({ ...editingActivity, name: e.target.value })}
                    />
                    <button onClick={handleCancelEdit}>إلغاء التعديل</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherActivitiesPage;
