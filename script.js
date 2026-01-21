// ========================================
// CALCULADORA DE PRECIOS
// ========================================

// Calcular desde precio base
function calcularDesdePrecioBase() {
    // Limpiar los otros campos
    document.getElementById('precioCosto').value = '';
    document.getElementById('margen').value = '';

    const precioBase = parseFloat(document.getElementById('precioBase').value);

    if (isNaN(precioBase) || precioBase <= 0) {
        limpiar();
        return;
    }

    calcularResultados(precioBase);
}

// Calcular desde precio de costo y margen
function calcularDesdeCosto() {
    const precioCosto = parseFloat(document.getElementById('precioCosto').value);
    const margen = parseFloat(document.getElementById('margen').value);

    if (isNaN(precioCosto) || precioCosto <= 0 || isNaN(margen) || margen <= 0) {
        if (precioCosto > 0 || margen > 0) {
            // Si hay algo en los campos pero no está completo, no limpiar
            return;
        }
        limpiar();
        return;
    }

    // Limpiar el campo de precio base
    document.getElementById('precioBase').value = '';

    // Calcular precio base desde costo + margen
    const precioBase = precioCosto * (1 + margen / 100);
    calcularResultados(precioBase);
}

// Función común para calcular todos los resultados
function calcularResultados(precioBase) {
    // 1. Precio Lista: Sumamos 25% y redondeamos a la centena
    let precioLista = precioBase * 1.25;
    precioLista = Math.round(precioLista / 100) * 100;

    // 2. Precio con 20% OFF sobre el precio de lista
    const precioPromo = precioLista * 0.80;

    // 3. 3 Cuotas sin interés (Precio Lista / 3)
    const precioCuotas = precioLista / 3;

    // 4. Dinero recibido en cuenta (factor 0.765381)
    const dineroNeto = precioLista * 0.765381;

    // Mostrar resultados
    document.getElementById('resLista').innerText = `$${precioLista.toLocaleString('es-AR')}`;
    document.getElementById('resPromo').innerText = `$${precioPromo.toLocaleString('es-AR')}`;
    document.getElementById('resCuotas').innerText = `$${precioCuotas.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
    document.getElementById('resNeto').innerText = `$${dineroNeto.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
}

function limpiar() {
    document.getElementById('resLista').innerText = "$0";
    document.getElementById('resPromo').innerText = "$0";
    document.getElementById('resCuotas').innerText = "$0";
    document.getElementById('resNeto').innerText = "$0";
}

// ========================================
// GUARDADO Y CARGA DE CÁLCULOS
// ========================================
function guardarCalculo() {
    const titulo = document.getElementById('tituloCalculo').value.trim();
    const precioBase = document.getElementById('precioBase').value;
    const precioCosto = document.getElementById('precioCosto').value;
    const margen = document.getElementById('margen').value;

    const resLista = document.getElementById('resLista').innerText;
    const resPromo = document.getElementById('resPromo').innerText;
    const resCuotas = document.getElementById('resCuotas').innerText;
    const resNeto = document.getElementById('resNeto').innerText;

    // Validar que haya resultados
    if (resLista === '$0') {
        alert('⚠️ Primero hacé un cálculo');
        return;
    }

    if (!titulo) {
        alert('⚠️ Ingresá un nombre para el cálculo');
        return;
    }

    // Crear objeto de cálculo
    const calculo = {
        id: Date.now(),
        titulo: titulo,
        fecha: new Date().toLocaleString('es-AR'),
        inputs: {
            precioBase: precioBase || null,
            precioCosto: precioCosto || null,
            margen: margen || null
        },
        resultados: {
            lista: resLista,
            efectivo: resPromo,
            cuotas: resCuotas,
            neto: resNeto
        }
    };

    // Obtener cálculos guardados
    let calculos = JSON.parse(localStorage.getItem('calculosGuardados') || '[]');
    calculos.unshift(calculo); // Agregar al principio

    // Limitar a 50 cálculos
    if (calculos.length > 50) {
        calculos = calculos.slice(0, 50);
    }

    // Guardar en localStorage
    localStorage.setItem('calculosGuardados', JSON.stringify(calculos));

    // Limpiar input de título
    document.getElementById('tituloCalculo').value = '';

    alert('✅ Cálculo guardado exitosamente');

    // Actualizar lista si estamos en esa tab
    cargarHistorial();
}

function cargarHistorial() {
    const calculos = JSON.parse(localStorage.getItem('calculosGuardados') || '[]');
    const lista = document.getElementById('listaHistorial');

    if (calculos.length === 0) {
        lista.innerHTML = '<p class="empty-state">No hay cálculos guardados aún</p>';
        return;
    }

    lista.innerHTML = calculos.map(calc => `
        <div class="historial-item" onclick="cargarCalculo(${calc.id})">
            <div class="historial-item-header">
                <strong>${calc.titulo}</strong>
                <button class="btn-delete" onclick="event.stopPropagation(); eliminarCalculo(${calc.id})">❌</button>
            </div>
            <div class="historial-item-date">${calc.fecha}</div>
            <div class="historial-item-results">
                <div><span>Lista:</span> ${calc.resultados.lista}</div>
                <div><span>Efectivo:</span> ${calc.resultados.efectivo}</div>
                <div><span>3 Cuotas:</span> ${calc.resultados.cuotas}</div>
                <div><span>Neto MP:</span> ${calc.resultados.neto}</div>
            </div>
        </div>
    `).join('');
}

function cargarCalculo(id) {
    const calculos = JSON.parse(localStorage.getItem('calculosGuardados') || '[]');
    const calculo = calculos.find(c => c.id === id);

    if (!calculo) return;

    // Cargar los valores
    if (calculo.inputs.precioBase) {
        document.getElementById('precioBase').value = calculo.inputs.precioBase;
        document.getElementById('precioCosto').value = '';
        document.getElementById('margen').value = '';
        calcularDesdePrecioBase();
    } else if (calculo.inputs.precioCosto && calculo.inputs.margen) {
        document.getElementById('precioCosto').value = calculo.inputs.precioCosto;
        document.getElementById('margen').value = calculo.inputs.margen;
        document.getElementById('precioBase').value = '';
        calcularDesdeCosto();
    }

    // Cargar el título
    document.getElementById('tituloCalculo').value = calculo.titulo;

    // Cambiar a la tab de calculadora
    switchTab('calculadora');
}

function eliminarCalculo(id) {
    if (!confirm('¿Estás seguro de eliminar este cálculo?')) return;

    let calculos = JSON.parse(localStorage.getItem('calculosGuardados') || '[]');
    calculos = calculos.filter(c => c.id !== id);
    localStorage.setItem('calculosGuardados', JSON.stringify(calculos));
    cargarHistorial();
}

function limpiarHistorial() {
    if (!confirm('¿Estás seguro de eliminar TODOS los cálculos guardados?')) return;

    localStorage.removeItem('calculosGuardados');
    cargarHistorial();
}

// Cargar historial al cambiar de tab
const originalSwitchTab = switchTab;
function switchTab(tabName) {
    originalSwitchTab(tabName);
    if (tabName === 'historial') {
        cargarHistorial();
    }
}

// ========================================
// TAB NAVIGATION
// ========================================
function switchTab(tabName) {
    // Remove active class from all tabs and contents
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    // Add active class to selected tab
    event.target.closest('.tab').classList.add('active');

    // Show corresponding content
    document.getElementById(`${tabName}-content`).classList.add('active');
}

// ========================================
// GENERADOR DE QR
// ========================================
const qr = new QRCodeStyling({
    width: 220,
    height: 220,
    type: "png",

    // Estilo de puntos modernos
    dotsOptions: {
        color: "#111111",
        type: "rounded"
    },

    // Esquinas modernas
    cornersSquareOptions: {
        type: "extra-rounded",
        color: "#000000"
    },

    cornersDotOptions: {
        type: "dot",
        color: "#000000"
    },

    // Fondo
    backgroundOptions: {
        color: "#ffffff"
    },

    // Logo centrado
    imageOptions: {
        crossOrigin: "anonymous",
        margin: 4,
        hideBackgroundDots: true
    },

    // Logo de Somos Lola
    image: "https://res.cloudinary.com/dl2jw7fkm/image/upload/v1764911972/somoslola/products/bfvvbfvxnd6bfyicof2f.png"
});

let qrRendered = false;

function generateQR() {
    const url = document.getElementById("inputUrl").value.trim();
    if (!url) {
        alert("⚠️ Ingresá un enlace o texto");
        return;
    }

    qr.update({ data: url });

    if (!qrRendered) {
        document.getElementById("qrContainer").innerHTML = "";
        qr.append(document.getElementById("qrContainer"));
        qrRendered = true;
    }

    // Mostrar botón de descarga
    document.querySelector('.btn-download').style.display = 'block';
}

async function copyLink() {
    const url = document.getElementById("inputUrl").value.trim();
    if (!url) {
        alert("⚠️ No hay nada para copiar");
        return;
    }

    try {
        await navigator.clipboard.writeText(url);
        alert("✅ Link copiado al portapapeles");
    } catch (err) {
        alert("❌ Error al copiar");
    }
}

function downloadQR() {
    const url = document.getElementById("inputUrl").value.trim();
    if (!url) {
        alert("⚠️ Primero generá un QR");
        return;
    }

    qr.download({
        name: "qr-somos-lola",
        extension: "png"
    });
}
