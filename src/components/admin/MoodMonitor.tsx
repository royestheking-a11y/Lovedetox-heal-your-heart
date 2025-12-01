import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

export function MoodMonitor() {
  const [riskUsers, setRiskUsers] = useState<any[]>([]);

  useEffect(() => {
    const loadRisks = async () => {
      try {
        const { default: adminService } = await import('../../services/adminService');
        const risks = await adminService.getMoodRisks();
        setRiskUsers(risks);
      } catch (error) {
        console.error('Failed to load mood risks:', error);
      }
    };
    loadRisks();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="gradient-text mb-2">High-Risk Emotional Users</h2>
        <p className="text-gray-600">Monitor users showing concerning emotional patterns</p>
      </div>

      {riskUsers.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border-2 border-gray-100 text-center">
          <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No high-risk users detected</p>
          <p className="text-sm text-gray-400 mt-2">All users appear to be in stable emotional states</p>
        </div>
      ) : (
        <div className="space-y-4">
          {riskUsers.map(user => (
            <div key={user.id} className="bg-red-50 border-2 border-red-200 p-6 rounded-2xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-red-900 mb-1">{user.name}</h4>
                  <p className="text-sm text-red-700">{user.email}</p>
                </div>
                <span className="px-3 py-1 bg-red-600 text-white text-sm rounded-full">
                  High Risk
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl">
                <p className="text-sm text-gray-600 mb-2">Most Recent Mood:</p>
                <p className="text-gray-900">
                  {user.recentMood?.emotion} - Intensity: {user.recentMood?.intensity}/10
                </p>
                {user.recentMood?.note && (
                  <p className="text-sm text-gray-600 mt-2 italic">"{user.recentMood.note}"</p>
                )}
              </div>

              <div className="mt-4 flex gap-3">
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  Send Emergency Resources
                </button>
                <button className="px-4 py-2 border-2 border-red-300 rounded-lg hover:bg-red-100 transition-colors">
                  Contact User
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
