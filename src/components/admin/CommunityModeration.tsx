import { useState, useEffect } from 'react';
import { Flag, Trash2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export function CommunityModeration() {
  const [posts, setPosts] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'reported'>('all');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const { default: adminService } = await import('../../services/adminService');
      const apiPosts = await adminService.getAllCommunityPosts();
      // Map to component format
      const mappedPosts = apiPosts.map((p: any) => ({
        id: p._id,
        userName: p.userName,
        content: p.content,
        reported: p.reported,
        likes: p.likes
      }));
      setPosts(mappedPosts);
    } catch (error) {
      console.error('Failed to load posts:', error);
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const { default: adminService } = await import('../../services/adminService');
      await adminService.deleteCommunityPost(postId);
      const updatedPosts = posts.filter(p => p.id !== postId);
      setPosts(updatedPosts);
      toast.success('Post deleted');
    } catch (error) {
      console.error('Failed to delete post:', error);
      toast.error('Failed to delete post');
    }
  };

  const clearReport = async (postId: string) => {
    try {
      const { default: adminService } = await import('../../services/adminService');
      await adminService.clearCommunityReport(postId);
      const updatedPosts = posts.map(p =>
        p.id === postId ? { ...p, reported: false } : p
      );
      setPosts(updatedPosts);
      toast.success('Report cleared');
    } catch (error) {
      console.error('Failed to clear report:', error);
      toast.error('Failed to clear report');
    }
  };

  const filteredPosts = filter === 'reported'
    ? posts.filter(p => p.reported)
    : posts;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="gradient-text mb-2">Manage Anonymous Community</h2>
        <p className="text-gray-600">Moderate community posts and handle reports</p>
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg transition-all ${filter === 'all' ? 'gradient-primary text-white' : 'border-2 border-gray-200'
            }`}
        >
          All Posts ({posts.length})
        </button>
        <button
          onClick={() => setFilter('reported')}
          className={`px-4 py-2 rounded-lg transition-all ${filter === 'reported' ? 'gradient-primary text-white' : 'border-2 border-gray-200'
            }`}
        >
          Reported ({posts.filter(p => p.reported).length})
        </button>
      </div>

      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border-2 border-gray-100 text-center">
            <p className="text-gray-500">No posts to display</p>
          </div>
        ) : (
          filteredPosts.map(post => (
            <div key={post.id} className={`bg-white p-6 rounded-2xl border-2 ${post.reported ? 'border-red-200 bg-red-50' : 'border-gray-100'
              }`}>
              {post.reported && (
                <div className="flex items-center gap-2 text-red-600 mb-4 pb-4 border-b border-red-200">
                  <Flag className="w-4 h-4" />
                  <span className="text-sm">This post has been reported</span>
                </div>
              )}

              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Posted by {post.userName}</p>
                <p className="text-gray-700">{post.content}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => deletePost(post.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Post
                </button>
                {post.reported && (
                  <button
                    onClick={() => clearReport(post.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Clear Report
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
