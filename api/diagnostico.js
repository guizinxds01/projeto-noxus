const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

console.log('--- DIAGNÓSTICO NOXUS ---');

const dbPath = path.join(__dirname, 'noxus.db');
console.log('Caminho do DB:', dbPath);

if (!fs.existsSync(dbPath)) {
    console.log('❌ ARQUIVO NOXUS.DB NÃO ENCONTRADO!');
} else {
    console.log('✅ Arquivo noxus.db encontrado.');
}

try {
    const db = new Database(dbPath);
    console.log('✅ Conexão com SQLite OK.');

    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log('Tabelas encontradas:', tables.map(t => t.name).join(', '));

    const admins = db.prepare("SELECT username FROM admins").all();
    console.log('Admins cadastrados:', admins.length);
    admins.forEach(a => console.log(' - User:', a.username));

    const config = db.prepare("SELECT count(*) as c FROM config").get();
    console.log('Registros de config:', config.c);

} catch (err) {
    console.log('❌ ERRO NO BANCO DE DADOS:', err.message);
}

console.log('--- FIM DO DIAGNÓSTICO ---');
