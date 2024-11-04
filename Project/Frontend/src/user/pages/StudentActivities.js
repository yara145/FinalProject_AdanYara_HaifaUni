import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './StudentActivities.css';

const StudentActivities = () => {
  const { studentId, activityType } = useParams(); // Retrieve studentId and activityType from URL
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);

  console.log("StudentActivities - studentId:", studentId, "activityType:", activityType);

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

  return (
    <div className="student-activities">
      <h2>أنشطة من النوع: {activityType}</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="activities-grid">
        {activities.map((activity, index) => (
          <button
            key={index}
            className={`activity ${activity.completed ? 'completed' : 'locked'}`}
            onClick={() => {
              if (activity.completed || activity.level === 1) {
                alert(`الانتقال إلى ${activity.name} - المستوى ${activity.level}`);
              } else {
                alert('يرجى إكمال النشاط السابق للوصول إلى هذا المستوى.');
              }
            }}
          >
            {activity.completed ? `${activity.name} - مكتمل` : `${activity.name} - مقفل`}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StudentActivities;
