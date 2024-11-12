import React from 'react';

const StudentProgress = ({ student }) => {
  // Ensure activities data exists
  if (!student || !student.activities) {
    return <div>Loading...</div>;  // Show loading if student or activities are not loaded
  }

  return (
    <div className="student-progress">
      <h2>Student Progress</h2>
      <ul>
        {/* Check if there are activities */}
        {student.activities.length > 0 ? (
          student.activities.map((activity, index) => (
            <li key={index}>
              <div><strong>Activity:</strong> {activity.name}</div>
              <div><strong>Level:</strong> {activity.level}</div>
              <div><strong>Score:</strong> {activity.score}/{activity.level}</div>
              <div><strong>Status:</strong> {activity.played ? 'Played' : 'Not Played'}</div>
              {/* Render Failed Items */}
              <div>
                <strong>Failed Items:</strong>
                {activity.failedItems.length > 0 ? (
                  <ul>
                    {activity.failedItems.map((item, idx) => (
                      <li key={idx}>
                        <strong>Word:</strong> {item.word}, <strong>Image:</strong> <img src={item.image} alt={item.word} width="50" />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span>No failed items</span>
                )}
              </div>
            </li>
          ))
        ) : (
          <div>No activities available</div>
        )}
      </ul>
    </div>
  );
};

export default StudentProgress;
