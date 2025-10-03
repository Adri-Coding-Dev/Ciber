// Funcionalidad para visualización de write-ups individuales
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');
    
    if (slug) {
        loadWriteup(slug);
    } else {
        document.getElementById('writeup-content').innerHTML = '<p>Write-up no encontrado.</p>';
    }
});

// Cargar y mostrar un write-up específico
function loadWriteup(slug) {
    const writeups = loadWriteups();
    const writeup = writeups.find(w => w.slug === slug);
    
    if (writeup) {
        displayWriteup(writeup);
    } else {
        document.getElementById('writeup-content').innerHTML = '<p>Write-up no encontrado.</p>';
    }
}

// Mostrar el write-up en la página
function displayWriteup(writeup) {
    const container = document.getElementById('writeup-content');
    
    if (!container) {
        console.error('No se encontró el contenedor writeup-content');
        return;
    }
    
    // Convertir markdown a HTML usando marked
    let htmlContent;
    try {
        htmlContent = marked.parse(writeup.content);
    } catch (error) {
        console.error('Error al parsear markdown:', error);
        htmlContent = `<pre>${writeup.content}</pre>`;
    }
    
    container.innerHTML = `
        <article class="writeup-content">
            <header>
                <h1>${writeup.title}</h1>
                <div class="writeup-meta">
                    <span class="writeup-platform">${writeup.platform}</span>
                    <span class="writeup-difficulty difficulty-${writeup.difficulty}">${writeup.difficulty}</span>
                    <span>${writeup.date} • ${writeup.hours_spent}h</span>
                </div>
                <div class="writeup-tags">
                    ${writeup.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </header>
            
            <div class="writeup-body">
                ${htmlContent}
            </div>
            
            <div class="writeup-actions">
                <button onclick="printWriteup()" class="btn">Imprimir/Exportar PDF</button>
                <button onclick="downloadMarkdown('${writeup.slug}')" class="btn">Descargar Markdown</button>
                <a href="dashboard.html" class="btn">Volver al Dashboard</a>
            </div>
        </article>
    `;
}

// Imprimir/exportar write-up
function printWriteup() {
    window.print();
}

// Descargar markdown original
function downloadMarkdown(slug) {
    const writeups = loadWriteups();
    const writeup = writeups.find(w => w.slug === slug);
    
    if (writeup) {
        // Crear contenido con frontmatter
        let markdownContent = '---\n';
        markdownContent += `title: "${writeup.title}"\n`;
        markdownContent += `date: "${writeup.date}"\n`;
        markdownContent += `platform: "${writeup.platform}"\n`;
        markdownContent += `difficulty: "${writeup.difficulty}"\n`;
        markdownContent += `tags: [${writeup.tags.map(tag => `"${tag}"`).join(', ')}]\n`;
        markdownContent += `slug: "${writeup.slug}"\n`;
        markdownContent += `hours_spent: ${writeup.hours_spent}\n`;
        markdownContent += '---\n\n';
        markdownContent += writeup.content;
        
        // Crear blob y descargar
        const blob = new Blob([markdownContent], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${writeup.slug}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Hacer funciones disponibles globalmente
window.printWriteup = printWriteup;
window.downloadMarkdown = downloadMarkdown;