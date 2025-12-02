import { useState, useEffect } from 'react';
import { Mail, CheckCircle, X } from 'lucide-react';
import { toast } from 'sonner';
import adminService from '../../services/adminService';

export function SupportInbox() {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const supportMessages = await adminService.getSupportMessages();
      // Map _id to id
      const mappedMessages = supportMessages.map((m: any) => ({ ...m, id: m._id }));
      setMessages(mappedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const markAsResolved = async (messageId: string) => {
    try {
      await adminService.resolveSupportMessage(messageId);
      loadMessages();
      toast.success('Message marked as resolved');
    } catch (error) {
      console.error('Error resolving message:', error);
      toast.error('Failed to resolve message');
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      await adminService.deleteSupportMessage(messageId);
      loadMessages();
      toast.success('Message deleted');
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="gradient-text mb-2">User Support Messages</h2>
        <p className="text-gray-600">Manage incoming support requests</p>
      </div>

      <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden">
        {messages.length === 0 ? (
          <div className="p-12 text-center">
            <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No support messages</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {messages.map(message => (
              <div key={message.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h5 className="text-gray-900 mb-1">{message.name}</h5>
                    <p className="text-sm text-gray-500">{message.email}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${message.status === 'resolved'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-yellow-100 text-yellow-600'
                    }`}>
                    {message.status || 'new'}
                  </span>
                </div>

                <p className="text-gray-700 mb-4">{message.message}</p>

                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <span>{new Date(message.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
                </div>

                <div className="flex gap-2">
                  {message.status !== 'resolved' && (
                    <button
                      onClick={() => markAsResolved(message.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark Resolved
                    </button>
                  )}
                  <button
                    onClick={() => deleteMessage(message.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
