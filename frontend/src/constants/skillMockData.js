// Skill Analyzer Agent Mock Dataset

export const SKILL_LEVELS = [
  'Beginner',
  'Learner',
  'Intermediate',
  'Advanced',
  'Expert',
  'Master',
  'Elite',
  'Legend'
];

export const SKILL_CATEGORIES = [
  { id: 'cat-1', title: 'Java Programming', score: 85, level: 'Master', category: 'Backend', color: 'from-amber-500 to-orange-600', topicsCount: 14, masteredCount: 11, progress: 85, icon: 'Code' },
  { id: 'cat-2', title: 'Data Structures & Algorithms', score: 78, level: 'Advanced', category: 'Computer Science', color: 'from-blue-500 to-indigo-600', topicsCount: 20, masteredCount: 14, progress: 78, icon: 'Cpu' },
  { id: 'cat-3', title: 'Database Systems & SQL', score: 88, level: 'Master', category: 'Data', color: 'from-emerald-500 to-teal-600', topicsCount: 12, masteredCount: 10, progress: 88, icon: 'Database' },
  { id: 'cat-4', title: 'Operating Systems', score: 72, level: 'Intermediate', category: 'Core CS', color: 'from-purple-500 to-indigo-600', topicsCount: 10, masteredCount: 6, progress: 72, icon: 'HardDrive' },
  { id: 'cat-5', title: 'Computer Networks', score: 68, level: 'Intermediate', category: 'Core CS', color: 'from-cyan-500 to-blue-600', topicsCount: 10, masteredCount: 5, progress: 68, icon: 'Network' },
  { id: 'cat-6', title: 'Cyber Security', score: 60, level: 'Learner', category: 'Security', color: 'from-rose-500 to-red-600', topicsCount: 15, masteredCount: 6, progress: 60, icon: 'Shield' },
  { id: 'cat-7', title: 'Machine Learning', score: 55, level: 'Learner', category: 'AI', color: 'from-pink-500 to-purple-600', topicsCount: 12, masteredCount: 4, progress: 55, icon: 'Sparkles' },
  { id: 'cat-8', title: 'System Design', score: 75, level: 'Advanced', category: 'Architecture', color: 'from-violet-500 to-purple-600', topicsCount: 16, masteredCount: 10, progress: 75, icon: 'LayoutGrid' },
  { id: 'cat-9', title: 'React Frontend Development', score: 92, level: 'Elite', category: 'Frontend', color: 'from-sky-400 to-blue-500', topicsCount: 18, masteredCount: 16, progress: 92, icon: 'Layers' },
  { id: 'cat-10', title: 'Spring Boot Microservices', score: 80, level: 'Expert', category: 'Backend', color: 'from-emerald-600 to-teal-700', topicsCount: 14, masteredCount: 11, progress: 80, icon: 'Server' }
];

export const TOPIC_ANALYSIS = [
  { id: 'tp-1', topic: 'Binary Trees & BST Traversals', category: 'DSA', score: 90, progress: 90, confidence: 'High', practiceCount: 45, quizAccuracy: '94%', studyTime: '12h 30m', masteryLevel: 'Master' },
  { id: 'tp-2', topic: 'Dynamic Programming 2D Memoization', category: 'DSA', score: 62, progress: 62, confidence: 'Medium', practiceCount: 22, quizAccuracy: '68%', studyTime: '18h 15m', masteryLevel: 'Intermediate' },
  { id: 'tp-3', topic: 'SQL Indexing & B-Trees', category: 'Database', score: 88, progress: 88, confidence: 'High', practiceCount: 30, quizAccuracy: '90%', studyTime: '8h 45m', masteryLevel: 'Master' },
  { id: 'tp-4', topic: 'Operating System Process Synchronization', category: 'OS', score: 70, progress: 70, confidence: 'Medium', practiceCount: 18, quizAccuracy: '75%', studyTime: '9h 10m', masteryLevel: 'Intermediate' },
  { id: 'tp-5', topic: 'TCP/IP 4-Layer Architecture & Handshake', category: 'Networks', score: 65, progress: 65, confidence: 'Medium', practiceCount: 15, quizAccuracy: '70%', studyTime: '6h 30m', masteryLevel: 'Learner' },
  { id: 'tp-6', topic: 'System Design Load Balancers & Caching', category: 'System Design', score: 82, progress: 82, confidence: 'High', practiceCount: 28, quizAccuracy: '86%', studyTime: '14h 00m', masteryLevel: 'Expert' }
];

export const RADAR_DATA = [
  { domain: 'DSA', score: 78, target: 90 },
  { domain: 'Java', score: 85, target: 95 },
  { domain: 'Database', score: 88, target: 90 },
  { domain: 'OS', score: 72, target: 85 },
  { domain: 'Networks', score: 68, target: 80 },
  { domain: 'System Design', score: 75, target: 85 }
];

export const RECOMMENDATIONS = [
  { id: 'rec-1', title: 'Practice Arrays & Sliding Window', category: 'DSA', impact: 'High Impact', reason: 'Boosting array solving speed will elevate your overall DSA score from 78 to 85.', actionText: 'Start Practice Session' },
  { id: 'rec-2', title: 'Revise Java Collections Framework', category: 'Java', impact: 'Medium Impact', reason: 'Focusing on ConcurrentHashMap will solidify your Master rank in Java.', actionText: 'Review Collections' },
  { id: 'rec-3', title: 'Study SQL Joins & Query Tuning', category: 'Database', impact: 'High Impact', reason: 'Solving 5 complex join queries will unlock Database Elite status.', actionText: 'Solve SQL Queries' },
  { id: 'rec-4', title: 'Attempt Mock System Design Interview', category: 'System Design', impact: 'High Impact', reason: 'Peer review on URL Shortener whiteboard diagram will boost confidence.', actionText: 'Schedule Mock' },
  { id: 'rec-5', title: 'Complete Revision on OS Deadlocks', category: 'OS', impact: 'Medium Impact', reason: 'Reviewing Banker Algorithm ensures 100% OS syllabus coverage.', actionText: 'Start OS Revision' }
];

export const ACHIEVEMENTS = [
  { id: 'ach-1', title: 'Top Performer: React', description: 'Achieved 92% mastery score in React Frontend Architecture.', icon: 'Trophy', date: '2 days ago', badge: 'Elite' },
  { id: 'ach-2', title: 'Consistency Champion', description: 'Maintained an active 21-day learning and quiz streak.', icon: 'Flame', date: '1 week ago', badge: 'Gold' },
  { id: 'ach-3', title: 'Quick Learner: System Design', description: 'Mastered Load Balancers and Rate Limiters in under 10 hours.', icon: 'Zap', date: '2 weeks ago', badge: 'Speed' },
  { id: 'ach-4', title: 'Master Badge: SQL Databases', description: 'Achieved 90%+ quiz accuracy across all database modules.', icon: 'Database', date: '3 weeks ago', badge: 'Master' }
];

export const TIMELINE_GROWTH = [
  { week: 'Week 1', score: 62, topicMastered: 4, quizAvg: '72%' },
  { week: 'Week 2', score: 68, topicMastered: 8, quizAvg: '78%' },
  { week: 'Week 3', score: 74, topicMastered: 12, quizAvg: '82%' },
  { week: 'Week 4', score: 81, topicMastered: 16, quizAvg: '88%' }
];

export default {
  SKILL_LEVELS,
  SKILL_CATEGORIES,
  TOPIC_ANALYSIS,
  RADAR_DATA,
  RECOMMENDATIONS,
  ACHIEVEMENTS,
  TIMELINE_GROWTH
};
