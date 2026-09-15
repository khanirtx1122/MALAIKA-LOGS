/**
 * MALAIKA FABRICS — Supabase Client
 * =========================================
 * Initializes the Supabase client and provides helper functions
 * for fetching data from the database.
 */

(function () {
  'use strict';

  // Make sure Supabase is loaded via CDN and CONFIG is available
  if (!window.supabase) {
    console.error('Supabase SDK not loaded.');
    return;
  }

  if (!window.MF_CONFIG || !window.MF_CONFIG.SUPABASE_URL || !window.MF_CONFIG.SUPABASE_ANON_KEY) {
    console.error('Supabase credentials missing in config.js.');
    return;
  }

  // Initialize client
  const supabaseUrl = window.MF_CONFIG.SUPABASE_URL;
  const supabaseKey = window.MF_CONFIG.SUPABASE_ANON_KEY;
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  // Expose to window for global access
  window.supabaseClient = supabase;

  // Cache variables to prevent redundant fetches
  let productsCache = null;
  let collectionsCache = null;

  // Helper to convert snake_case DB row to camelCase frontend object
  function mapProductToFrontend(p) {
    return {
      ...p,
      salePrice: p.sale_price,
      colorName: p.color_name,
      colorHex: p.color_hex,
      colorGradient: p.color_gradient,
      topSeller: p.top_seller
    };
  }

  const mfDB = {
    /**
     * Fetch all products
     */
    async getProducts(forceRefresh = false) {
      if (productsCache && !forceRefresh) return productsCache;

      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
        
        if (error) throw error;
        productsCache = (data || []).map(mapProductToFrontend);
        return productsCache;
      } catch (err) {
        console.error('Error fetching products:', err.message);
        return [];
      }
    },

    /**
     * Fetch a single product by ID
     */
    async getProductById(id) {
      // Try to get from cache first
      if (productsCache) {
        const p = productsCache.find(p => p.id === id);
        if (p) return p;
      }

      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        return data ? mapProductToFrontend(data) : null;
      } catch (err) {
        console.error(`Error fetching product ${id}:`, err.message);
        return null;
      }
    },

    /**
     * Fetch all collections
     */
    async getCollections(forceRefresh = false) {
      if (collectionsCache && !forceRefresh) return collectionsCache;

      try {
        const { data, error } = await supabase
          .from('collections')
          .select('*');
        
        if (error) throw error;
        // Map collection fields if needed
        collectionsCache = (data || []).map(c => ({
          ...c,
          productFilter: c.product_filter // handle both
        }));
        return collectionsCache;
      } catch (err) {
        console.error('Error fetching collections:', err.message);
        return [];
      }
    }
  };

  // Expose the helper object globally
  window.mfDB = mfDB;

  // Add missing formatPrice helper
  window.MF_formatPrice = function(amount) {
    const sym = window.MF_CONFIG?.STORE_CURRENCY_SYMBOL || "Rs.";
    if (amount == null) return `${sym} 0`;
    return `${sym} ${amount.toLocaleString('en-PK')}`;
  };


})();
