import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { User, MapPin, Phone, Mail, Edit, Save, X, Lock, Bell } from "lucide-react";
import { getCurrentUser, updateUser } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const ProfilePage = () => {
  const { user, updateUser: syncUserUpdate, refreshUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    pincode: '',
    city: '',
  });

  // Fetch fresh user data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const userData = await getCurrentUser();
        setProfile({
          name: userData.name || '',
          phone: userData.phone || '',
          email: userData.email || '',
          address: userData.address || '',
          pincode: userData.pincode || '',
          city: userData.city || '',
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load profile data'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [toast]);

  const handleSave = async () => {
    if (!user?._id) return;
    
    setSaving(true);
    try {
      const updatedUser = await updateUser(user._id, profile);
      
      // Sync updated user with auth context and localStorage
      syncUserUpdate({
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        village: updatedUser.village,
      });
      
      // Also refresh full user data from backend
      await refreshUser();
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully'
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update profile'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      {/* Profile Information */}
      <Card className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Personal Information</h2>
          <Button
            variant={isEditing ? "default" : "outline"}
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            disabled={saving}
          >
            {isEditing ? (
              <>
                <X className="h-4 w-4 mr-2" /> Cancel
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 mr-2" /> Edit
              </>
            )}
          </Button>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="h-10 w-10 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-xl">{profile.name || user?.name || 'User'}</p>
            <p className="text-muted-foreground">{profile.phone || user?.phone || 'No phone'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <Input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <Input
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <Input
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Pincode</Label>
            <Input
              value={profile.pincode}
              onChange={(e) => setProfile({ ...profile, pincode: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label>City</Label>
            <Input
              value={profile.city}
              onChange={(e) => setProfile({ ...profile, city: e.target.value })}
              disabled={!isEditing}
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end gap-2 pt-4">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" /> Save Changes
                </>
              )}
            </Button>
          </div>
        )}
      </Card>

      {/* Security */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Security
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
            <div>
              <p className="font-medium">Password</p>
              <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
            </div>
            <Button variant="outline" size="sm">Change</Button>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Delivery updates and alerts</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Configure</Button>
          </div>
        </div>
      </Card>

      {/* Account Info */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">Account Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Username</p>
            <p className="font-semibold">{user?.username || 'N/A'}</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Role</p>
            <p className="font-semibold capitalize">{user?.role || 'user'}</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="font-semibold capitalize">{user?.status || 'active'}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
