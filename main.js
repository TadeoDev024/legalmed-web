// --- main.js ---

// TU NÚMERO DE WHATSAPP (Formato: 549 + Cod Area + Numero)
const TELEFONO_LEGALMED = "5493814644817"; 

const form = document.getElementById('contactForm');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const contacto = document.getElementById('contacto').value;
    const mensaje = document.getElementById('mensaje').value;
    
    const btn = form.querySelector('button');
    const originalText = btn.innerText;

    btn.innerText = "Abriendo WhatsApp...";
    btn.style.opacity = "0.7";

    // Mensaje formateado
    const texto = `👋 Hola LegalMed, consulto desde la web:%0A%0A` +
                  `👤 *Nombre:* ${nombre}%0A` +
                  `📱 *Contacto:* ${contacto}%0A` +
                  `📄 *Consulta:* ${mensaje}`;

    const url = `https://wa.me/${TELEFONO_LEGALMED}?text=${texto}`;
    
    setTimeout(() => {
        window.open(url, '_blank');
        btn.innerText = "¡Enviado!";
        btn.style.background = "#22c55e"; // Verde éxito
        form.reset();
        
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = "";
            btn.style.opacity = "1";
        }, 3000);
    }, 1000);
});