import { useState, useEffect } from 'react';
import { Shield, MessageCircle, AlertTriangle, TrendingUp, TrendingDown, Heart, Calendar } from 'lucide-react';

interface NoContactMessage {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  exName: string;
  message: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  createdAt: string;
}

export function NoContactMonitor() {
  const [messages, setMessages] = useState<NoContactMessage[]>([]);
  const [filter, setFilter] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');
  const [selectedUser, setSelectedUser] = useState<string>('all');

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const { default: adminService } = await import('../../services/adminService');
      const stored = await adminService.getAllNoContactMessages();
      setMessages(stored);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const filteredMessages = filter === 'all'
    ? messages
    : messages.filter(m => m.sentiment === filter);

  const filteredByUser = selectedUser === 'all'
    ? filteredMessages
    : filteredMessages.filter(m => m.userEmail === selectedUser);

  const uniqueUsers = Array.from(new Set(messages.map(m => m.userEmail)));

  // Group messages by user
  const groupedMessages = filteredByUser.reduce((acc: { [key: string]: NoContactMessage[] }, msg) => {
    if (!acc[msg.userEmail]) {
      acc[msg.userEmail] = [];
    }
    acc[msg.userEmail].push(msg);
    return acc;
  }, {});

  const stats = {
    total: messages.length,
    today: messages.filter(m => {
      const today = new Date().toDateString();
      return new Date(m.createdAt).toDateString() === today;
    }).length,
    positive: messages.filter(m => m.sentiment === 'positive').length,
    negative: messages.filter(m => m.sentiment === 'negative').length,
    neutral: messages.filter(m => m.sentiment === 'neutral').length
  };

  const getUserMessageCount = (email: string) => {
    return messages.filter(m => m.userEmail === email).length;
  };

  const getUserMentalState = (email: string) => {
    const userMessages = messages.filter(m => m.userEmail === email);
    if (userMessages.length === 0) return 'unknown';

    const recentMessages = userMessages.slice(-5);
    const negativeCount = recentMessages.filter(m => m.sentiment === 'negative').length;

    if (negativeCount >= 4) return 'critical';
    if (negativeCount >= 3) return 'warning';
    if (negativeCount >= 2) return 'monitoring';
    return 'stable';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">No-Contact Monitor</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Track user emotional states and unsent messages</p>
          </div>
        </div>
      </div>

      {/* Alert */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-amber-900 dark:text-amber-200">
              <strong>Privacy & Ethics:</strong> These messages are typed but never sent by users.
              They serve as a therapeutic tool and help us monitor mental health. Use this data responsibly
              and only to provide better support. Never share or expose this information.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.total}</div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Messages</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">{stats.today}</div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Today</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">{stats.positive}</div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Positive</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="text-2xl sm:text-3xl font-bold text-red-600 mb-1">{stats.negative}</div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Negative</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="text-2xl sm:text-3xl font-bold text-gray-600 mb-1">{stats.neutral}</div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Neutral</div>
        </div>
      </div>

      {/* Users at Risk */}
      {uniqueUsers.filter(email => getUserMentalState(email) === 'critical' || getUserMentalState(email) === 'warning').length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4 sm:p-6">
          <h3 className="font-semibold text-red-900 dark:text-red-200 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Users Requiring Attention
          </h3>
          <div className="space-y-2">
            {uniqueUsers
              .filter(email => {
                const state = getUserMentalState(email);
                return state === 'critical' || state === 'warning';
              })
              .map(email => {
                const state = getUserMentalState(email);
                const count = getUserMessageCount(email);
                return (
                  <div key={email} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{email}</p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{count} messages sent</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold self-start sm:self-center ${state === 'critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                      {state === 'critical' ? 'CRITICAL' : 'WARNING'}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2 flex-wrap">
          {(['all', 'positive', 'negative', 'neutral'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${filter === f
                  ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="px-4 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:border-[#6366F1] focus:outline-none text-sm"
        >
          <option value="all">All Users</option>
          {uniqueUsers.map(email => (
            <option key={email} value={email}>{email} ({getUserMessageCount(email)})</option>
          ))}
        </select>
      </div>

      {/* Messages List - Grouped by User */}
      <div className="space-y-4">
        {filteredByUser.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-12 rounded-2xl border border-gray-200 dark:border-gray-700 text-center">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">No messages in this category</p>
          </div>
        ) : (
          Object.keys(groupedMessages).map(email => (
            <div key={email} className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-4">
                {/* Mental State Icon */}
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getUserMentalState(email) === 'critical' || getUserMentalState(email) === 'warning' ? 'bg-red-100 dark:bg-red-900/30' :
                    getUserMentalState(email) === 'monitoring' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                      'bg-green-100 dark:bg-green-900/30'
                  }`}>
                  {getUserMentalState(email) === 'critical' || getUserMentalState(email) === 'warning' ? (
                    <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                  ) : getUserMentalState(email) === 'monitoring' ? (
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                  ) : (
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{email}</h4>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{getUserMessageCount(email)} messages total</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold self-start ${getUserMentalState(email) === 'critical' ? 'bg-red-100 text-red-700' :
                        getUserMentalState(email) === 'warning' ? 'bg-orange-100 text-orange-700' :
                          getUserMentalState(email) === 'monitoring' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                      }`}>
                      {getUserMentalState(email).toUpperCase()}
                    </span>
                  </div>

                  {/* All Messages from this user */}
                  <div className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 rounded-lg space-y-3 max-h-96 overflow-y-auto">
                    {groupedMessages[email].map((msg) => (
                      <div key={msg.id} className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-3 last:pb-0">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-semibold self-start ${msg.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                              msg.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'
                            }`}>
                            {msg.sentiment}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(msg.createdAt).toLocaleDateString()} {new Date(msg.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 italic text-sm break-words">"{msg.message}"</p>
                        {msg.exName && (
                          <p className="text-xs text-gray-500 mt-1">To: {msg.exName}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
