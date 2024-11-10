import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaLock, FaPlayCircle } from 'react-icons/fa';
import './StudentActivities.css';

const StudentActivities = () => {
  const { studentId, activityType } = useParams();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);

  // Fetch activities when component mounts
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/students/${studentId}/activities/${activityType}`);
        setActivities(response.data);
      } catch (error) {
        console.error('Error fetching activities:', error);
        setError('فشل تحميل الأنشطة. يرجى المحاولة لاحقاً.');
      }
    };

    fetchActivities();
  }, [studentId, activityType]);

  const handleActivityClick = (activity) => {
    console.log("Full activity data:", activity);

    if (activity.locked) {
      alert('يرجى إكمال النشاط السابق للوصول إلى هذا المستوى.');
    } else {
      const activityId = activity.activityId || activity._id; // Use '_id' for custom activities and regular activities

      if (!activityId) {
        console.error("No valid activityId found for activity:", activity);
        return;
      }

      // Navigate to the activity page based on the type (word-image-match or word-shuffle)
      if (activity.type === 'word-image-match') {
        navigate(`/custom-activity/${activityId}/${studentId}/${activity.level}`);
      } else if (activity.type === 'word-shuffle') {
        navigate(`/activities/${activityId}/${studentId}/${activity.level}`);
      }

      console.log("Navigating with Activity ID:", activityId);
    }
  };

  return (
    <div className="student-activities">
      <h2>أنشطة من النوع: {activityType}</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="activities-grid">
        {activities.map((activity, index) => {
          // Log the completion status for each activity
          console.log(`Activity ${activity.name} completed: ${activity.completed}`);  // This is where you're logging the completion status

          return (
            <button
              key={index}
              className={`activity ${activity.completed ? 'completed' : activity.locked ? 'locked' : 'available'}`}
              onClick={() => handleActivityClick(activity)}
            >
              {activity.completed ? (
                <FaCheckCircle className="icon completed-icon" />
              ) : activity.locked ? (
                <FaLock className="icon locked-icon" />
              ) : (
                <FaPlayCircle className="icon available-icon" />
              )}
              <span className="level-text">المستوى {activity.level}</span>
              <p>{activity.name}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StudentActivities;
