// Productivity Coach Agent Mock Dataset

export const PRODUCTIVITY_STATS = {
  productivityScore: 88,
  todayFocusTime: '3h 45m',
  focusHours: 28.5,
  learningHours: 18.2,
  taskCompletionRate: 85,
  consistencyScore: 92,
  currentStreak: 14,
  goalsCompleted: 8,
  achievementsCount: 12
};

export const TIME_ANALYSIS = [
  { category: 'Learning Time', hours: 18.2, percentage: 35, color: 'bg-indigo-500' },
  { category: 'Task Time', hours: 15.0, percentage: 28, color: 'bg-purple-500' },
  { category: 'Coding Time', hours: 10.5, percentage: 20, color: 'bg-emerald-500' },
  { category: 'Revision Time', hours: 5.3, percentage: 10, color: 'bg-amber-500' },
  { category: 'Break Time', hours: 3.5, percentage: 7, color: 'bg-slate-300' }
];

export const FOCUS_SESSIONS = [
  { id: 'fs-1', title: 'Deep Work: Java Concurrency & Threads', duration: '50m', breakDuration: '10m', distractionCount: 1, quality: 'High', date: 'Today, 10:00 AM' },
  { id: 'fs-2', title: 'LeetCode DSA Array Problems', duration: '45m', breakDuration: '5m', distractionCount: 0, quality: 'Optimal', date: 'Today, 2:30 PM' },
  { id: 'fs-3', title: 'SQL Indexing Query Practice', duration: '30m', breakDuration: '5m', distractionCount: 2, quality: 'Good', date: 'Yesterday, 4:00 PM' },
  { id: 'fs-4', title: 'System Design Architecture Diagrams', duration: '60m', breakDuration: '15m', distractionCount: 0, quality: 'Optimal', date: 'July 26, 2026' }
];

export const DAILY_REPORT = {
  date: 'July 28, 2026',
  tasksCompleted: 6,
  studyTime: '4h 15m',
  focusTime: '3h 45m',
  xpEarned: 180,
  achievements: ['Focus Master', 'Streak Keeper'],
  highlights: [
    'Completed 100% of high priority DSA tasks',
    'Achieved 0 distractions during 45m focus session',
    'Logged 4.2 hours of study time across 3 modules'
  ],
  areasForImprovement: 'Consider scheduling evening revision before 9 PM to avoid fatigue.'
};

export const WEEKLY_REPORT = {
  period: 'July 21 – July 28, 2026',
  weeklyProductivity: 88,
  weeklyLearning: '24.5 hrs',
  skillImprovement: '+6.2%',
  taskCompletion: '85% (18/21 Tasks)',
  habitConsistency: '92% (14 Day Streak)',
  summary: 'Outstanding productivity week! Focus time increased by +12% compared to last week.'
};

export const MONTHLY_REPORT = {
  period: 'July 2026',
  monthlySummary: 'Accomplished 8 major milestones across Java, Database Systems, and System Design.',
  goalsCompleted: 8,
  hoursInvested: 112,
  achievementsUnlocked: 5
};

export const HABIT_ANALYTICS = {
  dailyConsistency: '92%',
  habitStreak: 14,
  missedDays: 2,
  completionPercentage: 88,
  habitsList: [
    { title: 'Morning DSA Practice', streak: 14, completion: 90 },
    { title: 'System Design Review', streak: 8, completion: 82 },
    { title: 'Read Technical Docs', streak: 12, completion: 88 },
    { title: 'Evening Code Cleanup', streak: 6, completion: 75 }
  ]
};

export const GOALS_PROGRESS = [
  { id: 'g-1', title: 'Master Java Spring Boot Microservices', totalMilestones: 5, completedMilestones: 4, progress: 80, estimatedCompletion: 'Aug 10, 2026', status: 'In Progress' },
  { id: 'g-2', title: 'Solve 150 LeetCode Medium Problems', totalMilestones: 10, completedMilestones: 9, progress: 90, estimatedCompletion: 'Aug 05, 2026', status: 'Near Completion' },
  { id: 'g-3', title: 'Build TaskPilot AI Enterprise Engine', totalMilestones: 8, completedMilestones: 8, progress: 100, estimatedCompletion: 'Completed Today', status: 'Completed' }
];

export const RECOMMENDATIONS = [
  { id: 'rec-1', title: 'Increase DSA Practice Frequency', category: 'Focus', impact: 'High Impact', reason: 'Adding a 30m morning DSA session will raise your task completion speed by 15%.', actionText: 'Schedule Focus Block' },
  { id: 'rec-2', title: 'Revise Java Collections Framework', category: 'Learning', impact: 'Medium Impact', reason: 'Revising HashMap internals ensures 100% quiz accuracy on backend topics.', actionText: 'Start 20m Revision' },
  { id: 'rec-3', title: 'Improve Sleep & Rest Schedule', category: 'Wellbeing', impact: 'High Impact', reason: 'Ending study sessions by 10 PM improves morning focus timer quality.', actionText: 'Set Evening Alert' },
  { id: 'rec-4', title: 'Reduce Mobile Phone Distractions', category: 'Time', impact: 'High Impact', reason: 'Enabling Focus Mode during coding sessions will eliminate phone notifications.', actionText: 'Enable Focus Mode' }
];

export const INSIGHTS_TIMELINE = [
  { id: 'ins-1', title: 'Highest Productivity Day', description: 'Scored 96/100 productivity score with 5h 30m focus time logged.', date: 'July 26, 2026', icon: 'Sparkles' },
  { id: 'ins-2', title: 'Longest Study Session', description: 'Completed a 2-hour uninterrupted deep work session on System Design.', date: 'July 24, 2026', icon: 'Clock' },
  { id: 'ins-3', title: 'Biggest Skill Improvement', description: 'Database Systems score jumped from 78% to 88% in 3 days.', date: 'July 22, 2026', icon: 'TrendingUp' },
  { id: 'ins-4', title: 'Consistency Milestone', description: 'Reached a 14-day unbroken daily plan execution streak.', date: 'July 20, 2026', icon: 'Flame' }
];

export default {
  PRODUCTIVITY_STATS,
  TIME_ANALYSIS,
  FOCUS_SESSIONS,
  DAILY_REPORT,
  WEEKLY_REPORT,
  MONTHLY_REPORT,
  HABIT_ANALYTICS,
  GOALS_PROGRESS,
  RECOMMENDATIONS,
  INSIGHTS_TIMELINE
};
