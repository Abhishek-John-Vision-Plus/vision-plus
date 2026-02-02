'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Bell, Mail, Globe, Monitor, Shield, Save } from 'lucide-react';

interface SettingsState {
  notifications: boolean;
  emailAlerts: boolean;
  language: string;
  theme: string;
  autoRefresh: boolean;
  publicProfile: boolean;
}

const DEFAULT_SETTINGS: SettingsState = {
  notifications: true,
  emailAlerts: true,
  language: 'English',
  theme: 'Light',
  autoRefresh: false,
  publicProfile: false,
};

export default function SettingComp() {
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('user_settings');
    if (stored) {
      try {
        setSettings(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse settings', e);
      }
    }
  }, []);

  const handleToggle = (key: keyof SettingsState) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelect = (key: keyof SettingsState, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      localStorage.setItem('user_settings', JSON.stringify(settings));
      toast.success('Settings saved successfully');
      
      // Update UI in real-time if needed (e.g., dispatch custom event)
      window.dispatchEvent(new CustomEvent('settingsUpdated', { detail: settings }));
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 py-2">
      <div className="flex items-center gap-2 mb-2">
        <Monitor className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold">Preferences</h3>
      </div>
      
      <div className="space-y-4">
        {/* Language Selection */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-500" />
              Language
            </Label>
            <p className="text-xs text-slate-500">Choose your preferred language</p>
          </div>
          <Select 
            value={settings.language} 
            onValueChange={(v) => handleSelect('language', v)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent className='z-[10000]'>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Hindi">Hindi</SelectItem>
              <SelectItem value="Marathi">Marathi</SelectItem>
              <SelectItem value="Gujarati">Gujarati</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator className="opacity-50" />

        {/* Notifications */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Bell className="w-4 h-4 text-slate-500" />
              Push Notifications
            </Label>
            <p className="text-xs text-slate-500">Receive alerts on your device</p>
          </div>
          <Switch 
            checked={settings.notifications} 
            onCheckedChange={() => handleToggle('notifications')} 
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-500" />
              Email Alerts
            </Label>
            <p className="text-xs text-slate-500">Get updates in your inbox</p>
          </div>
          <Switch 
            checked={settings.emailAlerts} 
            onCheckedChange={() => handleToggle('emailAlerts')} 
          />
        </div>

        <Separator className="opacity-50" />

        {/* Privacy */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-500" />
              Public Profile
            </Label>
            <p className="text-xs text-slate-500">Allow others to see your profile</p>
          </div>
          <Switch 
            checked={settings.publicProfile} 
            onCheckedChange={() => handleToggle('publicProfile')} 
          />
        </div>
      </div>

      <div className="pt-4">
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="w-full gap-2 font-bold shadow-lg"
        >
          {isSaving ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
  //fiee
}
