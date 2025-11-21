'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Lock, Trash2, Loader2 } from 'lucide-react';
import { useActionState } from 'react';
import { updatePassword, deleteAccount } from '@/app/(login)/actions';

type PasswordState = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  error?: string;
  success?: string;
};

type DeleteState = {
  password?: string;
  error?: string;
  success?: string;
};

export default function SecurityPage() {
  const [passwordState, passwordAction, isPasswordPending] = useActionState<
    PasswordState,
    FormData
  >(updatePassword, {});

  const [deleteState, deleteAction, isDeletePending] = useActionState<
    DeleteState,
    FormData
  >(deleteAccount, {});

  return (
    <section className="flex-1">
      <div className="mb-8 rounded-2xl p-8 bg-[#CDA7B2] border border-[#967F71] shadow-lg">
        <h1 className="text-3xl font-bold mb-2">
          Security Settings
        </h1>
        <p>
          Manage your password and account security
        </p>
      </div>

      <Card className="dashboard-card border-0 mb-8">
        <CardHeader className="border-b border-gray-100 pb-3">
          <CardTitle className="text-xl font-semibold text-gray-900">Password</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <form className="space-y-6" action={passwordAction}>
            <div>
              <Label htmlFor="current-password" className="mb-2 text-sm font-medium text-gray-700">
                Current Password
              </Label>
              <Input
                id="current-password"
                name="currentPassword"
                type="password"
                autoComplete="current-password"
                required
                minLength={8}
                maxLength={100}
                defaultValue={passwordState.currentPassword}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="new-password" className="mb-2 text-sm font-medium text-gray-700">
                New Password
              </Label>
              <Input
                id="new-password"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                maxLength={100}
                defaultValue={passwordState.newPassword}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="confirm-password" className="mb-2 text-sm font-medium text-gray-700">
                Confirm New Password
              </Label>
              <Input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                required
                minLength={8}
                maxLength={100}
                defaultValue={passwordState.confirmPassword}
                className="mt-1"
              />
            </div>
            {passwordState.error && (
              <div className="alert-error">
                <p className="text-sm font-medium">{passwordState.error}</p>
              </div>
            )}
            {passwordState.success && (
              <div className="alert-success">
                <p className="text-sm font-medium">{passwordState.success}</p>
              </div>
            )}
            <div className="pt-4 border-t border-gray-100">
              <Button
                type="submit"
                className="bg-brand-primary hover:bg-brand-primary-hover text-white shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/30 transition-all duration-200"
                disabled={isPasswordPending}
              >
                {isPasswordPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Update Password
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="dashboard-card border-0 border-l-4 border-l-red-500">
        <CardHeader className="border-b border-gray-100 pb-3">
          <CardTitle className="text-xl font-semibold text-gray-900">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800 font-medium">
              ⚠️ Account deletion is permanent and cannot be undone. All your data will be permanently removed.
            </p>
          </div>
          <form action={deleteAction} className="space-y-6">
            <div>
              <Label htmlFor="delete-password" className="mb-2 text-sm font-medium text-gray-700">
                Confirm Your Password
              </Label>
              <Input
                id="delete-password"
                name="password"
                type="password"
                required
                minLength={8}
                maxLength={100}
                defaultValue={deleteState.password}
                className="mt-1"
              />
            </div>
            {deleteState.error && (
              <div className="alert-error">
                <p className="text-sm font-medium">{deleteState.error}</p>
              </div>
            )}
            <div className="pt-4 border-t border-gray-100">
              <Button
                type="submit"
                variant="destructive"
                disabled={isDeletePending}
                className="shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isDeletePending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
