"use client";

import Navbar from "@/lib/components/Navbar";
import { getCurrentUser, changePassword } from "@/lib/services/auth";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

import PageWrapper from "@/components/layout/PageWrapper";
import Container from "@/components/layout/Container";


import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import StatCard from "@/components/dashboard/StatCard";
import Avatar from "@/components/ui/Avatar";

import { ClipboardList, CheckCircle2, Clock3} from "lucide-react";
import EmptyState from "@/components/ui/states/EmptyState";
import Tooltip from "@/components/ui/Tooltip";
import Skeleton from "@/components/ui/Skeleton";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import ProfileCard from "@/components/profile/ProfileCard";

export default function ProfilePage() {
  const [user, setUser] = useState<{
    id: string;
    email: string;
    createdAt: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalInterviews: 0,
    completedInterviews: 0,
    pendingInterviews: 0,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [updatingPassword, setUpdatingPassword] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      const response = await getCurrentUser();
      setUser(response.user);
      setStats(response.stats);
    } catch (error) {
    const message =
      error instanceof AxiosError
        ? (error.response?.data as { message?: string })?.message
        : undefined;
  
    toast.error(message ?? "Failed to load profile");
  } finally {
      setLoading(false);
    }
  }, []);

  const handleChangePassword = async () => {

    if (updatingPassword) return;
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast.error("Please fill all fields");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      setUpdatingPassword(true);

      const response = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success(response.message);

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? (error.response?.data as { message?: string })?.message
          : undefined;
    
      toast.error(message ?? "Failed to update password");
    } finally {
      setUpdatingPassword(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);


  if (loading) {
    return (
    <ProtectedRoute>
      <PageWrapper>
        <Navbar />
        <Container className="max-w-4xl py-8">
          <GlassCard className="space-y-8 p-8">
            <div className="flex items-center gap-6">
              <Skeleton className="h-20 w-20 rounded-full" />
  
              <div className="space-y-3">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-5 w-64" />
                <Skeleton className="h-4 w-36" />
              </div>
            </div>
  
            <div className="grid gap-6 md:grid-cols-3">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
  
            <div className="space-y-4 border-t border-zinc-800 pt-8">
              <Skeleton className="h-8 w-52" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </GlassCard>
        </Container>
      </PageWrapper>
    </ProtectedRoute>
    );
  }
  
    if (!user) {
      return (
        <PageWrapper>
          <Navbar />
          <Container className="py-8">
            <EmptyState
              title="Profile not found"
              description="Unable to load your profile."
            />
          </Container>
        </PageWrapper>
      );
    }
    
  return (
  <ProtectedRoute>
    <PageWrapper>
      <Navbar />

      <Container className="max-w-4xl py-8">
        <GlassCard className="space-y-8 p-8 ">
          <ProfileCard
            name={user.email.split("@")[0]}
            email={user.email}
            role={`Joined ${new Date(user.createdAt).toLocaleDateString()}`}
            avatar={
              <Tooltip content={user.email}>
                <div>
                  <Avatar
                    name={user.email}
                    size="xl"
                    className="bg-primary text-white"
                  />
                </div>
              </Tooltip>
            }
          />

          <div className="grid gap-6 md:grid-cols-3">
            <StatCard
              title="Total Interviews"
              value={stats.totalInterviews}
              description="All interviews"
              icon={<ClipboardList className="h-6 w-6"/>}
            />
            <StatCard
              title="Completed"
              value={stats.completedInterviews}
              description="Finished interviews"
              icon={<CheckCircle2 className="h-6 w-6"/>}
            />
            <StatCard
              title="Pending"
              value={stats.pendingInterviews}
              description="Still is progress"
              icon={<Clock3 className="h-6 w-6"/>}
            />          
          </div>
          <div className="border-t border-zinc-800 pt-8">
          <h2 className="mb-6 text-2xl font-bold text-white">Change Password</h2>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleChangePassword(); }}>
            <Input type="password" autoComplete="current-password" disabled={updatingPassword} placeholder="Current Password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value, })} />
            <Input type="password" autoComplete="new-password" disabled={updatingPassword} placeholder="New Password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value, })} />
            <Input type="password" autoComplete="new-password" disabled={updatingPassword} placeholder="Confirm New Password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value, })} />
            <Button type="submit" loading={updatingPassword} className="w-full">
              Update Password
            </Button>
            </form>
          </div>
        </GlassCard>
      </Container>
     </PageWrapper>
    </ProtectedRoute>
  );
}