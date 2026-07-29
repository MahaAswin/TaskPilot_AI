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
import Planner from '../pages/planner/Planner';
import Tasks from '../pages/tasks/Tasks';
import Knowledge from '../pages/knowledge/Knowledge';
import Learning from '../pages/learning/Learning';
import Creative from '../pages/creative/Creative';
import Analytics from '../pages/analytics/Analytics';
import Profile from '../pages/profile/Profile';
import Settings from '../pages/settings/Settings';

import PlanningCanvasPage from '../pages/planner/PlanningCanvasPage';
import SkillCenter from '../pages/skills/SkillCenter';
import ProductivityCenter from '../pages/productivity/ProductivityCenter';
import OrchestratorCenter from '../pages/orchestrator/OrchestratorCenter';
import AIProviderCenter from '../pages/ai/AIProviderCenter';
import SecurityAI from '../pages/security/SecurityAI';
import ScannerAgent from '../pages/security/ScannerAgent';
import SpamAgent from '../pages/security/SpamAgent';
import PhoneAgent from '../pages/security/PhoneAgent';
import EmailAgent from '../pages/email/EmailAgent';
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
        <Route path="/planner" element={<Planner />} />
        <Route path="/planning-canvas" element={<PlanningCanvasPage />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/skills" element={<SkillCenter />} />
        <Route path="/productivity" element={<ProductivityCenter />} />
        <Route path="/orchestrator" element={<OrchestratorCenter />} />
        <Route path="/email-agent" element={<EmailAgent />} />
        <Route path="/ai-providers" element={<AIProviderCenter />} />
        <Route path="/security-ai" element={<ScannerAgent />} />
        <Route path="/scanner-agent" element={<ScannerAgent />} />
        <Route path="/spam-agent" element={<SpamAgent />} />
        <Route path="/email-security-agent" element={<SpamAgent />} />
        <Route path="/phone-agent" element={<PhoneAgent />} />
        <Route path="/phone-intelligence-agent" element={<PhoneAgent />} />



        <Route path="/knowledge" element={<Knowledge />} />
        <Route path="/learning" element={<Learning />} />
        <Route path="/creative" element={<Creative />} />
        <Route path="/analytics" element={<Analytics />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>


      {/* 4. Protected Full-Bleed Workspace Canvas */}
      <Route element={<WorkspaceLayout />}>
        <Route path="/workspace" element={<Workspace />} />
        <Route path="/planning-canvas-full" element={<PlanningCanvasPage />} />
      </Route>

      {/* Error Fallback Pages */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
