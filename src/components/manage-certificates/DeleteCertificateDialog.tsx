
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Certificate {
  id: string;
  student_name: string;
}

interface DeleteCertificateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: Certificate | null;
  onConfirm: () => void;
  isDeleting: boolean;
  password: string;
  setPassword: (password: string) => void;
  passwordError: string;
  setPasswordError: (error: string) => void;
}

export const DeleteCertificateDialog: React.FC<DeleteCertificateDialogProps> = ({
  isOpen,
  onClose,
  certificate,
  onConfirm,
  isDeleting,
  password,
  setPassword,
  passwordError,
  setPasswordError
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border border-gray-200 shadow-lg">
        <DialogHeader>
          <DialogTitle>Confirm Permanent Deletion</DialogTitle>
          <DialogDescription>
            You are about to permanently delete the certificate for <strong>{certificate?.student_name}</strong>. 
            This action cannot be undone. Please enter the master password to confirm.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="delete-password">Master Password</Label>
          <Input
            id="delete-password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError("");
            }}
            placeholder="Enter master password"
          />
          {passwordError && (
            <p className="text-sm text-red-600">{passwordError}</p>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="hover:bg-gray-100 transition-colors"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="hover:bg-red-600 transition-colors"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Deleting...
              </>
            ) : (
              "Delete Permanently"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
