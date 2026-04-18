import { createContext, useContext, useState, useEffect } from 'react';

const ProfileContext = createContext();

const defaultProfile = {
  name: '', role: '', company: 'P95.AI', email: '', age: '', bio: '', avatar: ''
};

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('p95_profile');
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  const updateProfile = (updates) => {
    const updated = { ...profile, ...updates };
    setProfile(updated);
    localStorage.setItem('p95_profile', JSON.stringify(updated));
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() { return useContext(ProfileContext); }
