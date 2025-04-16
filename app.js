window.addEventListener('load', function () {
    const contentDiv = document.getElementById('content');
    const links = document.querySelectorAll('.site-links');
    
    const pages = {
        '/': 'pages/home.html',
        '/about': 'pages/about.html',
        // '/feed': '<h1>Feed</h1><p>This is the feed page content.</p>',
        // '/archive': '<h1>Archive</h1><p>This is the archive page content.</p>',
        // '/colophon': '<h1>Site Info</h1><p>This is the site information page content.</p>',
    };

    function loadPage() {
        const path = window.location.pathname;
        const page = pages[path];
        
        if (!page) {
            contentDiv.innerHTML = '<h1>404 - Page Not Found</h1><p>The page you are looking for does not exist.</p>';
            return;
        }

        if (page.endsWith('.html')) {
            fetch(page)
                .then(res => {
                    if (!res.ok) throw new Error('Failed to fetch');
                    return res.text();
                })
                .then(html => {
                    contentDiv.innerHTML = html;
                    highlightActiveLink(path);
                })
                .catch(err => {
                    contentDiv.innerHTML = '<h1>Error loading page</h1>';
                    console.error(err);
                });
        } else {
            contentDiv.innerHTML = page;
            highlightActiveLink(path);
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function highlightActiveLink(path) {
        links.forEach(link => {
            const originalText = link.textContent.replace(/^\s*\/\s*/, '').trim();
    
            if (link.getAttribute('href') === path) {
                link.classList.add('active');
                if (link.classList.contains('footer-links')) {
                    link.textContent = `/ ${originalText}`;
                }
            } else {
                link.classList.remove('active');
                if (link.classList.contains('footer-links')) {
                    link.textContent = originalText;
                }
            }
        });
    }
    
    links.forEach(link => {
        link.addEventListener('click', function (event) {
        event.preventDefault();
        const path = link.getAttribute('href');
        window.history.pushState({}, '', path);
        loadPage();
        });
    });

    window.addEventListener('popstate', loadPage);
    loadPage();
});

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            try {
                // For now, it'll just log and show a success message
                console.log('Form submitted:', formData);
                
                const button = contactForm.querySelector('button[type="submit"]');
                const originalText = button.textContent;
                button.textContent = 'Message Sent!';
                button.disabled = true;
                
                contactForm.reset();
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                }, 3000);
                
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('There was an error sending your message. Please try again later.');
            }
        });
    }
});
