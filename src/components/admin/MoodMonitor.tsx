import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

export function MoodMonitor() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const loadRisks = async () => {
      try {
        const { default: adminService } = await import('../../services/adminService');
        const data = await adminService.getMoodRisks();
        setUsers(data);
      } catch (error) {
        console.error('Failed to load mood data:', error);
      }
    };
    loadRisks();
  }, []);

  const getRiskStyles = (level: string) => {
    switch (level) {
      case 'high':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          badge: 'bg-red-600',
          text: 'text-red-900',
          subtext: 'text-red-700'
        };
      case 'moderate':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          badge: 'bg-orange-500',
          text: 'text-orange-900',
          subtext: 'text-orange-700'
        };
      default:
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          badge: 'bg-green-500',
          text: 'text-green-900',
          subtext: 'text-green-700'
        };
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="gradient-text mb-2">User Mood Monitor</h2>
        <p className="text-gray-600">Track emotional well-being of all users</p>
      </div>

      {users.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border-2 border-gray-100 text-center">
          <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No mood data available</p>
          <p className="text-sm text-gray-400 mt-2">Users haven't logged any moods yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map(user => {
            const styles = getRiskStyles(user.riskLevel);
            return (
              <div key={user.id} className={`${styles.bg} border-2 ${styles.border} p-6 rounded-2xl transition-all hover:shadow-md`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className={`${styles.text} font-semibold mb-1`}>{user.name}</h4>
                    <p className={`text-sm ${styles.subtext}`}>{user.email}</p>
                  </div>
                  <span className={`px-3 py-1 ${styles.badge} text-white text-sm rounded-full capitalize`}>
                    {user.riskLevel} Risk
                  </span>
                </div>

                <div className="bg-white/80 p-4 rounded-xl backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-600">Most Recent Mood:</p>
                    <span className="text-xs text-gray-400">
                      {new Date(user.recentMood?.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-900 font-medium">
                    {user.recentMood?.emotion} <span className="text-gray-400 mx-2">•</span> Intensity: {user.recentMood?.intensity}/10
                  </p>
                  {user.recentMood?.note && (
                    <p className="text-sm text-gray-600 mt-2 italic border-l-2 border-gray-200 pl-3">
                      "{user.recentMood.note}"
                    </p>
                  )}
                </div>

                {user.riskLevel === 'high' && (
                  <div className="mt-4 flex gap-3">
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                      Send Emergency Resources
                    </button>
                    <button className="px-4 py-2 border-2 border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium">
                      Contact User
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
