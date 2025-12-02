// --- chatbot.js ---

const widget = document.getElementById('chat-widget');
const chatFormWidget = document.getElementById('chatFormWidget');
const chatWindow = document.getElementById('chatWindow');
const userInput = document.getElementById('userMsgWidget');

function toggleChat() {
  widget.classList.toggle('active');
  if(widget.classList.contains('active')) {
    setTimeout(() => userInput.focus(), 100);
  }
}

chatFormWidget.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;

  addMessageWidget(text, 'user');
  userInput.value = '';
  const loadingId = addMessageWidget('Escribiendo...', 'bot', true);

  try {
    // Conexión a tu API Vercel
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: text })
    });
    const data = await res.json();
    removeMessage(loadingId);
    
    if (data.error) addMessageWidget('Error de conexión.', 'bot');
    else addMessageWidget(data.texto, 'bot');

  } catch (err) {
    removeMessage(loadingId);
    addMessageWidget('Sin conexión.', 'bot');
  }
});

function addMessageWidget(text, sender, isLoading = false) {
  const div = document.createElement('div');
  div.classList.add('message', sender);
  div.innerHTML = text.replace(/\n/g, '<br>');
  if (isLoading) { div.id = 'loading-msg'; div.style.fontStyle = 'italic'; div.style.opacity = '0.7'; }
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return div.id;
}

function removeMessage(id) {
  const el = document.getElementById(id);
  if(el) el.remove();
}