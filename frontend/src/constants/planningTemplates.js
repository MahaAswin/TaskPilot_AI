// Pre-built Planning Templates for TaskPilot AI Planning Canvas

export const SAMPLE_PROMPTS = [
  "I have placements in 2 months.",
  "I want to master Java.",
  "I want to become a Cyber Security Engineer.",
  "I want to lose weight.",
  "I want to complete my final year project.",
  "I want to crack GATE CSE exam in 6 months.",
  "I want to build an AI SaaS Startup in 30 days."
];

export const PLANNING_TEMPLATES = [
  {
    id: 'placement_prep',
    title: 'Placement Preparation',
    category: 'Career',
    durationDays: 60,
    estimatedHours: 180,
    difficulty: 'Advanced',
    icon: 'Briefcase',
    badge: 'Popular',
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50/60 border-blue-200 text-blue-700',
    description: 'Comprehensive 60-day roadmap covering DSA, System Design, OS, DBMS, Networks, Aptitude, and Mock Interviews.',
    goal: {
      title: 'Tier-1 Tech Company Placement Preparation',
      description: 'Master core Data Structures & Algorithms, CS fundamentals, System Design concepts, and resume building for campus & off-campus hiring.',
      priority: 'high',
      deadline: '2026-09-30',
      estimatedHours: 180,
      difficulty: 'Advanced',
      category: 'Career',
      durationDays: 60,
      completion: 35,
      status: 'In Progress'
    },
    canvasNodes: [
      { id: 'node-1', type: 'milestone', title: 'DSA Core Foundation', week: 'Week 1-2', status: 'completed', x: 100, y: 150, progress: 100, branches: ['node-2', 'node-3'] },
      { id: 'node-2', type: 'branch', title: 'Advanced Graphs & DP', week: 'Week 3-4', status: 'in_progress', x: 340, y: 80, progress: 60, branches: ['node-4'] },
      { id: 'node-3', type: 'branch', title: 'CS Fundamentals & OS', week: 'Week 3-4', status: 'in_progress', x: 340, y: 220, progress: 40, branches: ['node-4'] },
      { id: 'node-4', type: 'milestone', title: 'LLD & System Design', week: 'Week 5-6', status: 'pending', x: 580, y: 150, progress: 0, branches: ['node-5'] },
      { id: 'node-5', type: 'milestone', title: 'Mock Interviews & Hiring', week: 'Week 7-8', status: 'pending', x: 820, y: 150, progress: 0, branches: [] }
    ],
    timelinePhases: [
      { label: 'Week 1', title: 'Arrays, Strings & Recursion', status: 'completed', completion: 100 },
      { label: 'Week 2', title: 'Linked Lists, Stacks & Queues', status: 'completed', completion: 100 },
      { label: 'Week 3', title: 'Trees, Graphs & Dynamic Prog.', status: 'in_progress', completion: 60 },
      { label: 'Week 4', title: 'DBMS, OS & Computer Networks', status: 'in_progress', completion: 30 },
      { label: 'Month 2', title: 'System Design & Portfolio Projects', status: 'pending', completion: 0 }
    ],
    milestones: [
      {
        id: 'm-1',
        title: 'Phase 1: DSA Problem Solving (200 Problems)',
        targetDate: 'Week 2 End',
        status: 'completed',
        riskLevel: 'Low',
        deliverables: ['Solve 50 Easy LeetCode', 'Solve 100 Medium LeetCode', 'Master Binary Search & Two Pointers'],
        dependencies: ['Basic Syntax & Recursion']
      },
      {
        id: 'm-2',
        title: 'Phase 2: CS Core Subjects Mastery',
        targetDate: 'Week 4 End',
        status: 'in_progress',
        riskLevel: 'Medium',
        deliverables: ['SQL Queries & Indexing', 'OS Process Management & Deadlocks', 'TCP/IP Model & HTTP/HTTPS Protocols'],
        dependencies: ['Phase 1 DSA']
      },
      {
        id: 'm-3',
        title: 'Phase 3: Low Level & High Level System Design',
        targetDate: 'Week 6 End',
        status: 'pending',
        riskLevel: 'High',
        deliverables: ['Object Oriented Design Patterns', 'Scalable Architecture (Load Balancers, Caching)', 'Design URL Shortener & Chat App'],
        dependencies: ['Phase 2 Core CS']
      },
      {
        id: 'm-4',
        title: 'Phase 4: Behavioral & Company-Specific Prep',
        targetDate: 'Week 8 End',
        status: 'pending',
        riskLevel: 'Low',
        deliverables: ['Resume ATS Optimization', 'STAR Method Behavioral Prep', '10 Live Peer Mock Interviews'],
        dependencies: ['Phase 3 System Design']
      }
    ],
    weeklyPlan: [
      {
        week: 'Week 1',
        title: 'Arrays, Sliding Window & Hash Maps',
        hoursEstimated: 25,
        progress: 100,
        objectives: ['Master Two Pointers pattern', 'Understand Hash Map lookup optimization', 'Solve 30 Array problems'],
        topics: ['Arrays', 'Two Pointers', 'Sliding Window', 'Hash Tables'],
        tasks: [
          { id: 'wt-1', title: 'Solve Two Sum, 3Sum, Container With Most Water', completed: true },
          { id: 'wt-2', title: 'Study Sliding Window Maximum pattern', completed: true },
          { id: 'wt-3', title: 'Implement Hash Map with Collision Handling in Java/C++', completed: true }
        ]
      },
      {
        week: 'Week 2',
        title: 'Trees & Graph Traversal Algorithms',
        hoursEstimated: 28,
        progress: 80,
        objectives: ['Implement BFS and DFS from scratch', 'Solve Binary Tree Traversals', 'Graph Cycle Detection'],
        topics: ['Binary Trees', 'BST', 'BFS', 'DFS', 'Dijkstra'],
        tasks: [
          { id: 'wt-4', title: 'Inorder, Preorder, Postorder Iterative Traversal', completed: true },
          { id: 'wt-5', title: 'Lowest Common Ancestor & Diameter of Tree', completed: true },
          { id: 'wt-6', title: 'Number of Islands & Course Schedule (Topological Sort)', completed: false }
        ]
      },
      {
        week: 'Week 3',
        title: 'Dynamic Programming & Backtracking',
        hoursEstimated: 30,
        progress: 40,
        objectives: ['Understand Memoization vs Tabulation', '1D and 2D DP Patterns', 'Backtracking N-Queens'],
        topics: ['Knapsack DP', 'LCS', 'LIS', 'Subset Sum', 'Backtracking'],
        tasks: [
          { id: 'wt-7', title: '0/1 Knapsack & Unbounded Knapsack variations', completed: true },
          { id: 'wt-8', title: 'Longest Common Subsequence & Edit Distance', completed: false },
          { id: 'wt-9', title: 'Word Search & Sudoku Solver Backtracking', completed: false }
        ]
      },
      {
        week: 'Week 4',
        title: 'Operating Systems & DBMS Fundamentals',
        hoursEstimated: 22,
        progress: 10,
        objectives: ['Master SQL Joins & Normalization', 'Process vs Threads', 'Memory Management'],
        topics: ['Process Sync', 'Deadlocks', 'ACID Properties', 'Indexes', 'B-Trees'],
        tasks: [
          { id: 'wt-10', title: 'Practice 20 Complex LeetCode Database Queries', completed: true },
          { id: 'wt-11', title: 'Study Mutex, Semaphore, and Dining Philosophers Problem', completed: false },
          { id: 'wt-12', title: 'Read Virtual Memory, Paging, and Page Faults', completed: false }
        ]
      }
    ],
    dailyPlan: [
      {
        slot: 'morning',
        label: 'Morning Slot',
        time: '6:00 AM – 12:00 PM',
        focus: 'Hard DSA Problem Solving',
        tasks: [
          { id: 'dt-1', title: 'Solve 2 LeetCode Medium/Hard DP Problems', duration: '120 min', priority: 'high', completed: true },
          { id: 'dt-2', title: 'Review Spaced Repetition Flashcards on Time Complexities', duration: '30 min', priority: 'medium', completed: true }
        ]
      },
      {
        slot: 'afternoon',
        label: 'Afternoon Slot',
        time: '12:00 PM – 6:00 PM',
        focus: 'Core Computer Science Theory',
        tasks: [
          { id: 'dt-3', title: 'Study Operating System Process Synchronization', duration: '90 min', priority: 'high', completed: false },
          { id: 'dt-4', title: 'Practice SQL Indexing & Query Optimization', duration: '60 min', priority: 'medium', completed: false }
        ]
      },
      {
        slot: 'evening',
        label: 'Evening Slot',
        time: '6:00 PM – 10:00 PM',
        focus: 'System Design & Project Review',
        tasks: [
          { id: 'dt-5', title: 'Watch System Design Primer: URL Shortener', duration: '60 min', priority: 'high', completed: false },
          { id: 'dt-6', title: 'Refactor Full Stack Project Readme & GitHub', duration: '45 min', priority: 'low', completed: false }
        ]
      },
      {
        slot: 'night',
        label: 'Night Slot',
        time: '10:00 PM – 12:00 AM',
        focus: 'Aptitude & Revision',
        tasks: [
          { id: 'dt-7', title: 'Solve 15 Quantitative Aptitude Questions', duration: '45 min', priority: 'medium', completed: false },
          { id: 'dt-8', title: 'Plan Schedule for Tomorrow', duration: '15 min', priority: 'low', completed: true }
        ]
      }
    ],
    resources: [
      { id: 'r-1', category: 'Videos', title: 'NeetCode 150 DSA Playlist', type: 'YouTube', link: '#', rating: '4.9 ★', badge: 'Essential' },
      { id: 'r-2', category: 'Books', title: 'Cracking the Coding Interview (6th Ed.)', type: 'Book', link: '#', rating: '4.8 ★', badge: 'Recommended' },
      { id: 'r-3', category: 'Articles', title: 'System Design Primer GitHub', type: 'Docs', link: '#', rating: '5.0 ★', badge: 'Top Rated' },
      { id: 'r-4', category: 'Practice Problems', title: 'LeetCode Top Interview 150', type: 'Coding', link: '#', rating: '4.9 ★', badge: 'Practice' },
      { id: 'r-5', category: 'Projects', title: 'Distributed Key-Value Store Project', type: 'GitHub', link: '#', rating: '4.7 ★', badge: 'Portfolio' }
    ],
    risks: [
      { id: 'rk-1', title: 'Weak Topic: Dynamic Programming 2D', severity: 'High', category: 'Weak Topics', mitigation: 'Dedicate 1 hour daily exclusively to grid DP patterns.' },
      { id: 'rk-2', title: 'Pending Tasks: 45 Unsolved Graph Problems', severity: 'Medium', category: 'Pending Tasks', mitigation: 'Group problems by BFS/DFS pattern rather than random solving.' },
      { id: 'rk-3', title: 'Time Constraint: 14 Days Remaining for Phase 2', severity: 'High', category: 'Time Constraints', mitigation: 'Increase daily focus blocks from 4 hours to 6 hours.' },
      { id: 'rk-4', title: 'Upcoming Deadline: Amazon Campus Online Assessment', severity: 'Critical', category: 'Upcoming Deadlines', mitigation: 'Complete Amazon previous year tagged questions on LeetCode.' }
    ],
    suggestions: [
      { id: 'sg-1', title: 'Increase Study Hours by 1.5h Daily', tag: 'Intensity', description: 'Based on target deadline, boosting daily hours ensures 100% curriculum coverage.', actionText: 'Apply Schedule Change' },
      { id: 'sg-2', title: 'Revise Core Java Concurrency Concepts', tag: 'Revision', description: 'Multithreading and ExecutorService are frequently tested in technical rounds.', actionText: 'Add to Revision Queue' },
      { id: 'sg-3', title: 'Practice 5 Hard DSA Problems Under Timer', tag: 'Speed', description: 'Simulate speed conditions to overcome online assessment anxiety.', actionText: 'Start Timed Quiz' },
      { id: 'sg-4', title: 'Schedule 2 Mock System Design Sessions', tag: 'Interview', description: 'Peer feedback on whiteboard diagrams will double system design confidence.', actionText: 'Book Mock Partner' }
    ],
    progressMetrics: {
      overall: 42,
      weekly: 75,
      daily: 50,
      milestone: 50,
      completedTasks: 18,
      totalTasks: 45,
      streakDays: 14
    }
  },
  {
    id: 'software_engineer',
    title: 'Software Engineer Roadmap',
    category: 'Software',
    durationDays: 90,
    estimatedHours: 240,
    difficulty: 'Intermediate',
    icon: 'Code',
    badge: 'Trending',
    color: 'from-indigo-500 to-purple-600',
    bgColor: 'bg-indigo-50/60 border-indigo-200 text-indigo-700',
    description: 'Full-stack engineering path covering Frontend, Backend, Databases, Microservices, CI/CD, and Docker.',
    goal: {
      title: 'Full Stack Software Engineer Mastery',
      description: 'Build modern high-concurrency web applications using React, Node.js, TypeScript, PostgreSQL, Redis, Docker, and Kubernetes.',
      priority: 'high',
      deadline: '2026-10-30',
      estimatedHours: 240,
      difficulty: 'Intermediate',
      category: 'Software',
      durationDays: 90,
      completion: 20,
      status: 'In Progress'
    },
    canvasNodes: [
      { id: 'node-1', type: 'milestone', title: 'TypeScript & React Architecture', week: 'Week 1-3', status: 'completed', x: 100, y: 150, progress: 100, branches: ['node-2'] },
      { id: 'node-2', type: 'branch', title: 'Node.js & Express REST/GraphQL APIs', week: 'Week 4-6', status: 'in_progress', x: 340, y: 150, progress: 50, branches: ['node-3', 'node-4'] },
      { id: 'node-3', type: 'branch', title: 'PostgreSQL, Redis & ORM', week: 'Week 7-8', status: 'pending', x: 580, y: 80, progress: 0, branches: ['node-5'] },
      { id: 'node-4', type: 'branch', title: 'Docker, AWS & CI/CD Pipelines', week: 'Week 7-8', status: 'pending', x: 580, y: 220, progress: 0, branches: ['node-5'] },
      { id: 'node-5', type: 'milestone', title: 'Cap-Stone Microservices Project', week: 'Week 9-12', status: 'pending', x: 820, y: 150, progress: 0, branches: [] }
    ],
    timelinePhases: [
      { label: 'Week 1-3', title: 'Frontend Mastery (React, Next.js, TS)', status: 'completed', completion: 100 },
      { label: 'Week 4-6', title: 'Backend Systems & API Architecture', status: 'in_progress', completion: 50 },
      { label: 'Week 7-8', title: 'Databases, Caching & Cloud Ops', status: 'pending', completion: 0 },
      { label: 'Month 3', title: 'Production Deployment & Scale Testing', status: 'pending', completion: 0 }
    ],
    milestones: [
      { id: 'm-1', title: 'Phase 1: React & Design System Component Architecture', targetDate: 'Week 3', status: 'completed', riskLevel: 'Low', deliverables: ['Custom UI Component Library', 'Global State Management', 'Performance Optimization'], dependencies: ['JavaScript ES6+'] },
      { id: 'm-2', title: 'Phase 2: Scalable Node.js Backend API Microservices', targetDate: 'Week 6', status: 'in_progress', riskLevel: 'Medium', deliverables: ['Authentication (JWT/OAuth)', 'Rate Limiting & Security Headers', 'Swagger OpenAPI Documentation'], dependencies: ['Phase 1'] },
      { id: 'm-3', title: 'Phase 3: Database Indexing, Caching & Message Queues', targetDate: 'Week 9', status: 'pending', riskLevel: 'Medium', deliverables: ['Prisma PostgreSQL Setup', 'Redis Cache Layer', 'RabbitMQ Event Bus'], dependencies: ['Phase 2'] },
      { id: 'm-4', title: 'Phase 4: Docker Containerization & Cloud Deployment', targetDate: 'Week 12', status: 'pending', riskLevel: 'High', deliverables: ['Multi-stage Dockerfile', 'GitHub Actions CI/CD Pipeline', 'Deploy to AWS ECS/EKS'], dependencies: ['Phase 3'] }
    ],
    weeklyPlan: [
      { week: 'Week 1', title: 'Advanced React Patterns & Custom Hooks', hoursEstimated: 20, progress: 100, objectives: ['Master useReducer & Context', 'Build custom data fetching hooks'], topics: ['React', 'Custom Hooks', 'State Management'], tasks: [{ id: 'w1', title: 'Build reusable table component with pagination', completed: true }] },
      { week: 'Week 2', title: 'TypeScript Integration & Strict Typing', hoursEstimated: 22, progress: 85, objectives: ['Generics, Utility Types, Discriminated Unions'], topics: ['TypeScript', 'Generics'], tasks: [{ id: 'w2', title: 'Migrate React codebase to TypeScript without any types', completed: true }] }
    ],
    dailyPlan: [
      { slot: 'morning', label: 'Morning Slot', time: '8:00 AM – 12:00 PM', focus: 'Backend API Development', tasks: [{ id: 'd1', title: 'Implement Refresh Token Auth Workflow', duration: '90 min', priority: 'high', completed: true }] },
      { slot: 'afternoon', label: 'Afternoon Slot', time: '1:00 PM – 5:00 PM', focus: 'Database Queries', tasks: [{ id: 'd2', title: 'Optimize PostgreSQL JOINs with EXPLAIN ANALYZE', duration: '60 min', priority: 'medium', completed: false }] }
    ],
    resources: [
      { id: 'r1', category: 'Videos', title: 'Full Stack Open University Course', type: 'Course', link: '#', rating: '5.0 ★', badge: 'Recommended' },
      { id: 'r2', category: 'Books', title: 'Designing Data-Intensive Applications', type: 'Book', link: '#', rating: '5.0 ★', badge: 'Must Read' }
    ],
    risks: [
      { id: 'rk1', title: 'Weak Topic: Redis Pub/Sub Architecture', severity: 'Medium', category: 'Weak Topics', mitigation: 'Build a small chat proof-of-concept.' }
    ],
    suggestions: [
      { id: 'sg1', title: 'Set Up Automated Unit Test Suite with Jest', tag: 'Testing', description: 'Adding test coverage early prevents regression during deployment.', actionText: 'Generate Test Config' }
    ],
    progressMetrics: { overall: 20, weekly: 60, daily: 40, milestone: 25, completedTasks: 8, totalTasks: 40, streakDays: 7 }
  },
  {
    id: 'cyber_security',
    title: 'Cyber Security Roadmap',
    category: 'Cyber Security',
    durationDays: 120,
    estimatedHours: 300,
    difficulty: 'Advanced',
    icon: 'Shield',
    badge: 'High Demand',
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-50/60 border-emerald-200 text-emerald-700',
    description: 'Ethical Hacking, Penetration Testing, Network Security, Wireshark, Metasploit, and Web Security (OWASP Top 10).',
    goal: {
      title: 'Become a Certified Ethical Hacker & Security Engineer',
      description: 'Master Network Security Protocols, Penetration Testing Methodology, OWASP Top 10 Vulnerabilities, Linux Administration, and TryHackMe CTF challenges.',
      priority: 'high',
      deadline: '2026-11-30',
      estimatedHours: 300,
      difficulty: 'Advanced',
      category: 'Cyber Security',
      durationDays: 120,
      completion: 15,
      status: 'In Progress'
    },
    canvasNodes: [
      { id: 'node-1', type: 'milestone', title: 'Networking Fundamentals & Linux', week: 'Month 1', status: 'completed', x: 100, y: 150, progress: 100, branches: ['node-2'] },
      { id: 'node-2', type: 'branch', title: 'OWASP Top 10 Web Vulnerabilities', week: 'Month 2', status: 'in_progress', x: 340, y: 150, progress: 40, branches: ['node-3'] },
      { id: 'node-3', type: 'milestone', title: 'Network Pentesting & Metasploit', week: 'Month 3', status: 'pending', x: 580, y: 150, progress: 0, branches: ['node-4'] },
      { id: 'node-4', type: 'milestone', title: 'Active Directory & CTF Mastery', week: 'Month 4', status: 'pending', x: 820, y: 150, progress: 0, branches: [] }
    ],
    timelinePhases: [
      { label: 'Month 1', title: 'Linux Command Line, TCP/IP & Wireshark', status: 'completed', completion: 100 },
      { label: 'Month 2', title: 'Web App Security (SQLi, XSS, CSRF, IDOR)', status: 'in_progress', completion: 40 },
      { label: 'Month 3', title: 'Privilege Escalation & Burp Suite', status: 'pending', completion: 0 },
      { label: 'Month 4', title: 'TryHackMe Top 20 CTF Rooms & EJPT Cert', status: 'pending', completion: 0 }
    ],
    milestones: [
      { id: 'm-1', title: 'Network Reconnaissance & Traffic Analysis', targetDate: 'Month 1 End', status: 'completed', riskLevel: 'Low', deliverables: ['Nmap Advanced Port Scanning', 'Wireshark Packet Analysis', 'Subdomain Enumeration'], dependencies: ['Networking Essentials'] },
      { id: 'm-2', title: 'Web Application Security Exploitation', targetDate: 'Month 2 End', status: 'in_progress', riskLevel: 'High', deliverables: ['Exploit SQL Injection Manually & via SQLMap', 'XSS Payload Delivery', 'Bypass Authentication'], dependencies: ['Phase 1'] }
    ],
    weeklyPlan: [
      { week: 'Week 1', title: 'Linux Kernel & Bash Scripting for Automation', hoursEstimated: 20, progress: 100, objectives: ['Write port scanner bash script', 'Understand File Permissions & Chmod'], topics: ['Linux', 'Bash'], tasks: [{ id: 'cs1', title: 'Complete TryHackMe Linux Fundamentals 1, 2, 3', completed: true }] }
    ],
    dailyPlan: [
      { slot: 'morning', label: 'Morning Slot', time: '7:00 AM – 10:00 AM', focus: 'Port Scanning & Recon', tasks: [{ id: 'cd1', title: 'Nmap Scan Target Subnet and Catalog Services', duration: '90 min', priority: 'high', completed: true }] }
    ],
    resources: [
      { id: 'cr1', category: 'Practice Problems', title: 'PortSwigger Web Security Academy', type: 'Labs', link: '#', rating: '5.0 ★', badge: 'Gold Standard' }
    ],
    risks: [
      { id: 'crk1', title: 'Weak Topic: Buffer Overflow & Assembly Basics', severity: 'High', category: 'Weak Topics', mitigation: 'Study x86 assembly registers and gdb tool.' }
    ],
    suggestions: [
      { id: 'csg1', title: 'Practice 3 CTF Rooms on HackTheBox Weekly', tag: 'CTF', description: 'Hands-on box rooted challenges build real penetration testing skills.', actionText: 'Launch Box' }
    ],
    progressMetrics: { overall: 15, weekly: 50, daily: 30, milestone: 20, completedTasks: 5, totalTasks: 35, streakDays: 9 }
  },
  {
    id: 'dsa_roadmap',
    title: 'DSA Master Roadmap',
    category: 'Academics',
    durationDays: 45,
    estimatedHours: 150,
    difficulty: 'Intermediate',
    icon: 'Cpu',
    badge: 'Popular',
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50/60 border-amber-200 text-amber-700',
    description: 'Data Structures & Algorithms from Scratch to Hard: Arrays, Strings, Trees, Graphs, DP, Tries, Segment Trees.',
    goal: {
      title: 'Complete Master Roadmap for Data Structures & Algorithms',
      description: 'Solve 250+ curated LeetCode problems covering pattern-based problem solving for coding interviews.',
      priority: 'high',
      deadline: '2026-09-15',
      estimatedHours: 150,
      difficulty: 'Intermediate',
      category: 'Academics',
      durationDays: 45,
      completion: 50,
      status: 'In Progress'
    },
    canvasNodes: [
      { id: 'node-1', type: 'milestone', title: 'Arrays & Math Patterns', week: 'Week 1', status: 'completed', x: 100, y: 150, progress: 100, branches: ['node-2'] },
      { id: 'node-2', type: 'milestone', title: 'Linked Lists, Stacks & Queues', week: 'Week 2', status: 'completed', x: 340, y: 150, progress: 100, branches: ['node-3'] },
      { id: 'node-3', type: 'branch', title: 'Trees & Heaps', week: 'Week 3-4', status: 'in_progress', x: 580, y: 150, progress: 50, branches: ['node-4'] },
      { id: 'node-4', type: 'milestone', title: 'Graphs & Dynamic Programming', week: 'Week 5-6', status: 'pending', x: 820, y: 150, progress: 0, branches: [] }
    ],
    timelinePhases: [
      { label: 'Week 1', title: 'Arrays, Two Pointers & Binary Search', status: 'completed', completion: 100 },
      { label: 'Week 2', title: 'Stack Monotonic, Queue & Linked List', status: 'completed', completion: 100 },
      { label: 'Week 3-4', title: 'Trees, BST, Priority Queue & Graphs', status: 'in_progress', completion: 50 },
      { label: 'Week 5-6', title: '1D & 2D Dynamic Programming Patterns', status: 'pending', completion: 0 }
    ],
    milestones: [
      { id: 'm-1', title: 'Linear Data Structures (100 Problems)', targetDate: 'Week 2', status: 'completed', riskLevel: 'Low', deliverables: ['Reverse Linked List', 'Valid Parentheses', 'Search in Rotated Array'], dependencies: ['Basic C++/Java'] }
    ],
    weeklyPlan: [
      { week: 'Week 1', title: 'Binary Search & Two Pointers', hoursEstimated: 25, progress: 100, objectives: ['Master rotated array binary search'], topics: ['Binary Search'], tasks: [{ id: 'dsa1', title: 'Solve Koko Eating Bananas LeetCode Medium', completed: true }] }
    ],
    dailyPlan: [
      { slot: 'morning', label: 'Morning Slot', time: '6:30 AM – 9:30 AM', focus: 'Tree Traversal Problems', tasks: [{ id: 'dsad1', title: 'Serialize and Deserialize Binary Tree', duration: '60 min', priority: 'high', completed: true }] }
    ],
    resources: [
      { id: 'dsar1', category: 'Articles', title: 'Striver A2Z DSA Sheet', type: 'Sheet', link: '#', rating: '5.0 ★', badge: 'Top Rated' }
    ],
    risks: [
      { id: 'dsark1', title: 'Time Constraint: 15 Days Left for DP', severity: 'Medium', category: 'Time Constraints', mitigation: 'Focus on top 15 DP patterns.' }
    ],
    suggestions: [
      { id: 'dsasg1', title: 'Practice Daily LeetCode Streak', tag: 'Consistency', description: 'Daily 1 problem keeps algorithmic thinking sharp.', actionText: 'Open LeetCode' }
    ],
    progressMetrics: { overall: 50, weekly: 80, daily: 65, milestone: 50, completedTasks: 25, totalTasks: 50, streakDays: 18 }
  },
  {
    id: 'gate_prep',
    title: 'GATE Preparation Roadmap',
    category: 'Competitive Exam',
    durationDays: 180,
    estimatedHours: 400,
    difficulty: 'Expert',
    icon: 'Award',
    badge: 'Exam Prep',
    color: 'from-purple-500 to-pink-600',
    bgColor: 'bg-purple-50/60 border-purple-200 text-purple-700',
    description: 'Computer Science GATE Syllabus: TOC, Compiler Design, COA, OS, DBMS, Digital Logic, Math, and Mock Tests.',
    goal: {
      title: 'GATE CS Exam AIR under 100 Strategy',
      description: 'Complete 10 Core CS subjects, solve 15 years of Previous Year Questions (PYQs), and attempt 20 full-length mock tests.',
      priority: 'high',
      deadline: '2027-02-10',
      estimatedHours: 400,
      difficulty: 'Expert',
      category: 'Competitive Exam',
      durationDays: 180,
      completion: 10,
      status: 'In Progress'
    },
    canvasNodes: [
      { id: 'node-1', type: 'milestone', title: 'Engineering Math & Discrete Math', week: 'Month 1', status: 'completed', x: 100, y: 150, progress: 100, branches: ['node-2'] },
      { id: 'node-2', type: 'branch', title: 'TOC & Compiler Design', week: 'Month 2-3', status: 'in_progress', x: 340, y: 150, progress: 30, branches: ['node-3'] },
      { id: 'node-3', type: 'milestone', title: 'COA & Digital Logic', week: 'Month 4', status: 'pending', x: 580, y: 150, progress: 0, branches: ['node-4'] },
      { id: 'node-4', type: 'milestone', title: 'PYQ Series & Test Series', week: 'Month 5-6', status: 'pending', x: 820, y: 150, progress: 0, branches: [] }
    ],
    timelinePhases: [
      { label: 'Month 1-2', title: 'Mathematics, Aptitude & Digital Logic', status: 'completed', completion: 100 },
      { label: 'Month 3-4', title: 'TOC, Compiler, OS, DBMS & COA', status: 'in_progress', completion: 30 },
      { label: 'Month 5', title: 'Computer Networks & Algorithms', status: 'pending', completion: 0 },
      { label: 'Month 6', title: 'Subject-wise Tests & National Mocks', status: 'pending', completion: 0 }
    ],
    milestones: [
      { id: 'm-1', title: 'Complete Math & Discrete Math PYQs', targetDate: 'Month 1', status: 'completed', riskLevel: 'Low', deliverables: ['Linear Algebra', 'Calculus', 'Graph Theory', 'Group Theory'], dependencies: ['Math Basics'] }
    ],
    weeklyPlan: [
      { week: 'Week 1', title: 'Finite Automata & Regular Expressions', hoursEstimated: 25, progress: 90, objectives: ['DFA construction & NFA conversion'], topics: ['TOC'], tasks: [{ id: 'g1', title: 'Solve GATE 2010 to 2024 TOC Questions', completed: true }] }
    ],
    dailyPlan: [
      { slot: 'morning', label: 'Morning Slot', time: '6:00 AM – 9:00 AM', focus: 'TOC Pumping Lemma & Context Free Grammars', tasks: [{ id: 'gd1', title: 'Practice 20 Numerical Answer Type (NAT) Questions', duration: '90 min', priority: 'high', completed: true }] }
    ],
    resources: [
      { id: 'gr1', category: 'Books', title: 'Higher Engineering Mathematics - B.S. Grewal', type: 'Book', link: '#', rating: '4.9 ★', badge: 'Standard' }
    ],
    risks: [
      { id: 'grk1', title: 'Weak Topic: COA Cache Mapping & Pipelining Hazards', severity: 'Critical', category: 'Weak Topics', mitigation: 'Re-watch NPTEL lecture series on COA.' }
    ],
    suggestions: [
      { id: 'gsg1', title: 'Take Weekly Sectional Test Every Sunday', tag: 'Test', description: 'Sectional tests identify weak subject modules early.', actionText: 'Start Test' }
    ],
    progressMetrics: { overall: 10, weekly: 40, daily: 20, milestone: 15, completedTasks: 6, totalTasks: 60, streakDays: 5 }
  },
  {
    id: 'final_year_project',
    title: 'Final Year Project',
    category: 'Project',
    durationDays: 45,
    estimatedHours: 120,
    difficulty: 'Intermediate',
    icon: 'FolderGit2',
    badge: 'Academic',
    color: 'from-cyan-500 to-blue-600',
    bgColor: 'bg-cyan-50/60 border-cyan-200 text-cyan-700',
    description: 'End-to-End Capstone Project execution: Problem Statement, Architecture, Implementation, Research Paper & Final Presentation.',
    goal: {
      title: 'AI-Powered Smart Task Automation Capstone Project',
      description: 'Develop a high-impact final year project with full frontend UI, backend agent architecture, research publication, and presentation demo.',
      priority: 'high',
      deadline: '2026-08-30',
      estimatedHours: 120,
      difficulty: 'Intermediate',
      category: 'Project',
      durationDays: 45,
      completion: 60,
      status: 'In Progress'
    },
    canvasNodes: [
      { id: 'node-1', type: 'milestone', title: 'Literature Survey & Synopsis', week: 'Week 1', status: 'completed', x: 100, y: 150, progress: 100, branches: ['node-2'] },
      { id: 'node-2', type: 'milestone', title: 'System Design & Data Pipeline', week: 'Week 2-3', status: 'completed', x: 340, y: 150, progress: 100, branches: ['node-3'] },
      { id: 'node-3', type: 'branch', title: 'Full Stack Implementation', week: 'Week 4-5', status: 'in_progress', x: 580, y: 150, progress: 60, branches: ['node-4'] },
      { id: 'node-4', type: 'milestone', title: 'Paper Writing & Demo Defense', week: 'Week 6', status: 'pending', x: 820, y: 150, progress: 0, branches: [] }
    ],
    timelinePhases: [
      { label: 'Week 1', title: 'Project Approval & SRS Documentation', status: 'completed', completion: 100 },
      { label: 'Week 2-3', title: 'System Architecture & Database Design', status: 'completed', completion: 100 },
      { label: 'Week 4-5', title: 'Core Agent Modules & UI Dashboard', status: 'in_progress', completion: 60 },
      { label: 'Week 6', title: 'IEEE Research Paper Submission & Final Viva', status: 'pending', completion: 0 }
    ],
    milestones: [
      { id: 'm-1', title: 'SRS & Architecture Final Approval', targetDate: 'Week 2', status: 'completed', riskLevel: 'Low', deliverables: ['UML Diagrams', 'ER Diagrams', 'API Specification'], dependencies: ['Guide Approval'] }
    ],
    weeklyPlan: [
      { week: 'Week 1', title: 'System Requirements & Research Papers Review', hoursEstimated: 18, progress: 100, objectives: ['Review 10 IEEE papers'], topics: ['Survey'], tasks: [{ id: 'p1', title: 'Submit Project Synopsis Document', completed: true }] }
    ],
    dailyPlan: [
      { slot: 'morning', label: 'Morning Slot', time: '9:00 AM – 1:00 PM', focus: 'Backend Agent Integration', tasks: [{ id: 'pd1', title: 'Wireframe AI Canvas Component Layout', duration: '120 min', priority: 'high', completed: true }] }
    ],
    resources: [
      { id: 'pr1', category: 'Articles', title: 'IEEE Template LaTeX Format', type: 'Doc', link: '#', rating: '4.8 ★', badge: 'Official' }
    ],
    risks: [
      { id: 'prk1', title: 'Upcoming Deadline: Final Project Defense Viva in 14 Days', severity: 'High', category: 'Upcoming Deadlines', mitigation: 'Prepare 20-slide presentation deck.' }
    ],
    suggestions: [
      { id: 'psg1', title: 'Record a 3-Minute Video Demo of Working App', tag: 'Presentation', description: 'A crisp live demo video impresses internal evaluators.', actionText: 'Record Demo' }
    ],
    progressMetrics: { overall: 60, weekly: 75, daily: 70, milestone: 50, completedTasks: 15, totalTasks: 25, streakDays: 12 }
  },
  {
    id: 'startup_planning',
    title: 'AI SaaS Startup Roadmap',
    category: 'Business',
    durationDays: 30,
    estimatedHours: 100,
    difficulty: 'Intermediate',
    icon: 'Rocket',
    badge: 'Business',
    color: 'from-rose-500 to-red-600',
    bgColor: 'bg-rose-50/60 border-rose-200 text-rose-700',
    description: 'Launch an AI SaaS from 0 to 1: Product Definition, MVP Build, Landing Page, Stripe Payments, and ProductHunt Launch.',
    goal: {
      title: 'Build & Launch an AI SaaS MVP in 30 Days',
      description: 'Validate target audience pain points, build scalable React + Node MVP, integrate Stripe monetization, and acquire first 100 beta users.',
      priority: 'high',
      deadline: '2026-08-31',
      estimatedHours: 100,
      difficulty: 'Intermediate',
      category: 'Business',
      durationDays: 30,
      completion: 40,
      status: 'In Progress'
    },
    canvasNodes: [
      { id: 'node-1', type: 'milestone', title: 'Market Validation & Landing Page', week: 'Week 1', status: 'completed', x: 100, y: 150, progress: 100, branches: ['node-2'] },
      { id: 'node-2', type: 'branch', title: 'MVP Core Feature Engineering', week: 'Week 2-3', status: 'in_progress', x: 340, y: 150, progress: 50, branches: ['node-3'] },
      { id: 'node-3', type: 'milestone', title: 'Stripe Billing & Auth Setup', week: 'Week 3-4', status: 'pending', x: 580, y: 150, progress: 0, branches: ['node-4'] },
      { id: 'node-4', type: 'milestone', title: 'ProductHunt & Twitter Launch', week: 'Week 4', status: 'pending', x: 820, y: 150, progress: 0, branches: [] }
    ],
    timelinePhases: [
      { label: 'Week 1', title: 'Landing Page & Waitlist Signup', status: 'completed', completion: 100 },
      { label: 'Week 2-3', title: 'MVP Development & AI API Integration', status: 'in_progress', completion: 50 },
      { label: 'Week 4', title: 'Beta Testing, ProductHunt Launch & Growth', status: 'pending', completion: 0 }
    ],
    milestones: [
      { id: 'm-1', title: '100 Waitlist Subscribers Milestone', targetDate: 'Week 1 End', status: 'completed', riskLevel: 'Low', deliverables: ['Framer Landing Page', 'ConvertKit Email Capture', 'Twitter Teaser'], dependencies: ['Idea Validation'] }
    ],
    weeklyPlan: [
      { week: 'Week 1', title: 'Validate Problem & Build Landing Page', hoursEstimated: 25, progress: 100, objectives: ['Collect 100 emails'], topics: ['Marketing'], tasks: [{ id: 's1', title: 'Launch Landing Page on Vercel', completed: true }] }
    ],
    dailyPlan: [
      { slot: 'morning', label: 'Morning Slot', time: '8:00 AM – 12:00 PM', focus: 'Stripe Subscription Webhook Integration', tasks: [{ id: 'sd1', title: 'Test Payment Checkout Flow in Sandbox', duration: '90 min', priority: 'high', completed: true }] }
    ],
    resources: [
      { id: 'sr1', category: 'Books', title: 'The Lean Startup by Eric Ries', type: 'Book', link: '#', rating: '4.9 ★', badge: 'Essential' }
    ],
    risks: [
      { id: 'srk1', title: 'Time Constraint: 10 Days to ProductHunt Launch', severity: 'High', category: 'Time Constraints', mitigation: 'Cut non-essential features for v1 MVP.' }
    ],
    suggestions: [
      { id: 'ssg1', title: 'Setup PostHog Analytics on Landing Page', tag: 'Analytics', description: 'Understand drop-off points before driving launch traffic.', actionText: 'Add Analytics Script' }
    ],
    progressMetrics: { overall: 40, weekly: 60, daily: 50, milestone: 30, completedTasks: 10, totalTasks: 25, streakDays: 10 }
  },
  {
    id: 'hackathon_prep',
    title: 'Hackathon Sprint Roadmap',
    category: 'Project',
    durationDays: 3,
    estimatedHours: 36,
    difficulty: 'Advanced',
    icon: 'Zap',
    badge: '48h Sprint',
    color: 'from-yellow-500 to-amber-600',
    bgColor: 'bg-yellow-50/60 border-yellow-200 text-yellow-700',
    description: '48-hour Intensive Hackathon Strategy: Brainstorming, Pitch Deck, Prototype Architecture, Video Demo, and Judging Presentation.',
    goal: {
      title: 'Win First Place in Global AI Hackathon',
      description: 'Build a working prototype in 48 hours, produce an engaging 2-minute video pitch, and present to judges.',
      priority: 'high',
      deadline: '2026-08-02',
      estimatedHours: 36,
      difficulty: 'Advanced',
      category: 'Project',
      durationDays: 3,
      completion: 25,
      status: 'In Progress'
    },
    canvasNodes: [
      { id: 'node-1', type: 'milestone', title: 'Idea Selection & Wireframes', week: 'Day 1', status: 'completed', x: 100, y: 150, progress: 100, branches: ['node-2'] },
      { id: 'node-2', type: 'branch', title: 'Backend APIs & Model Integration', week: 'Day 2', status: 'in_progress', x: 340, y: 150, progress: 50, branches: ['node-3'] },
      { id: 'node-3', type: 'milestone', title: 'Polish UI & Video Recording', week: 'Day 3', status: 'pending', x: 580, y: 150, progress: 0, branches: ['node-4'] },
      { id: 'node-4', type: 'milestone', title: 'Devpost Submission & Pitch', week: 'Day 3 End', status: 'pending', x: 820, y: 150, progress: 0, branches: [] }
    ],
    timelinePhases: [
      { label: 'Hour 0-12', title: 'Ideation, Git Repo & Architecture Setup', status: 'completed', completion: 100 },
      { label: 'Hour 12-30', title: 'Core Feature Coding Sprint', status: 'in_progress', completion: 50 },
      { label: 'Hour 30-48', title: 'UI Polish, Video Editing & Devpost Submission', status: 'pending', completion: 0 }
    ],
    milestones: [
      { id: 'm-1', title: 'Working Prototype Milestone', targetDate: 'Hour 30', status: 'in_progress', riskLevel: 'Critical', deliverables: ['Functional UI', 'Live API Response', 'Zero Crash Flow'], dependencies: ['Hackathon Kickoff'] }
    ],
    weeklyPlan: [
      { week: 'Day 1-3', title: '48-Hour Hackathon Blitz', hoursEstimated: 36, progress: 25, objectives: ['Ship working MVP'], topics: ['Hackathon'], tasks: [{ id: 'hk1', title: 'Finish Figma Wireframes & Component Specs', completed: true }] }
    ],
    dailyPlan: [
      { slot: 'morning', label: 'Morning Slot', time: '6:00 AM – 12:00 PM', focus: 'Backend API Endpoints Sprint', tasks: [{ id: 'hkd1', title: 'Connect Frontend Form to Mock API', duration: '90 min', priority: 'high', completed: true }] }
    ],
    resources: [
      { id: 'hkr1', category: 'Articles', title: 'Devpost Submission Guidelines', type: 'Doc', link: '#', rating: '4.9 ★', badge: 'Official' }
    ],
    risks: [
      { id: 'hkrk1', title: 'Time Constraint: 12 Hours Left Until Submission Deadline', severity: 'Critical', category: 'Time Constraints', mitigation: 'Freeze new features and record demo immediately.' }
    ],
    suggestions: [
      { id: 'hksg1', title: 'Draft Video Script Before Recording', tag: 'Pitch', description: 'A clear storytelling arc increases winning probability.', actionText: 'Open Script Template' }
    ],
    progressMetrics: { overall: 25, weekly: 30, daily: 40, milestone: 25, completedTasks: 4, totalTasks: 16, streakDays: 3 }
  },
  {
    id: 'interview_prep',
    title: 'Interview Preparation Strategy',
    category: 'Career',
    durationDays: 14,
    estimatedHours: 40,
    difficulty: 'Intermediate',
    icon: 'UserCheck',
    badge: '14 Days',
    color: 'from-violet-500 to-indigo-600',
    bgColor: 'bg-violet-50/60 border-violet-200 text-violet-700',
    description: 'Rapid 14-day Sprint for Technical & Behavioral Interviews: Top 50 LeetCode, STAR Storytelling, Mock Round Practice.',
    goal: {
      title: '14-Day Fast-Track Tech Interview Preparation',
      description: 'Refine communication, practice 50 high-frequency coding questions, master system design patterns, and rehearse HR behavioral questions.',
      priority: 'high',
      deadline: '2026-08-15',
      estimatedHours: 40,
      difficulty: 'Intermediate',
      category: 'Career',
      durationDays: 14,
      completion: 45,
      status: 'In Progress'
    },
    canvasNodes: [
      { id: 'node-1', type: 'milestone', title: 'Resume Review & STAR Behavioral', week: 'Days 1-3', status: 'completed', x: 100, y: 150, progress: 100, branches: ['node-2'] },
      { id: 'node-2', type: 'milestone', title: 'High-Frequency Coding Patterns', week: 'Days 4-8', status: 'in_progress', x: 340, y: 150, progress: 60, branches: ['node-3'] },
      { id: 'node-3', type: 'milestone', title: 'System Design Speed Revision', week: 'Days 9-11', status: 'pending', x: 580, y: 150, progress: 0, branches: ['node-4'] },
      { id: 'node-4', type: 'milestone', title: 'Live Mock Interviews with Seniors', week: 'Days 12-14', status: 'pending', x: 820, y: 150, progress: 0, branches: [] }
    ],
    timelinePhases: [
      { label: 'Day 1-3', title: 'Behavioral Prep & Projects Refresh', status: 'completed', completion: 100 },
      { label: 'Day 4-8', title: 'Top 50 Blind LeetCode Questions', status: 'in_progress', completion: 60 },
      { label: 'Day 9-11', title: 'LLD & High Level System Design Blitz', status: 'pending', completion: 0 },
      { label: 'Day 12-14', title: 'Peer Mock Interviews & Final Polish', status: 'pending', completion: 0 }
    ],
    milestones: [
      { id: 'm-1', title: 'Behavioral STAR Stories Prepared', targetDate: 'Day 3', status: 'completed', riskLevel: 'Low', deliverables: ['5 Conflict Resolution Stories', '5 Leadership Stories', '3 Failure & Learning Stories'], dependencies: ['Resume'] }
    ],
    weeklyPlan: [
      { week: 'Week 1', title: 'High Frequency Coding Patterns Blitz', hoursEstimated: 20, progress: 80, objectives: ['Solve Top 30 Blind LeetCode'], topics: ['Coding'], tasks: [{ id: 'ip1', title: 'Practice Thinking Out Loud for 10 problems', completed: true }] }
    ],
    dailyPlan: [
      { slot: 'morning', label: 'Morning Slot', time: '8:00 AM – 11:00 AM', focus: 'Coding Interview Simulation', tasks: [{ id: 'ipd1', title: 'Solve 2 LeetCode Mediums on Whiteboard/Paper', duration: '90 min', priority: 'high', completed: true }] }
    ],
    resources: [
      { id: 'ipr1', category: 'Articles', title: 'Tech Interview Handbook by Yangshun Tay', type: 'Guide', link: '#', rating: '5.0 ★', badge: 'Must Read' }
    ],
    risks: [
      { id: 'iprk1', title: 'Pending Tasks: 15 System Design Diagrams', severity: 'Medium', category: 'Pending Tasks', mitigation: 'Review pre-drawn architectural diagrams.' }
    ],
    suggestions: [
      { id: 'ipsg1', title: 'Conduct Peer Mock Interview Today', tag: 'Mock', description: 'Simulating actual interview environment reduces panic.', actionText: 'Schedule Mock' }
    ],
    progressMetrics: { overall: 45, weekly: 70, daily: 50, milestone: 40, completedTasks: 9, totalTasks: 20, streakDays: 6 }
  },
  {
    id: 'custom_plan',
    title: 'Custom AI Plan Builder',
    category: 'Personal',
    durationDays: 30,
    estimatedHours: 90,
    difficulty: 'Beginner',
    icon: 'Sliders',
    badge: 'Flexible',
    color: 'from-slate-600 to-slate-800',
    bgColor: 'bg-slate-50/60 border-slate-200 text-slate-700',
    description: 'Blank slate canvas customizable for any personal goal, skill acquisition, fitness target, or habit building schedule.',
    goal: {
      title: 'My Custom Goal & Personal Execution Roadmap',
      description: 'Describe any custom objective in natural language to dynamically adapt timelines, milestones, weekly objectives, and daily time slots.',
      priority: 'medium',
      deadline: '2026-08-31',
      estimatedHours: 90,
      difficulty: 'Beginner',
      category: 'Personal',
      durationDays: 30,
      completion: 0,
      status: 'Draft'
    },
    canvasNodes: [
      { id: 'node-1', type: 'milestone', title: 'Goal Orientation & Foundations', week: 'Week 1', status: 'pending', x: 100, y: 150, progress: 0, branches: ['node-2'] },
      { id: 'node-2', type: 'branch', title: 'Core Execution Phase A', week: 'Week 2', status: 'pending', x: 340, y: 150, progress: 0, branches: ['node-3'] },
      { id: 'node-3', type: 'branch', title: 'Core Execution Phase B', week: 'Week 3', status: 'pending', x: 580, y: 150, progress: 0, branches: ['node-4'] },
      { id: 'node-4', type: 'milestone', title: 'Goal Completion & Review', week: 'Week 4', status: 'pending', x: 820, y: 150, progress: 0, branches: [] }
    ],
    timelinePhases: [
      { label: 'Week 1', title: 'Initial Planning & Setup', status: 'pending', completion: 0 },
      { label: 'Week 2', title: 'Building Momentum', status: 'pending', completion: 0 },
      { label: 'Week 3', title: 'Deep Work & Refinement', status: 'pending', completion: 0 },
      { label: 'Week 4', title: 'Finalization & Delivery', status: 'pending', completion: 0 }
    ],
    milestones: [
      { id: 'm-1', title: 'Custom Milestone 1: Initial Setup Complete', targetDate: 'Week 1 End', status: 'pending', riskLevel: 'Low', deliverables: ['Define Scope', 'Gather Tools'], dependencies: [] }
    ],
    weeklyPlan: [
      { week: 'Week 1', title: 'Foundation & Habits Setup', hoursEstimated: 15, progress: 0, objectives: ['Set daily routine'], topics: ['Setup'], tasks: [{ id: 'cp1', title: 'Configure personal dashboard and notification alerts', completed: false }] }
    ],
    dailyPlan: [
      { slot: 'morning', label: 'Morning Slot', time: '7:00 AM – 9:00 AM', focus: 'Primary Goal Focus Block', tasks: [{ id: 'cpd1', title: 'Execute Morning Goal Task', duration: '60 min', priority: 'high', completed: false }] }
    ],
    resources: [
      { id: 'cpr1', category: 'Articles', title: 'TaskPilot Goal Setting Best Practices', type: 'Guide', link: '#', rating: '5.0 ★', badge: 'Guide' }
    ],
    risks: [
      { id: 'cprk1', title: 'Risk: Maintaining Daily Consistency', severity: 'Low', category: 'Weak Topics', mitigation: 'Set daily calendar reminders.' }
    ],
    suggestions: [
      { id: 'cpsg1', title: 'Add Specific Metrics to Custom Goal', tag: 'Clarity', description: 'Measurable targets double achievement rates.', actionText: 'Refine Goal' }
    ],
    progressMetrics: { overall: 0, weekly: 0, daily: 0, milestone: 0, completedTasks: 0, totalTasks: 20, streakDays: 0 }
  }
];

export default {
  SAMPLE_PROMPTS,
  PLANNING_TEMPLATES
};
