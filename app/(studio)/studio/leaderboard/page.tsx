'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface LeaderboardEntry {
  rank: number;
  userId: number;
  userName: string | null;
  userEmail: string;
  totalPoints: number;
  lessonsCompleted: number;
  coursesCompleted: number;
}

interface LeaderboardData {
  leaderboard: LeaderboardEntry[];
  currentUser: LeaderboardEntry | null;
}

const rankIcons = [
  { icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-100' },
  { icon: Medal, color: 'text-gray-400', bg: 'bg-gray-100' },
  { icon: Award, color: 'text-amber-600', bg: 'bg-amber-100' },
];

export default function LeaderboardPage() {
  const { data, isLoading } = useSWR<LeaderboardData>(
    '/api/leaderboard',
    fetcher
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Leaderboard</h1>
        <p className="text-gray-500 mt-1">
          See how you rank among other members
        </p>
      </div>

      {/* Current User Stats */}
      {data?.currentUser && (
        <Card className="bg-gradient-to-r from-[#3B3937] to-[#5a5654] text-white border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#CDA7B2] flex items-center justify-center">
                <span className="text-2xl font-bold text-[#3B3937]">
                  #{data.currentUser.rank}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-white/70 text-sm">Your Ranking</p>
                <p className="text-2xl font-bold">
                  {data.currentUser.totalPoints.toLocaleString()} points
                </p>
              </div>
              <div className="text-right">
                <p className="text-white/70 text-sm">
                  {data.currentUser.lessonsCompleted} lessons completed
                </p>
                <p className="text-white/70 text-sm">
                  {data.currentUser.coursesCompleted} courses completed
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard */}
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Top Performers
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 animate-pulse"
                >
                  <div className="w-8 h-8 bg-gray-200 rounded-full" />
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-24" />
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-20" />
                </div>
              ))}
            </div>
          ) : data?.leaderboard && data.leaderboard.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {data.leaderboard.map((entry, index) => {
                const rankStyle = rankIcons[index] || null;
                const isCurrentUser =
                  data.currentUser?.userId === entry.userId;

                return (
                  <div
                    key={entry.userId}
                    className={`flex items-center gap-4 p-4 ${
                      isCurrentUser ? 'bg-[#CDA7B2]/5' : ''
                    }`}
                  >
                    {/* Rank */}
                    <div className="w-8 text-center">
                      {rankStyle ? (
                        <div
                          className={`w-8 h-8 rounded-full ${rankStyle.bg} flex items-center justify-center`}
                        >
                          <rankStyle.icon
                            className={`w-4 h-4 ${rankStyle.color}`}
                          />
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-gray-400">
                          {entry.rank}
                        </span>
                      )}
                    </div>

                    {/* Avatar */}
                    <Avatar className="w-10 h-10">
                      <AvatarFallback
                        className={`${
                          isCurrentUser
                            ? 'bg-[#CDA7B2] text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {(entry.userName || entry.userEmail)
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium truncate ${
                          isCurrentUser ? 'text-[#CDA7B2]' : 'text-gray-900'
                        }`}
                      >
                        {entry.userName || 'Member'}
                        {isCurrentUser && (
                          <span className="text-xs ml-2 text-gray-500">
                            (You)
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500">
                        {entry.lessonsCompleted} lessons •{' '}
                        {entry.coursesCompleted} courses
                      </p>
                    </div>

                    {/* Points */}
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        {entry.totalPoints.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">points</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">
                No rankings yet
              </h3>
              <p className="text-gray-500">
                Complete lessons to earn points and appear on the leaderboard!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
