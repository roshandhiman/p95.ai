import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

const ProfileContext = createContext();

const defaultProfile = {
  name: '', role: '', company: 'P95.AI', email: '', age: '', bio: '', avatar: ''
};

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(defaultProfile);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load Session & Profile on Mount
  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      if (session?.user) {
        await loadProfile(session.user.id, session.user.email);
      } else {
        setLoading(false);
      }
    };

    fetchSessionAndProfile();

    // Listen for Auth Auth changes (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        await loadProfile(session.user.id, session.user.email);
      } else {
        setProfile(defaultProfile);
        setLoading(false);
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId, email) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is 'not found'
      
      if (data) {
        setProfile({
          name: data.name || '',
          role: data.role || '',
          company: data.company || 'P95.AI',
          email: email || '',
          age: data.age || '',
          bio: data.bio || '',
          avatar: data.avatar || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    if (!user) return; // Must be logged in
    
    const updated = { ...profile, ...updates };
    setProfile(updated); // Optimistic UI update

    try {
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        name: updated.name,
        role: updated.role,
        company: updated.company,
        age: updated.age,
        bio: updated.bio,
        avatar: updated.avatar,
        updated_at: new Date().toISOString()
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating profile:', error.message);
      alert('Failed to save profile to database.');
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, user, loading }}>
      {!loading && children}
    </ProfileContext.Provider>
  );
}

export function useProfile() { return useContext(ProfileContext); }
