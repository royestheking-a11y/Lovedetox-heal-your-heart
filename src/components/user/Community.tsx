import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { Users, MessageCircle, Heart, Send, TrendingUp, Award, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { PremiumIcon } from '../PremiumIcon';
import { SoundEffects } from '../SoundEffects';
import { addNotification } from '../NotificationSystem';

interface Post {
  id: string;
  userId: string;
  userName: string;
  content: string;
  likes: number;
  comments: number;
  timestamp: string;
  userPhase: string;
}



export function Community() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const { default: dataService } = await import('../../services/dataService');
      const apiPosts = await dataService.getCommunityPosts();

      // Map API posts to component state format
      const mappedPosts = apiPosts.map((p: any) => ({
        id: p._id,
        userId: p.userId,
        userName: p.userName,
        content: p.content,
        likes: p.likes,
        comments: p.comments.length,
        timestamp: p.createdAt,
        userPhase: 'Community Member' // Backend doesn't store phase on post yet, could populate user
      }));
      setPosts(mappedPosts);

      // Initialize liked posts
      const liked = new Set<string>();
      apiPosts.forEach((p: any) => {
        if (p.likedBy && p.likedBy.includes(user?.id)) {
          liked.add(p._id);
        }
      });
      setLikedPosts(liked);

    } catch (error) {
      console.error('Failed to load posts:', error);
    }
  };

  const handlePost = async () => {
    if (!user || !newPost.trim()) return;

    if (!user.isPro) {
      toast.error('Upgrade to Pro to post in the community!');
      return;
    }

    try {
      const { default: dataService } = await import('../../services/dataService');
      const createdPost = await dataService.createCommunityPost({
        content: newPost.trim()
      });

      const post: Post = {
        id: createdPost._id,
        userId: createdPost.userId,
        userName: createdPost.userName,
        content: createdPost.content,
        likes: 0,
        comments: 0,
        timestamp: createdPost.createdAt,
        userPhase: user.phase
      };

      setPosts([post, ...posts]);
      setNewPost('');

      toast.success('Post shared with the community!');
      SoundEffects.play('success');

      // Send notification
      addNotification(user.id, {
        type: 'success',
        title: 'Post Shared! 💬',
        message: 'Your story has been shared with the community. Thank you for being vulnerable!'
      });
    } catch (error) {
      console.error('Failed to create post:', error);
      toast.error('Failed to share post');
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const { default: dataService } = await import('../../services/dataService');
      await dataService.likeCommunityPost(postId);

      const updatedPosts = posts.map(p => {
        if (p.id === postId) {
          const isLiking = !likedPosts.has(postId);
          return { ...p, likes: isLiking ? p.likes + 1 : p.likes - 1 };
        }
        return p;
      });

      if (likedPosts.has(postId)) {
        setLikedPosts(prev => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
      } else {
        setLikedPosts(prev => new Set(prev).add(postId));
        SoundEffects.play('click');
      }

      setPosts(updatedPosts);
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <PremiumIcon Icon={Users} size="md" variant="3d" gradient="from-[#FB7185] to-[#F472B6]" />
          <h2 className="gradient-text">Healing Community</h2>
        </div>
        <p className="text-gray-600">Connect with others on the same journey. Share, support, and heal together.</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="card-3d p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <PremiumIcon Icon={Users} size="sm" variant="flat" gradient="from-[#6366F1] to-[#8B5CF6]" />
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Active</span>
          </div>
          <div className="text-3xl font-bold gradient-text mb-1">1.2K</div>
          <p className="text-sm text-gray-500">Members Online</p>
        </div>

        <div className="card-3d p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <PremiumIcon Icon={MessageCircle} size="sm" variant="flat" gradient="from-[#8B5CF6] to-[#FB7185]" />
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Today</span>
          </div>
          <div className="text-3xl font-bold gradient-text mb-1">127</div>
          <p className="text-sm text-gray-500">New Posts</p>
        </div>

        <div className="card-3d p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <PremiumIcon Icon={Heart} size="sm" variant="flat" gradient="from-[#FB7185] to-[#F472B6]" />
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Given</span>
          </div>
          <div className="text-3xl font-bold gradient-text mb-1">3.4K</div>
          <p className="text-sm text-gray-500">Support Given</p>
        </div>
      </div>

      {/* Create Post */}
      <div className="card-3d p-6 rounded-2xl mb-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white font-semibold shadow-lg flex-shrink-0">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder={user?.isPro ? "Share your journey, offer support, or ask for advice..." : "Upgrade to Pro to post in the community..."}
              disabled={!user?.isPro}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#8B5CF6] focus:outline-none transition-all resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                {!user?.isPro && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Sparkles className="w-4 h-4 text-[#6366F1]" />
                    <span>Pro members can post</span>
                  </div>
                )}
              </div>
              <button
                onClick={handlePost}
                disabled={!newPost.trim() || !user?.isPro}
                className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Topics */}
      <div className="mb-8">
        <h4 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#6366F1]" />
          Trending Topics
        </h4>
        <div className="flex flex-wrap gap-2">
          {['No Contact Tips', 'Self-Love Journey', 'Moving Forward', 'Daily Wins', 'Support Needed'].map((topic) => (
            <button
              key={topic}
              className="px-4 py-2 bg-gradient-to-r from-[#6366F1]/10 to-[#8B5CF6]/10 border border-[#6366F1]/20 rounded-full text-sm font-medium text-[#6366F1] hover:from-[#6366F1]/20 hover:to-[#8B5CF6]/20 transition-all hover:scale-105"
            >
              #{topic.replace(/\s/g, '')}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Feed */}
      <div>
        <h4 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-[#8B5CF6]" />
          Community Feed
        </h4>

        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="card-3d p-6 rounded-2xl hover:shadow-xl transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white font-semibold shadow-lg flex-shrink-0">
                  {post.userName.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h5 className="font-semibold text-gray-900">{post.userName}</h5>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs px-2 py-1 bg-gradient-to-r from-[#6366F1]/10 to-[#8B5CF6]/10 rounded-full text-[#6366F1] font-medium">
                      {post.userPhase}
                    </span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">{getTimeAgo(post.timestamp)}</span>
                  </div>

                  <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>

                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-2 transition-all hover:scale-110 ${likedPosts.has(post.id) ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                        }`}
                    >
                      <Heart className={`w-5 h-5 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                      <span className="text-sm font-medium">{post.likes}</span>
                    </button>

                    <button className="flex items-center gap-2 text-gray-500 hover:text-[#8B5CF6] transition-all hover:scale-110">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">{post.comments}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-6 py-3 border-2 border-gray-200 rounded-xl text-gray-600 hover:border-[#6366F1] hover:text-[#6366F1] transition-all">
          Load More Posts
        </button>
      </div>

      {/* Community Guidelines */}
      <div className="mt-8 relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1] via-[#8B5CF6] to-[#FB7185]" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative p-8 text-white">
          <div className="flex items-start gap-4">
            <PremiumIcon Icon={Award} size="lg" variant="flat" gradient="from-white to-white/90" />
            <div>
              <h4 className="text-white font-semibold mb-2">Community Guidelines</h4>
              <ul className="space-y-2 text-white/90 text-sm">
                <li>• Be kind and supportive to everyone</li>
                <li>• Share your authentic journey</li>
                <li>• No judgment, only understanding</li>
                <li>• Respect everyone's privacy</li>
                <li>• Celebrate wins, big or small</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
