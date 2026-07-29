import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout Imports
import MainLayout from '../layouts/MainLayout';
import AuthenticationLayout from '../layouts/AuthenticationLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import WorkspaceLayout from '../layouts/WorkspaceLayout';

// Page Imports
import Landing from '../pages/Landing';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import Dashboard from '../pages/dashboard/Dashboard';
import Workspace from '../pages/workspace/Workspace';
import Learning from '../pages/learning/Learning';
import Creative from '../pages/creative/Creative';
import Profile from '../pages/profile/Profile';
import Settings from '../pages/settings/Settings';

import SkillCenter from '../pages/skills/SkillCenter';
import EmailAgent from '../pages/email/EmailAgent';
import EmailCoach from '../pages/email/EmailCoach';
import EmailBriefing from '../pages/email/EmailBriefing';
import CareerIntelligence from '../pages/career/CareerIntelligence';
import DocumentGenerator from '../pages/document/DocumentGenerator';
import JobApplication from '../pages/jobApplication/JobApplication';
import NotFound from '../pages/error/NotFound';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. Public Portal Page */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Landing />} />
      </Route>

      {/* 2. Public Auth Gateway Pages */}
      <Route element={<AuthenticationLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* 3. Protected Dashboard Pages */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/skills" element={<SkillCenter />} />
        <Route path="/career-intelligence" element={<CareerIntelligence />} />
        <Route path="/document-generator" element={<DocumentGenerator />} />
        <Route path="/job-application" element={<JobApplication />} />
        <Route path="/email-briefing" element={<EmailBriefing />} />
        <Route path="/email-coach" element={<EmailCoach />} />
        <Route path="/email-agent" element={<EmailAgent />} />



        <Route path="/learning" element={<Learning />} />
        <Route path="/creative" element={<Creative />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>


      {/* 4. Protected Full-Bleed Workspace Canvas */}
      <Route element={<WorkspaceLayout />}>
        <Route path="/workspace" element={<Workspace />} />
      </Route>

      {/* Error Fallback Pages */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
