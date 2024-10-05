function getUserIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('userId');
}

document.addEventListener('DOMContentLoaded', function() {
  const userId = getUserIdFromUrl();
  const detalhesUsuario = document.getElementById('detalhesUsuario');
  const mensagemErro = document.getElementById('mensagemErro');
  const token = localStorage.getItem('token');

  fetch(`http://localhost:8000/api/user/visualizar/${userId}`, {
      method: 'GET',
      headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
      }
  })
  .then(response => response.json())
  .then(data => {
      const usuario = data.user; 
      detalhesUsuario.innerHTML = `
          <p><strong>Nome:</strong> ${usuario.name}</p>
          <p><strong>Email:</strong> ${usuario.email}</p>
          <p><strong>Data de Criação:</strong> ${new Date(usuario.created_at).toLocaleDateString()}</p>
      `;
  })
  .catch(error => {
      mensagemErro.classList.remove('d-none');
      mensagemErro.textContent = 'Erro ao carregar os detalhes do usuário.';
      console.error('Erro:', error);
  });
});

document.getElementById('voltarBtn').addEventListener('click', function() {
  window.history.back();
});
