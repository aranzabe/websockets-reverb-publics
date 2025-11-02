const lblOn      = document.querySelector('#lblOn');
const lblOff     = document.querySelector('#lblOff');
const txtMensaje = document.querySelector('#txtMensaje');
const btnEnviar  = document.querySelector('#btnEnviar');
const ulMessages = document.querySelector('#messages');

// Configuración Pusher para Reverb
const pusher = new Pusher('local-app-key', {
    wsHost: '127.0.0.1',
    wsPort: 8080,
    forceTLS: false,
    enabledTransports: ['ws'],
    cluster: 'mt1',
    disableStats: true,  // Evita llamadas externas
    enabled: true
    // Evitamos reconexión automática infinita
    //reconnectAttempts: 0,
    //reconnectDelay: 0,
});

// Canal público
const channel = pusher.subscribe('chat');

// ======== Estado Online / Offline ========
function setOnline() {
    lblOn.style.display = '';
    lblOff.style.display = 'none';
}

function setOffline() {
    lblOn.style.display = 'none';
    lblOff.style.display = '';
}

// ======== Eventos globales de conexión ========
pusher.connection.bind('connected', () => {
    //console.log('Conectado a Reverb');
    console.info('✅ Conectado correctamente a Reverb');
    setOnline();
});


pusher.connection.bind('error', (err) => {
    if (err.data.code === 1006) {
        console.warn('⚠️ Conexión perdida con Reverb');
    } else {
        console.error('⚠️ Error WebSocket:', err);
        setOffline();
    }
});

// ======== Recepción de mensajes en tiempo real ========
channel.bind('message.sent', (data) => {
    console.log('Mensaje recibido desde servidor:', data.message);
    const li = document.createElement('li');
    li.textContent = data.message;
    li.classList.add('list-group-item');
    ulMessages.appendChild(li);
});

// ======== Enviar mensaje al backend ========
btnEnviar.addEventListener('click', () => {
    const mensaje = txtMensaje.value.trim();
    if (!mensaje) return;

    const payload = {
        message: mensaje,
        //user_id: '1A',
        timestamp: new Date().toISOString(),
    };

    fetch('http://127.0.0.1:8000/api/chat/send', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
    })
    .then(res => res.json())
    .then(resp => {
        console.log('Confirmación del servidor:', resp);
        txtMensaje.value = '';
    })
    .catch(err => console.error('Error al enviar:', err));
});






