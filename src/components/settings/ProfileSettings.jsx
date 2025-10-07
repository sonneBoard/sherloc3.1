import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabaseClient';
import { FiUser, FiImage } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const ProfileSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        if (profile) {
          setUsername(profile.username);
          setAvatarUrl(profile.avatar_url || '');
        }
      }
    } catch (error) {
      toast.error("Erro ao carregar o perfil.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if(user) {
        const updates = {
          username,
          avatar_url: avatarUrl,
          updated_at: new Date(),
        };
        const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
        if (error) throw error;
        toast.success("Perfil atualizado com sucesso!");
      }
    } catch (error) {
      toast.error("Erro ao atualizar o perfil.");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="h-8 w-1/3 bg-secondary/50 rounded-lg animate-pulse mb-2"></div>
        <div className="h-4 w-2/3 bg-secondary/50 rounded-lg animate-pulse mb-6"></div>
        <div className="h-10 w-full bg-secondary/50 rounded-lg animate-pulse mb-6"></div>
        <div className="h-10 w-full bg-secondary/50 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold font-poppins mb-1">Perfil Público</h2>
      <p className="text-text-secondary mb-6">Estas informações serão visíveis para outros usuários.</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-sm font-semibold mb-2 flex items-center gap-2 text-text-secondary"><FiUser/>Nome de Usuário</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-secondary p-3 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-accent-gold" />
        </div>
        <div>
          <label className="text-sm font-semibold mb-2 flex items-center gap-2 text-text-secondary"><FiImage/>URL do Avatar</label>
          <input type="url" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} className="w-full bg-secondary p-3 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-accent-gold" />
        </div>
        <div className="pt-4 flex justify-end border-t border-white/10">
          <button type="submit" disabled={saving} className="bg-accent-gold text-primary font-bold py-2 px-5 rounded-lg hover:brightness-110 transition-colors disabled:opacity-50">
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;