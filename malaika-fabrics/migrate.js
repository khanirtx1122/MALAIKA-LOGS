const fs = require('fs');

// Simple parser for products.js and collections.js 
// We'll just read them as text, replace 'const PRODUCTS = ' with 'module.exports = ' or eval them.

const productsText = fs.readFileSync('js/products.js', 'utf8');
const collectionsText = fs.readFileSync('js/collections.js', 'utf8');

let PRODUCTS = [];
let COLLECTIONS = [];

// Evaluate the arrays
eval(productsText.replace('const PRODUCTS =', 'PRODUCTS ='));
eval(collectionsText.replace('const COLLECTIONS =', 'COLLECTIONS ='));

const supabaseUrl = "https://utqnvqfxvdjlbbxtxipq.supabase.co";
const supabaseKey = "sb_publishable_A3J8YA18pDMPugwjL_1Xwg_Ykd_J6fA";

async function runMigration() {
  console.log("Migrating collections...");
  for (const c of COLLECTIONS) {
    const res = await fetch(`${supabaseUrl}/rest/v1/collections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(c)
    });
    if (!res.ok) {
      console.error("Failed to insert collection:", c.id, await res.text());
    } else {
      console.log("Inserted collection:", c.id);
    }
  }

  console.log("Migrating products...");
  for (const p of PRODUCTS) {
    const res = await fetch(`${supabaseUrl}/rest/v1/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(p)
    });
    if (!res.ok) {
      console.error("Failed to insert product:", p.id, await res.text());
    } else {
      console.log("Inserted product:", p.id);
    }
  }
  
  console.log("Migration complete!");
}

runMigration();
