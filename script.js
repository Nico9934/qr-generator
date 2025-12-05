const qr = new QRCodeStyling({
    width: 300,
    height: 300,
    type: "png",

    // 🎨 DOTS modernos
    dotsOptions: {
        color: "#111111",
        type: "rounded"  // rounded, classy, classy-rounded, dots
    },

    // 🎨 ESQUINAS modernas
    cornersSquareOptions: {
        type: "extra-rounded", // rounded, extra-rounded
        color: "#000000"
    },

    cornersDotOptions: {
        type: "dot",
        color: "#000000"
    },

    // 🎨 FONDO
    backgroundOptions: {
        color: "#ffffff"
    },

    // 🎨 LOGO centrado con borde suave
    imageOptions: {
        crossOrigin: "anonymous",
        margin: 4, // más delicado
        hideBackgroundDots: true
    },

    // Logo (cambiá por tu marca)
    image: "https://res.cloudinary.com/dl2jw7fkm/image/upload/v1764911972/somoslola/products/bfvvbfvxnd6bfyicof2f.png"
});

let qrRendered = false;

function generateQR() {
    const url = document.getElementById("inputUrl").value.trim();
    if (!url) return alert("Ingresá un enlace.");

    qr.update({ data: url });

    if (!qrRendered) {
        qr.append(document.getElementById("qrContainer"));
        qrRendered = true;
    }
}

async function copyLink() {
    const url = document.getElementById("inputUrl").value.trim();
    if (!url) return;
    await navigator.clipboard.writeText(url);
    alert("Link copiado 👍");
}

function downloadQR() {
    qr.download({ name: "qr_moderno", extension: "png" });
}
