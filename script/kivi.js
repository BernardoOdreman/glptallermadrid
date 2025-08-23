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

    // ==============================================
    // CÓDIGO PARA EL ENVÍO DEL FORMULARIO
    // ==============================================
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        const notification = document.getElementById('notification');

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Mostrar estado de carga
            notification.textContent = 'Enviando solicitud...';
            notification.classList.remove('hidden', 'error', 'success');
            notification.classList.add('loading');

            try {
                // Recoger todos los valores
                const formData = {
                    nombre: document.getElementById('nombre').value,
                                     apellidos: document.getElementById('apellidos').value,
                                     telefono: document.getElementById('telefono').value,
                                     email: document.getElementById('email').value,
                                     marca: document.querySelector('input[name="marca"]').value,
                                     modelo: document.querySelector('input[name="modelo"]').value,
                                     anio: document.getElementById('anio').value,
                                     interes: document.getElementById('interes').value,
                                     necesidades: document.getElementById('necesidades').value
                };

                // Enviar datos al f
                console.log(formData)
                const response = await axios.post(
                    'http://localhost:3000/solicitud',
                    formData,
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );

                // Mostrar mensaje de éxito
                notification.textContent = '✓ Solicitud enviada correctamente';
                notification.classList.remove('loading', 'error');
                notification.classList.add('success');

                // Resetear formulario después de 2 segundos
                setTimeout(() => {
                    contactForm.reset();
                    notification.classList.add('hidden');
                }, 2000);

            } catch (error) {
                // Manejar errores
                console.error('Error completo:', error);

                let errorMessage = '✗ Error al enviar la solicitud. ';

                if (error.response) {
                    // Error de servidor (4xx, 5xx)
                    errorMessage += `Servidor respondió: ${error.response.status} - ${error.response.data.message || 'Sin detalles'}`;
                } else if (error.request) {
                    // La solicitud fue hecha pero no hubo respuesta
                    errorMessage += 'No se recibió respuesta del servidor';
                } else {
                    // Error al configurar la solicitud
                    errorMessage += error.message;
                }

                notification.innerHTML = errorMessage;
                notification.classList.remove('loading', 'success');
                notification.classList.add('error');
            }
        });
    }
});
