// Incluir Fuse.js para búsqueda difusa
// En un entorno real, incluiríamos la librería desde CDN
// <script src="https://cdn.jsdelivr.net/npm/fuse.js@6.6.2/dist/fuse.min.js"></script>

document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard JS loaded');
    const writeups = loadWriteups();
    console.log('Writeups loaded:', writeups.length);
    displayWriteups(writeups);
    updateStats(writeups);
    populateTagFilter(writeups);
    setupFilters(writeups);
});

// Mostrar write-ups en el dashboard
function displayWriteups(writeups) {
    const container = document.getElementById('writeups-container');
    if (!container) {
        console.error('No se encontró writeups-container');
        return;
    }
    
    container.innerHTML = '';
    
    if (writeups.length === 0) {
        container.innerHTML = '<p>No se encontraron write-ups que coincidan con los filtros.</p>';
        return;
    }
    
    writeups.forEach(writeup => {
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

// Actualizar estadísticas
function updateStats(writeups) {
    const totalCount = document.getElementById('total-count');
    if (totalCount) {
        totalCount.textContent = writeups.length;
    }
    
    // Estadísticas por plataforma
    const platformCounts = {};
    writeups.forEach(writeup => {
        platformCounts[writeup.platform] = (platformCounts[writeup.platform] || 0) + 1;
    });
    
    const platformElement = document.getElementById('platform-counts');
    if (platformElement) {
        platformElement.innerHTML = '';
        for (const [platform, count] of Object.entries(platformCounts)) {
            const platformItem = document.createElement('div');
            platformItem.textContent = `${platform}: ${count}`;
            platformElement.appendChild(platformItem);
        }
    }
    
    // Estadísticas por dificultad
    const difficultyCounts = {};
    writeups.forEach(writeup => {
        difficultyCounts[writeup.difficulty] = (difficultyCounts[writeup.difficulty] || 0) + 1;
    });
    
    const difficultyElement = document.getElementById('difficulty-counts');
    if (difficultyElement) {
        difficultyElement.innerHTML = '';
        for (const [difficulty, count] of Object.entries(difficultyCounts)) {
            const difficultyItem = document.createElement('div');
            difficultyItem.textContent = `${difficulty}: ${count}`;
            difficultyElement.appendChild(difficultyItem);
        }
    }
}

// Poblar filtro de tags
function populateTagFilter(writeups) {
    const tagFilter = document.getElementById('tag-filter');
    if (!tagFilter) return;
    
    const allTags = new Set();
    
    writeups.forEach(writeup => {
        writeup.tags.forEach(tag => allTags.add(tag));
    });
    
    allTags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        tagFilter.appendChild(option);
    });
}

// Configurar filtros
function setupFilters(writeups) {
    const platformFilter = document.getElementById('platform-filter');
    const difficultyFilter = document.getElementById('difficulty-filter');
    const tagFilter = document.getElementById('tag-filter');
    const searchFilter = document.getElementById('search-filter');
    const sortFilter = document.getElementById('sort-filter');
    
    if (!platformFilter || !difficultyFilter || !tagFilter || !searchFilter || !sortFilter) {
        console.error('No se encontraron todos los filtros');
        return;
    }
    
    function applyFilters() {
        let filtered = [...writeups];
        
        // Filtrar por plataforma
        if (platformFilter.value) {
            filtered = filtered.filter(writeup => writeup.platform === platformFilter.value);
        }
        
        // Filtrar por dificultad
        if (difficultyFilter.value) {
            filtered = filtered.filter(writeup => writeup.difficulty === difficultyFilter.value);
        }
        
        // Filtrar por tag
        if (tagFilter.value) {
            filtered = filtered.filter(writeup => writeup.tags.includes(tagFilter.value));
        }
        
        // Filtrar por búsqueda
        if (searchFilter.value) {
            const searchTerm = searchFilter.value.toLowerCase();
            filtered = filtered.filter(writeup => 
                writeup.title.toLowerCase().includes(searchTerm) ||
                writeup.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }
        
        // Ordenar
        switch (sortFilter.value) {
            case 'date-desc':
                filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'date-asc':
                filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'difficulty-asc':
                const difficultyOrder = { 'muy fácil': 1, 'fácil': 2, 'medio': 3, 'difícil': 4, 'insane': 5 };
                filtered.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
                break;
            case 'difficulty-desc':
                const difficultyOrderDesc = { 'muy fácil': 1, 'fácil': 2, 'medio': 3, 'difícil': 4, 'insane': 5 };
                filtered.sort((a, b) => difficultyOrderDesc[b.difficulty] - difficultyOrderDesc[a.difficulty]);
                break;
        }
        
        displayWriteups(filtered);
        updateStats(filtered);
    }
    
    platformFilter.addEventListener('change', applyFilters);
    difficultyFilter.addEventListener('change', applyFilters);
    tagFilter.addEventListener('change', applyFilters);
    searchFilter.addEventListener('input', applyFilters);
    sortFilter.addEventListener('change', applyFilters);
}

// Hacer funciones disponibles globalmente
window.displayWriteups = displayWriteups;
window.updateStats = updateStats;