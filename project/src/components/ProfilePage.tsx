import React, { useState } from 'react';
import { 
  User, 
  Edit3, 
  Camera, 
  Flame, 
  Trophy, 
  CheckCircle, 
  Star, 
  Award, 
  Calendar,
  Smile,
  Target,
  Zap
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  badge: string;
  completedDate: string;
}

interface MoodEntry {
  id: string;
  mood: string;
  emoji: string;
  date: string;
  note?: string;
}

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'achievements' | 'mood'>('achievements');

  // Mock data
  const userProfile = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    currentStreak: 15,
    longestStreak: 42,
    habitsCompleted: 218,
    joinDate: "January 2024"
  };

  const achievements: Achievement[] = [
    {
      id: "1",
      title: "30-Day Champion",
      description: "Completed 30 consecutive days of habits",
      badge: "🏆",
      completedDate: "July 20, 2024"
    },
    {
      id: "2",
      title: "Early Bird",
      description: "Completed morning routine 50 times",
      badge: "🌅",
      completedDate: "July 15, 2024"
    },
    {
      id: "3",
      title: "Consistency King",
      description: "Maintained a 14-day streak",
      badge: "👑",
      completedDate: "July 10, 2024"
    },
    {
      id: "4",
      title: "Habit Master",
      description: "Completed 200+ habits total",
      badge: "⭐",
      completedDate: "July 5, 2024"
    }
  ];

  const moodHistory: MoodEntry[] = [
    {
      id: "1",
      mood: "Happy",
      emoji: "😊",
      date: "July 24, 2024",
      note: "Great workout session today!"
    },
    {
      id: "2",
      mood: "Motivated",
      emoji: "💪",
      date: "July 23, 2024",
      note: "Feeling energized and ready to tackle goals"
    },
    {
      id: "3",
      mood: "Calm",
      emoji: "😌",
      date: "July 22, 2024",
      note: "Peaceful meditation session"
    },
    {
      id: "4",
      mood: "Excited",
      emoji: "🎉",
      date: "July 21, 2024",
      note: "Hit a new personal record!"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Profile</h1>
          <p className="text-gray-600">Manage your profile and track your progress</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-8">
              {/* Avatar Section */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <img
                    src={userProfile.avatar}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 shadow-lg"
                  />
                  <button className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
                    <Camera size={16} />
                  </button>
                </div>
                <button className="mt-4 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 mx-auto">
                  <Camera size={16} />
                  Change Picture
                </button>
              </div>

              {/* User Info */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{userProfile.name}</h2>
                <p className="text-gray-600 mb-1">{userProfile.email}</p>
                <p className="text-sm text-gray-500">Member since {userProfile.joinDate}</p>
              </div>

              {/* Edit Profile Button */}
              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium">
                <Edit3 size={18} />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Right Column - Stats & Activity */}
          <div className="lg:col-span-2 space-y-8">
            {/* Statistics Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-2 mb-6">
                <Star className="text-blue-600" size={24} />
                <h3 className="text-xl font-bold text-gray-900">Statistics</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Current Streak */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <Flame className="text-orange-500" size={24} />
                    <span className="text-2xl font-bold text-orange-600">{userProfile.currentStreak}</span>
                  </div>
                  <h4 className="font-semibold text-gray-900">Current Streak</h4>
                  <p className="text-sm text-gray-600">Days in a row</p>
                </div>

                {/* Longest Streak */}
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200">
                  <div className="flex items-center justify-between mb-2">
                    <Trophy className="text-yellow-500" size={24} />
                    <span className="text-2xl font-bold text-yellow-600">{userProfile.longestStreak}</span>
                  </div>
                  <h4 className="font-semibold text-gray-900">Longest Streak</h4>
                  <p className="text-sm text-gray-600">Personal best</p>
                </div>

                {/* Habits Completed */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle className="text-green-500" size={24} />
                    <span className="text-2xl font-bold text-green-600">{userProfile.habitsCompleted}</span>
                  </div>
                  <h4 className="font-semibold text-gray-900">Habits Completed</h4>
                  <p className="text-sm text-gray-600">Total count</p>
                </div>
              </div>
            </div>

            {/* Activity Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-2 mb-6">
                <Zap className="text-blue-600" size={24} />
                <h3 className="text-xl font-bold text-gray-900">Activity</h3>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('achievements')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    activeTab === 'achievements'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Award size={16} />
                  Achievements
                </button>
                <button
                  onClick={() => setActiveTab('mood')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    activeTab === 'mood'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Smile size={16} />
                  Mood History
                </button>
              </div>

              {/* Tab Content */}
              <div className="min-h-[300px]">
                {activeTab === 'achievements' && (
                  <div className="space-y-4">
                    {achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="text-2xl">{achievement.badge}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {achievement.title}
                          </h4>
                          <p className="text-gray-600 text-sm mb-2">
                            {achievement.description}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar size={12} />
                            {achievement.completedDate}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'mood' && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 mb-6">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{moodHistory[0]?.emoji}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Last Mood: {moodHistory[0]?.mood}
                          </h4>
                          <p className="text-sm text-gray-600">{moodHistory[0]?.date}</p>
                        </div>
                      </div>
                    </div>

                    {moodHistory.map((mood) => (
                      <div
                        key={mood.id}
                        className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="text-2xl">{mood.emoji}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{mood.mood}</h4>
                            <span className="text-xs text-gray-500">{mood.date}</span>
                          </div>
                          {mood.note && (
                            <p className="text-gray-600 text-sm">{mood.note}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;