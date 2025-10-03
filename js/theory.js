// Funcionalidad para páginas de teoría
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar write-ups relacionados según la página de teoría
    displayRelatedWriteups();
});

// Mostrar write-ups relacionados con la técnica actual
function displayRelatedWriteups() {
    const writeups = loadWriteups();
    const currentPage = window.location.pathname.split('/').pop();
    
    let relatedTag = '';
    let containerId = '';
    
    // Determinar qué tag buscar según la página
    if (currentPage === 'theory-sqli.html') {
        relatedTag = 'sql-injection';
        containerId = 'sqli-writeups-list';
    } else if (currentPage === 'theory-xss.html') {
        relatedTag = 'xss';
        containerId = 'xss-writeups-list';
    } else if (currentPage === 'theory-nmap.html') {
        relatedTag = 'nmap';
        containerId = 'nmap-writeups-list';
    } else if (currentPage === 'theory-xxe.html') {
        relatedTag = 'xxe';
        containerId = 'xxe-writeups-list';
    } else if (currentPage === 'theory-ssrf.html') {
        relatedTag = 'ssrf';
        containerId = 'ssrf-writeups-list';
    } else if (currentPage === 'theory-gobuster.html') {
        relatedTag = 'gobuster';
        containerId = 'gobuster-writeups-list';
    } else if (currentPage === 'theory-arp-scan.html') {
        relatedTag = 'arp-scan';
        containerId = 'arp-writeups-list';
    }
    
    if (relatedTag && containerId) {
        const relatedWriteups = writeups.filter(writeup => 
            writeup.tags.includes(relatedTag)
        );
        
        const container = document.getElementById(containerId);
        if (container) {
            if (relatedWriteups.length === 0) {
                container.innerHTML = '<p>No hay write-ups relacionados aún.</p>';
            } else {
                container.innerHTML = '';
                relatedWriteups.forEach(writeup => {
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
    }
}