const observerOptions = {
    threshold: 0.15
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

const githubURL = "https://api.github.com/users/rubenmassuquetto1999/repos?sort=pushed";

async function getGitHubRepos() {
    try {
        const response = await fetch(githubURL);
        const repos = await response.json();

        const path = window.location.pathname;
        const isMainPage = !path.includes("projetos");
        const container = document.getElementById("github-cards");

        if (!container) return;

        const filteredRepos = repos.filter(repo => repo.name.toLowerCase() !== "rubenmassuquetto1999");

        const reposToDisplay = isMainPage ? filteredRepos.slice(0, 3) : filteredRepos;

        renderProjects(reposToDisplay, container);
    } catch (error) {
        console.error(error);
    }
}

function renderProjects(projects, container) {
    container.innerHTML = projects.map(repo => {
        const imageUrl = repo.homepage
            ? `https://api.microlink.io/?url=${repo.homepage}&screenshot=true&meta=false&embed=screenshot.url`
            : "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80";

        return `
        <article class="projeto-card">
            <div class="card-image">
                <img src="${imageUrl}" alt="${repo.name}" loading="lazy">
            </div>
            <div class="card-content">
                <span class="badge">${repo.language || 'Software'}</span>
                <h3>${repo.name.replace(/-/g, ' ')}</h3>
                <p>${repo.description || "Solução digital desenvolvida com foco em performance e lógica estruturada."}</p>
                
                <div class="project-links">
                    <a href="${repo.html_url}" target="_blank" class="btn-project btn-repo">Código</a>
                    ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="btn-project btn-demo-card">Live Demo</a>` : ''}
                </div>
            </div>
        </article>
        `;
    }).join('');
}

async function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const status = document.getElementById("form-status");
    const button = document.getElementById("form-button");
    const data = new FormData(form);

    button.disabled = true;
    button.innerText = "Enviando...";

    fetch(form.action, {
        method: form.method,
        body: data,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            status.innerHTML = "✅ Mensagem enviada! Logo entrarei em contato.";
            status.style.color = "var(--primary-blue)";
            form.reset();
        } else {
            status.innerHTML = "❌ Erro ao enviar. Tente novamente.";
            status.style.color = "#ff4b4b";
        }
    }).catch(error => {
        status.innerHTML = "❌ Erro de conexão com o servidor.";
        status.style.color = "#ff4b4b";
    }).finally(() => {
        button.disabled = false;
        button.innerText = "Enviar Mensagem";
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll('.timeline-item');
    items.forEach(item => {
        item.classList.add('reveal');
        observer.observe(item);
    });

    getGitHubRepos();

    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", handleFormSubmit);
    }
});