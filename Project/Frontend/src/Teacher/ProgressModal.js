import React, { useState } from 'react';
import './ProgressModal.css';  // Ensure the CSS file is updated

const ProgressModal = ({ isOpen, onClose, activities }) => {
  const [showFailedItems, setShowFailedItems] = useState({});

  // Early return if the modal is closed
  if (!isOpen) return null;

  // Ensure activities is an array, use an empty array as fallback if it's null or undefined
  const groupedActivities = (activities || []).reduce((groups, activity) => {
    const { type } = activity;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(activity);
    return groups;
  }, {});

  // Toggle function for showing failed items
  const toggleFailedItems = (index) => {
    setShowFailedItems(prevState => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        <div className="student-activity-progress">
          {Object.keys(groupedActivities).map((type, idx) => (
            <div key={type} className="activity-group">
              <h3>{type === 'word-shuffle' ? 'ترتيب الحروف' : 'مطابقة الكلمة بالصورة'}</h3>
              <div className="activity-row">
                {groupedActivities[type].map((activity, index) => (
                  <div key={index} className="activity-card">
                    <div className="activity-header">
                      {/* Only show image if available */}
                      {activity.image && <img src={activity.image} alt={activity.name} className="activity-image" />}
                      <div className="activity-info">
                        <h4>{activity.name}</h4>
                        <div><strong>النوع:</strong> {type === 'word-shuffle' ? 'ترتيب الحروف' : 'مطابقة الكلمة بالصورة'}</div>
                        <div><strong>المستوى:</strong> {activity.level}</div>
                      </div>
                    </div>

                    <div className="activity-status">
                      {/* Show the score only if the activity failed */}
                      {activity.failed && (
                        <div><strong>الدرجة:</strong> {activity.score}/{activity.level}</div>
                      )}
                      {/* Display status: Played or Not Played */}
                      <div className={`status ${activity.played ? (activity.completed ? 'completed' : 'failed') : 'not-played'}`}>
                        {activity.played 
                          ? (activity.completed ? '✔ تم اللعب - مكتمل' : '✘ فشل')
                          : '🔲 لم يتم اللعب'}
                      </div>
                    </div>

                    {/* Show failed items */}
                    {activity.failedItems && activity.failedItems.length > 0 && (
                      <div className="failed-items">
                        <button className="show-failures" onClick={() => toggleFailedItems(index)}>
                          {showFailedItems[index] ? 'إخفاء الأخطاء' : 'عرض الأخطاء'}
                        </button>
                        {showFailedItems[index] && (
                          <div className="failed-items-list">
                            {activity.failedItems.map((item, idx) => (
                              <div key={idx} className="failed-item">
                                <strong>الكلمة:</strong> {item.word}, <strong>:</strong>
                                {/* Only display image if available */}
                                {item.image && <img src={item.image} alt={item.word} className="failed-item-image" />}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {/* Display a message if no activity was played */}
          {groupedActivities && Object.values(groupedActivities).flat().every(activity => !activity.played) && (
            <p>لم يتم لعب أي نشاط من الأنشطة</p>
          )}

          {/* Display a message if no activity was not played */}
          {groupedActivities && Object.values(groupedActivities).flat().every(activity => activity.played) && (
            <p>جميع الأنشطة قد تم لعبها</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressModal;
