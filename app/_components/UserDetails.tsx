import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/context/AuthContext';
import { useProcess } from '@/context/ProcessContext';
import { Webdata } from '@/data/data';

interface UserDetailsFormProps {
  onSubmit: (details: { firstName: string; lastName: string; phoneNumber: string; gender: string; state: string; city: string; designation: string; processAllocated: string; teamLead: string; language: string; }) => void;
  onCancel: () => void;
}

export const UserDetailsForm: React.FC<UserDetailsFormProps> = ({ onSubmit, onCancel }) => {
  const { user } = useAuth();
  const { selectedProcess } = useProcess();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [designation, setDesignation] = useState('');
  const [processAllocated, setProcessAllocated] = useState('');
  const [teamLead, setTeamLead] = useState('');
  const [language, setLanguage] = useState('');
  const [fullName, setFullName] = useState('');
  const [empId, setEmpId] = useState('');
  const [address, setAddress] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [consent, setConsent] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Disable scrolling on body when component mounts
    document.body.style.overflow = 'hidden';
    
    // Re-enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user) return;

      setFullName(user.name || '');
      setEmpId(user.empId || '');
      // Use selectedProcess name if available, otherwise fall back to user.process
      setProcessAllocated(selectedProcess?.name || user.process || '');
      setPhoneNumber(user.phone || '');

      // Split name for first/last name
      if (user.name) {
        const parts = user.name.trim().split(/\s+/);
        if (parts.length > 0) {
          setFirstName(parts[0]);
          setLastName(parts.length > 1 ? parts.slice(1).join(' ') : '');
        }
      }

      try {
        const response = await fetch(`/api/user-details?userId=${user.id}`);
        if (response.ok) {
          const details = await response.json();
          setFirstName(details.firstName || '');
          setLastName(details.lastName || '');
          setPhoneNumber(details.phoneNumber || '');
          setGender(details.gender || '');
          setState(details.state || '');
          setCity(details.city || '');
          setDesignation(details.designation || '');
          setProcessAllocated(details.processAllocated || '');
          setTeamLead(details.teamLead || '');
          setLanguage(details.language || '');
          setDateOfBirth(details.dateOfBirth || '');
          setAddress(details.address || '');
          setConsent(details.consent ? 'agree' : '');
        }
      } catch (err) {
        console.error('Failed to fetch existing user details:', err);
      }
    };

    fetchUserDetails();
  }, [user, selectedProcess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please log in first');
      return;
    }

    // Basic validation
    if (!firstName || !lastName || !phoneNumber || !gender || !state || !city || !dateOfBirth || !teamLead || !language || !processAllocated || !designation || !address) {
      alert('Please fill in all fields.');
      return;
    }

    if (consent !== 'agree') {
      alert('Please agree to the terms and conditions before proceeding.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        userId: user.id,
        firstName,
        lastName,
        phoneNumber,
        gender,
        state,
        city,
        dateOfBirth,
        teamLead,
        language,
        processAllocated,
        designation,
        address,
        consent: true
      };

      const response = await fetch('/api/user-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save details');
      }

      const data = await response.json();
      console.log('User details saved:', data);
      onSubmit({ firstName, lastName, phoneNumber, gender, state, city, designation, processAllocated, teamLead, language });
    } catch (error: any) {
      console.error('Error saving user details:', error);
      alert(`Failed to save details: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-8">
        <h2 className="text-xl sm:text-2xl md:text-4xl font-extrabold text-center rounded-full px-4 sm:px-6 py-2 border-2 sm:border-4 border-green-300 text-green-600">Candidate Registration Form</h2>
        <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 p-2 sm:p-3 text-center text-gray-800">Enter Your Details</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">Full Name (from signup)</Label>
              <Input id="fullName" value={fullName || ''} disabled className="bg-gray-50 border-gray-200" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="empId" className="text-sm font-medium text-gray-700">Employee ID (from signup)</Label>
              <Input id="empId" value={empId || ''}
              onChange={(e) => setEmpId(e.target.value)}
              required
              disabled={!!empId}
               className="bg-gray-50 border-gray-200" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</Label>
              <Input 
                id="firstName" 
                value={firstName || ''} 
                onChange={(e) => setFirstName(e.target.value)} 
                required 
                disabled={!!fullName}
                className="border-gray-200 focus:ring-2 focus:ring-green-500 disabled:bg-gray-50 disabled:text-gray-500" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</Label>
              <Input 
                id="lastName" 
                value={lastName || ''} 
                onChange={(e) => setLastName(e.target.value)} 
                required 
                // disabled={!!fullName}
                disabled={firstName === fullName.split(/\s+/)[0] && fullName.split(/\s+/).length > 1}
                className="border-gray-200 focus:ring-2 focus:ring-green-500 disabled:bg-gray-50 disabled:text-gray-500" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teamLead" className="text-sm font-medium text-gray-700">Team Lead Name (Manager Name)</Label>
              <Input id="teamLead" value={teamLead || ''} onChange={(e) => setTeamLead(e.target.value)} required className="border-gray-200 focus:ring-2 focus:ring-green-500" />   
            </div>
            <div className="space-y-2">
              <Label htmlFor="language" className="text-sm font-medium text-gray-700">Language Name</Label>
              {/* <Select value={language || undefined} onValueChange={(v) => setLanguage(v)} required>
                <SelectTrigger className="w-full border-gray-200 focus:ring-2 focus:ring-green-500">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent className="z-[300]" position="popper" sideOffset={5}>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Hindi">Hindi</SelectItem>
                  <SelectItem value="Marathi">Marathi</SelectItem>
                  <SelectItem value="Gujarati">Gujarati</SelectItem>
                  <SelectItem value="Bengali">Bengali</SelectItem>
                  <SelectItem value="Tamil">Tamil</SelectItem>
                  <SelectItem value="Telugu">Telugu</SelectItem>
                  <SelectItem value="Kannada">Kannada</SelectItem>
                  <SelectItem value="Malayalam">Malayalam</SelectItem>
                  <SelectItem value="Odia">Odia</SelectItem>
                  <SelectItem value="Punjabi">Punjabi</SelectItem>
                  <SelectItem value="Assamese">Assamese</SelectItem>
                </SelectContent>
              </Select> */}
<Select
  value={language || undefined}
  onValueChange={setLanguage}
  // modal={false}
>
  <SelectTrigger className="w-full border-gray-200 focus:ring-2 focus:ring-green-500">
    <SelectValue placeholder="Select Language" />
  </SelectTrigger>

  <SelectContent
    className="z-[9999] pointer-events-auto"
    position="popper"
    sideOffset={5}
  >
    <SelectItem value="English">English</SelectItem>
    <SelectItem value="Hindi">Hindi</SelectItem>
    <SelectItem value="Marathi">Marathi</SelectItem>
    <SelectItem value="Gujarati">Gujarati</SelectItem>
    <SelectItem value="Bengali">Bengali</SelectItem>
    <SelectItem value="Tamil">Tamil</SelectItem>
    <SelectItem value="Telugu">Telugu</SelectItem>
    <SelectItem value="Kannada">Kannada</SelectItem>
    <SelectItem value="Malayalam">Malayalam</SelectItem>
    <SelectItem value="Odia">Odia</SelectItem>
    <SelectItem value="Punjabi">Punjabi</SelectItem>
    <SelectItem value="Assamese">Assamese</SelectItem>
  </SelectContent>
</Select>

            </div>
            <div className="space-y-2">
              <Label htmlFor="dob" className="text-sm font-medium text-gray-700">Date of Birth</Label>
              <Input id="dob" type="date" value={dateOfBirth || ''} onChange={(e) => setDateOfBirth(e.target.value)} required className="border-gray-200 focus:ring-2 focus:ring-green-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">Phone Number</Label>
              <Input id="phoneNumber" type="tel" value={phoneNumber || ''} onChange={(e) => setPhoneNumber(e.target.value)} required className="border-gray-200 focus:ring-2 focus:ring-green-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-sm font-medium text-gray-700">Gender</Label>
              <Select
  value={gender || undefined}
  onValueChange={setGender}
 
>
  <SelectTrigger className="w-full border-gray-200 focus:ring-2 focus:ring-green-500">
    <SelectValue placeholder="Select Gender" />
  </SelectTrigger>

  <SelectContent
    className="z-[9999] pointer-events-auto"
    position="popper"
    sideOffset={5}
  >
    <SelectItem value="male">Male</SelectItem>
    <SelectItem value="female">Female</SelectItem>
    <SelectItem value="other">Other</SelectItem>
  </SelectContent>
</Select>

            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Process Allocated</Label>
              <RadioGroup className="flex flex-wrap gap-4 mt-2" value={processAllocated} onValueChange={setProcessAllocated}>
                {/* Dynamically show processes based on selection or available data */}
                <div className="flex items-center gap-2">
                  <RadioGroupItem 
                    value={selectedProcess?.name || 'elderLine'} 
                    id="p-selected" 
                    className="text-green-600 focus:ring-green-500" 
                  />
                  <Label htmlFor="p-selected" className="text-sm text-gray-600">
                    {selectedProcess?.name || 'ElderLine'}
                  </Label>
                </div>
                
                {/* Always provide 'Other' as a fallback */}
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="other" id="p-other" className="text-green-600 focus:ring-green-500" />
                  <Label htmlFor="p-other" className="text-sm text-gray-600">Other</Label>
                </div>
              </RadioGroup>
            </div>       
            
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Designation</Label>
              <RadioGroup className="flex flex-wrap gap-4 mt-2" value={designation} onValueChange={setDesignation}>
                {selectedProcess?.name?.toLowerCase() === 'elderline' ? (
                  <>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="co" id="des-co" className="text-green-600 focus:ring-green-500" />
                      <Label htmlFor="des-co" className="text-sm text-gray-600">CO</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="fro" id="des-fro" className="text-green-600 focus:ring-green-500" />
                      <Label htmlFor="des-fro" className="text-sm text-gray-600">FRO</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="frl" id="des-frl" className="text-green-600 focus:ring-green-500" />
                      <Label htmlFor="des-frl" className="text-sm text-gray-600">FRL</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="tl" id="des-tl" className="text-green-600 focus:ring-green-500" />
                      <Label htmlFor="des-tl" className="text-sm text-gray-600">TL</Label>
                    </div>
                  </>
                ) : selectedProcess?.name?.toLowerCase() === 'gst' ? (
                  <>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="gst_associate" id="des-gst-assoc" className="text-green-600 focus:ring-green-500" />
                      <Label htmlFor="des-gst-assoc" className="text-sm text-gray-600">GST Associate</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="gst_consultant" id="des-gst-cons" className="text-green-600 focus:ring-green-500" />
                      <Label htmlFor="des-gst-cons" className="text-sm text-gray-600">GST Consultant</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="tl" id="des-gst-tl" className="text-green-600 focus:ring-green-500" />
                      <Label htmlFor="des-gst-tl" className="text-sm text-gray-600">Team Lead</Label>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="agent" id="des-agent" className="text-green-600 focus:ring-green-500" />
                      <Label htmlFor="des-agent" className="text-sm text-gray-600">Agent</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="tl" id="des-tl-gen" className="text-green-600 focus:ring-green-500" />
                      <Label htmlFor="des-tl-gen" className="text-sm text-gray-600">Team Lead</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="manager" id="des-mgr" className="text-green-600 focus:ring-green-500" />
                      <Label htmlFor="des-mgr" className="text-sm text-gray-600">Manager</Label>
                    </div>
                  </>
                )}
              </RadioGroup>
            </div>
           
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Address</Label>
              <Input id="address" value={address || ''} onChange={(e) => setAddress(e.target.value)} required className="border-gray-200 focus:ring-2 focus:ring-green-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium text-gray-700">City</Label>
              <Input id="city" value={city || ''} onChange={(e) => setCity(e.target.value)} required className="border-gray-200 focus:ring-2 focus:ring-green-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state" className="text-sm font-medium text-gray-700">State</Label>
              <Input id="state" value={state || ''} onChange={(e) => setState(e.target.value)} required className="border-gray-200 focus:ring-2 focus:ring-green-500" />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
            <Label className="text-sm font-bold text-gray-700">Consent & Agreement</Label>
            <RadioGroup value={consent} onValueChange={setConsent} required className="flex flex-col gap-2">
              <div className="flex items-start gap-3">
                <RadioGroupItem value="agree" id="consent-agree" className="mt-1 text-green-600 focus:ring-green-500" />
                <Label htmlFor="consent-agree" className="text-sm text-gray-600 leading-relaxed cursor-pointer">
                  I hereby declare that all the information provided above is true and correct to the best of my knowledge. I understand that any false information may lead to disqualification from the assessment process.
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={onCancel} className="px-6 border-gray-200 hover:bg-gray-50">Cancel</Button>
            <Button type="submit" disabled={loading} className="px-8 bg-green-600 hover:bg-green-700 text-white shadow-lg transition-all active:scale-95">
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
