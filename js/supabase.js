const EH = (function () {
  'use strict';

  const PREFIX = 'eh_';
  let sb = null;
  let initialized = false;

  // Credenciales del proyecto (configuradas automáticamente)
  const DEFAULT_SUPABASE_URL = 'https://wjzgxrqintzzfjhvhstm.supabase.co';
  const DEFAULT_SUPABASE_KEY = 'sb_publishable_I6tsOKsEXbogDU0uqPdl6w_11kVP5ZD';

  function getClient() {
    if (sb) return sb;
    if (typeof supabase !== 'undefined') {
      const url = localStorage.getItem(PREFIX + 'supabase_url') || DEFAULT_SUPABASE_URL;
      const key = localStorage.getItem(PREFIX + 'supabase_anon_key') || DEFAULT_SUPABASE_KEY;
      if (url && key) {
        sb = supabase.createClient(url, key);
      }
    }
    return sb;
  }

  function isOnline() {
    const c = getClient();
    return c !== null;
  }

  // ── Generic CRUD helpers ──

  async function list(table, onlyActive = true) {
    const c = getClient();
    if (!c) return null;
    let query = c.from(table).select('*').order('created_at', { ascending: false });
    if (onlyActive && table !== 'trash') {
      query = query.is('deleted_at', null);
    }
    if (table !== 'trash' && table !== 'config') {
      query = query.eq('is_active', true);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async function listAll(table) {
    const c = getClient();
    if (!c) return null;
    const { data, error } = await c.from(table).select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async function getById(table, id) {
    const c = getClient();
    if (!c) return null;
    const { data, error } = await c.from(table).select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  }

  async function insert(table, record) {
    const c = getClient();
    if (!c) return null;
    const { data, error } = await c.from(table).insert(record).select().single();
    if (error) throw error;
    return data;
  }

  async function update(table, id, record) {
    const c = getClient();
    if (!c) return null;
    record.updated_at = new Date().toISOString();
    const { data, error } = await c.from(table).update(record).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  async function remove(table, id) {
    const c = getClient();
    if (!c) return null;
    const { error } = await c.from(table).delete().eq('id', id);
    if (error) throw error;
    return true;
  }

  async function softDelete(table, id) {
    const c = getClient();
    if (!c) return null;
    const record = await getById(table, id);
    if (!record) return null;
    await trash(record, table);
    const { error } = await c.from(table).update({
      deleted_at: new Date().toISOString(),
      is_active: false
    }).eq('id', id);
    if (error) throw error;
    return true;
  }

  async function trash(record, tableName) {
    const c = getClient();
    if (!c) return null;
    const entry = {
      original_table: tableName,
      original_id: record.id,
      data: record
    };
    const { data, error } = await c.from('trash').insert(entry).select().single();
    if (error) throw error;
    return data;
  }

  async function restore(trashId) {
    const c = getClient();
    if (!c) return null;
    const entry = await getById('trash', trashId);
    if (!entry) return null;
    const record = entry.data;
    const { error: delErr } = await c.from('trash').delete().eq('id', trashId);
    if (delErr) throw delErr;
    const { error: updErr } = await c.from(entry.original_table).update({
      deleted_at: null,
      is_active: true,
      updated_at: new Date().toISOString()
    }).eq('id', record.id);
    if (updErr) throw updErr;
    return true;
  }

  async function permanentDelete(trashId) {
    const c = getClient();
    if (!c) return null;
    const entry = await getById('trash', trashId);
    if (!entry) return null;
    const record = entry.data;
    const { error: del1 } = await c.from('trash').delete().eq('id', trashId);
    if (del1) throw del1;
    const { error: del2 } = await c.from(entry.original_table).delete().eq('id', record.id);
    if (del2) throw del2;
    return true;
  }

  // ── Config (single row) ──

  async function getConfig() {
    const c = getClient();
    if (!c) return null;
    const { data, error } = await c.from('config').select('*').eq('id', 1).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  }

  async function saveConfig(cfg) {
    const c = getClient();
    if (!c) return null;
    cfg.updated_at = new Date().toISOString();
    const { data, error } = await c.from('config').upsert(cfg).select().single();
    if (error) throw error;
    return data;
  }

  // ── Image upload ──

  async function uploadImage(bucket, file, path) {
    const c = getClient();
    if (!c) return null;
    const filePath = path || `${Date.now()}_${file.name}`;
    const { data, error } = await c.storage.from(bucket).upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    });
    if (error) throw error;
    const { data: { publicUrl } } = c.storage.from(bucket).getPublicUrl(filePath);
    return publicUrl;
  }

  async function deleteImage(bucket, path) {
    const c = getClient();
    if (!c) return null;
    const { error } = await c.storage.from(bucket).remove([path]);
    if (error) throw error;
    return true;
  }

  // ── Auth ──

  async function signIn(email, password) {
    const c = getClient();
    if (!c) return null;
    const { data, error } = await c.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    const c = getClient();
    if (!c) return null;
    const { error } = await c.auth.signOut();
    if (error) throw error;
    return true;
  }

  async function getSession() {
    const c = getClient();
    if (!c) return { session: null };
    const { data, error } = await c.auth.getSession();
    if (error) return { session: null };
    return data;
  }

  // ── Init ──

  async function init(url, anonKey) {
    if (url && anonKey) {
      localStorage.setItem(PREFIX + 'supabase_url', url);
      localStorage.setItem(PREFIX + 'supabase_anon_key', anonKey);
    }
    const c = getClient();
    if (c) {
      initialized = true;
    }
    return initialized;
  }

  function isConfigured() {
    const url = localStorage.getItem(PREFIX + 'supabase_url');
    const key = localStorage.getItem(PREFIX + 'supabase_anon_key');
    return !!(url && key);
  }

  return {
    isOnline,
    isConfigured,
    init,
    list,
    listAll,
    getById,
    insert,
    update,
    remove,
    softDelete,
    trash,
    restore,
    permanentDelete,
    getConfig,
    saveConfig,
    uploadImage,
    deleteImage,
    signIn,
    signOut,
    getSession,
    PREFIX
  };
})();
