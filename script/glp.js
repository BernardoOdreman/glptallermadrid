window.changeSlide = function(carouselId, direction) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;

    const slides = carousel.querySelector('.carousel-slides');
    const indicators = carousel.querySelectorAll('.carousel-indicator');
    const slideCount = carousel.querySelectorAll('.carousel-slide').length;

    // Obtener el índice actual
    let currentIndex = parseInt(carousel.dataset.currentIndex) || 0;

    // Calcular el nuevo índice
    let newIndex = currentIndex + direction;

    // Manejar los límites del carrusel
    if (newIndex < 0) newIndex = slideCount - 1;
    else if (newIndex >= slideCount) newIndex = 0;

    // Actualizar la posición del carrusel
    slides.style.transform = `translateX(${-newIndex * 100}%)`;

    // Actualizar indicadores
    indicators.forEach((indicator, index) => {
        if (index === newIndex) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });

    // Guardar el nuevo índice
    carousel.dataset.currentIndex = newIndex;
}

window.goToSlide = function(carouselId, index) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;

    const slides = carousel.querySelector('.carousel-slides');
    const indicators = carousel.querySelectorAll('.carousel-indicator');
    const slideCount = carousel.querySelectorAll('.carousel-slide').length;

    // Asegurar que el índice esté dentro de los límites
    if (index < 0) index = 0;
    if (index >= slideCount) index = slideCount - 1;

    // Actualizar la posición del carrusel
    slides.style.transform = `translateX(${-index * 100}%)`;

    // Actualizar indicadores
    indicators.forEach((indicator, i) => {
        if (i === index) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });

    // Guardar el nuevo índice
    carousel.dataset.currentIndex = index;
}

window.scrollToSection = function(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        window.scrollTo({
            top: section.offsetTop - 80,
            behavior: 'smooth'
        });
    }
}

// Animación al hacer scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-fadeInUp, .animate-fadeInDown, .animate-fadeIn, .animate-scaleIn');

    elements.forEach(element => {
        const position = element.getBoundingClientRect();

        // Si el elemento está en el viewport
        if(position.top < window.innerHeight && position.bottom >= 0) {
            element.style.opacity = 1;
            element.style.visibility = 'visible';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Función para recoger datos de formularios (versión corregida)
function getFormData(form) {
    const data = {};

    // Campos comunes
    data.nombre = form.querySelector('#nombre')?.value || '';
    data.apellidos = form.querySelector('#apellidos')?.value || '';
    data.telefono = form.querySelector('#telefono')?.value || '';
    data.email = form.querySelector('#email')?.value || '';
    data.anio = form.querySelector('#anio')?.value || '';

    // Campos específicos (versión corregida)
    data.marca = form.querySelector('#marca')?.value || '';
    data.modelo = form.querySelector('#modelo')?.value || '';
    data.combustible = form.querySelector('#combustible')?.value || '';
    data.provincia = form.querySelector('#provincia')?.value || '';
    data.interes = form.querySelector('#interes')?.value || '';
    data.necesidades = form.querySelector('#necesidades')?.value || '';

    return data;
}

// Función para generar el HTML estilizado con Tailwind
function generateEmailHTML(formData) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8">
    <style>
    body { font-family: sans-serif; }
    .container { max-width: 600px; margin: 0 auto; }
    .header { background-color: #1e40af; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f9fafb; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #374151; margin-bottom: 5px; }
    .value { color: #111827; }
    .footer { padding: 20px; text-align: center; background-color: #e5e7eb; color: #6b7280; font-size: 14px; }
    </style>
    </head>
    <body>
    <div class="container">
    <div class="header">
    <h1>Nueva Solicitud de Conversión GLP</h1>
    <p>Kimotor - Formulario de Contacto</p>
    </div>

    <div class="content">
    <div class="field">
    <div class="label">Nombre completo</div>
    <div class="value">${formData.nombre} ${formData.apellidos}</div>
    </div>

    <div class="field">
    <div class="label">Teléfono</div>
    <div class="value">${formData.telefono}</div>
    </div>

    <div class="field">
    <div class="label">Email</div>
    <div class="value">${formData.email}</div>
    </div>

    <div class="field">
    <div class="label">Vehículo</div>
    <div class="value">${formData.marca} ${formData.modelo} (${formData.anio})</div>
    </div>

    <div class="field">
    <div class="label">Combustible actual</div>
    <div class="value">${formData.combustible}</div>
    </div>

    <div class="field">
    <div class="label">Provincia</div>
    <div class="value">${formData.provincia}</div>
    </div>

    ${formData.interes ? `
        <div class="field">
        <div class="label">Interés principal</div>
        <div class="value">${formData.interes}</div>
        </div>
        ` : ''}

        ${formData.necesidades ? `
            <div class="field">
            <div class="label">Necesidades específicas</div>
            <div class="value">${formData.necesidades}</div>
            </div>
            ` : ''}
            </div>

            <div class="footer">
            <p>Este mensaje fue generado automáticamente desde el formulario de contacto de Kimotor</p>
            <p>© ${new Date().getFullYear()} Kimotor - Todos los derechos reservados</p>
            </div>
            </div>
            </body>
            </html>
            `;
}

// Función para manejar el envío de formularios
async function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const notification = form.querySelector('.notification');

    // Mostrar estado de carga
    notification.textContent = 'Enviando solicitud...';
    notification.classList.remove('hidden', 'error', 'success');
    notification.classList.add('loading');

    try {
        // Recoger datos del formulario actual
        const formData = getFormData(form);
        console.log("Datos del formulario:", formData);

        // Generar HTML para el correo
        const emailHTML = generateEmailHTML(formData);

        // Información de Supabase
        const SUPABASE_URL = 'https://tubddowbahgxmdwhvgvn.supabase.co';
        const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_QBELiN_jeSsquh_oRpWTDg_cZfAPiju';
        const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/email-sender`;

        // Enviar datos a Supabase
        const response = await fetch(FUNCTION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
                'apikey': SUPABASE_PUBLISHABLE_KEY
            },
            body: JSON.stringify({
                to: 'odremanbernardo2@gmail.com',  // Destinatario fijo
                from: formData.email,
                subject: `Solicitud de Presupuesto GLP - ${formData.nombre} ${formData.apellidos}`,
                text: `Nueva solicitud de presupuesto para conversión GLP de ${formData.nombre} ${formData.apellidos}. Vehículo: ${formData.marca} ${formData.modelo} (${formData.anio}). Teléfono: ${formData.telefono}. Email: ${formData.email}`,
                                 html: emailHTML
            })
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        // Mostrar mensaje de éxito
        notification.textContent = '✓ Solicitud enviada correctamente';
        notification.classList.remove('loading', 'error');
        notification.classList.add('success');

        // Resetear formulario después de 2 segundos
        setTimeout(() => {
            form.reset();
            notification.classList.add('hidden');
        }, 2000);

    } catch (error) {
        // Manejar errores
        console.error('Error completo:', error);
        let errorMessage = '✗ Error al enviar la solicitud. ';

        if (error.message) {
            errorMessage += error.message;
        } else {
            errorMessage += 'Inténtelo de nuevo más tarde.';
        }

        notification.textContent = errorMessage;
        notification.classList.remove('loading', 'success');
        notification.classList.add('error');
    }
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    // Menú móvil
    const navbarContainer = document.getElementById('kimotor-navbar-container');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mainMenu = document.querySelector('.main-menu');
    const hasSubmenu = document.querySelectorAll('.has-submenu');

    if (window.innerWidth < 992) {
        mobileToggle.addEventListener('click', function() {
            mainMenu.classList.toggle('show');
        });

        // Submenús en móvil
        hasSubmenu.forEach(item => {
            const link = item.querySelector('a');
            link.addEventListener('click', function(e) {
                if (this.parentElement.querySelector('.submenu')) {
                    e.preventDefault();
                    this.parentElement.classList.toggle('active');
                    const icon = this.querySelector('i');
                    if (icon) {
                        icon.classList.toggle('fa-chevron-down');
                        icon.classList.toggle('fa-chevron-up');
                    }
                }
            });
        });
    }

    // Animación de scroll para navbar
    let lastScrollTop = 0;
    let isNavHidden = false;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 100) {
            document.body.classList.add('scrolled');

            // Scroll hacia abajo - ocultar navbar
            if (scrollTop > lastScrollTop) {
                isNavHidden = true;
                document.body.classList.add('nav-hidden');
            }
            // Scroll hacia arriba - mostrar navbar con animación
            else {
                if (isNavHidden) {
                    document.body.classList.remove('nav-hidden');
                    isNavHidden = false;
                }
            }
        } else {
            document.body.classList.remove('scrolled');
            document.body.classList.remove('nav-hidden');
            isNavHidden = false;
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // Inicializar todos los carruseles
    const carousels = document.querySelectorAll('.product-carousel, .innovative-carousel');
    carousels.forEach(carousel => {
        // Establecer índice inicial
        carousel.dataset.currentIndex = 0;

        // Configurar transición suave
        const slides = carousel.querySelector('.carousel-slides');
        slides.style.transition = 'transform 0.6s ease-in-out';

        // Auto avance cada X segundos para el carrusel del kit de rebaje
        if (carousel.id === 'kit-rebaje-carousel') {
            setInterval(() => {
                changeSlide(carousel.id, 1);
            }, 10000);
        }
    });

    // Configurar animaciones iniciales
    document.querySelectorAll('.animate-fadeInUp, .animate-fadeInDown, .animate-fadeIn, .animate-scaleIn').forEach(el => {
        el.style.opacity = 0;
        el.style.visibility = 'hidden';
        if(el.classList.contains('animate-fadeInUp')) {
            el.style.transform = 'translateY(30px)';
        }
        if(el.classList.contains('animate-fadeInDown')) {
            el.style.transform = 'translateY(-30px)';
        }
        if(el.classList.contains('animate-scaleIn')) {
            el.style.transform = 'scale(0.8)';
        }
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });

    // Configurar eventos de scroll
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);

    // Configurar todos los formularios
    const contactForms = document.querySelectorAll('.contact-form');
    contactForms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });
});
