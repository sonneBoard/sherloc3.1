// Sistema de níveis corrigido
export const calculateLevel = (totalXp) => {
  if (totalXp < 0) return { level: 1, currentLevelXp: 0, xpForNextLevel: 100 };
  
  let level = 1;
  let xpUsed = 0;
  
  // Calcular o nível baseado no XP total acumulado
  while (xpUsed + (level * 100) <= totalXp) {
    xpUsed += level * 100;
    level++;
  }
  
  // XP atual no nível (quanto já foi ganho no nível atual)
  const currentLevelXp = totalXp - xpUsed;
  
  // XP necessário para o próximo nível
  const xpForNextLevel = level * 100;
  
  return {
    level,
    currentLevelXp,
    xpForNextLevel,
    totalXp
  };
};

export const addXpAndCalculateLevel = (currentTotalXp, xpToAdd) => {
  const newTotalXp = currentTotalXp + xpToAdd;
  const oldLevel = calculateLevel(currentTotalXp).level;
  const newLevelData = calculateLevel(newTotalXp);
  
  return {
    ...newLevelData,
    leveledUp: newLevelData.level > oldLevel,
    levelsGained: newLevelData.level - oldLevel
  };
};

// Função para atualizar XP e nível no banco de dados
export const updateUserXpAndLevel = async (supabase, userId, xpToAdd) => {
  try {
    // Buscar XP atual
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('xp')
      .eq('id', userId)
      .single();
    
    if (profileError) throw profileError;
    
    const currentTotalXp = profileData.xp || 0;
    const levelData = addXpAndCalculateLevel(currentTotalXp, xpToAdd);
    
    // Atualizar no banco com o XP total e nível correto
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        xp: levelData.totalXp, 
        level: levelData.level 
      })
      .eq('id', userId);
    
    if (updateError) throw updateError;
    
    return levelData;
  } catch (error) {
    console.error('Erro ao atualizar XP e nível:', error);
    throw error;
  }
};
