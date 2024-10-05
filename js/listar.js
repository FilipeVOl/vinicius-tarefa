// Função para listar os usuários
async function listarUsuarios() {
    const token = localStorage.getItem('token');
    const userIdLogado = localStorage.getItem('userId');
    const tabelaUsuarios = document.getElementById('tabelaUsuarios');
    const mensagemErro = document.getElementById('mensagemErro');

    try {
        if (token) {
            const response = await fetch('http://localhost:8000/api/user', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.ok) {
                const usuarios = await response.json();
                tabelaUsuarios.innerHTML = ''; 
    
                usuarios.user.data.forEach((usuario, index) => {
                    const dataCriacao = new Date(usuario.created_at);
                    const dataFormatada = dataCriacao.toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false
                    });
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${usuario.name}</td>
                        <td>${usuario.email}</td>
                         <td>
                            <button class="btn btn-info btn-sm ver-ficha-usuario" data-id="${usuario.id}">
                                <i class="fas fa-eye"></i> Ver Ficha
                            </button>
                        </td>
                    `;
                    tabelaUsuarios.appendChild(row);
                });

                document.querySelectorAll('.ver-ficha-usuario').forEach(button => {
                    button.addEventListener('click', function() {
                        const userId = this.getAttribute('data-id');
                        window.location.href = `visualizar.html?userId=${userId}`;
                    });
                });
            } else {
                throw new Error('Erro ao buscar os usuários');
            }
        } else {
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Erro:', error);
        mensagemErro.textContent = 'Erro ao carregar a lista de usuários';
        mensagemErro.classList.remove('d-none');
    }
}


async function excluirUsuario(userId) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`http://localhost:8000/api/user/deletar/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            alert('Usuário excluído com sucesso!');
            listarUsuarios();
        } else {
            throw new Error('Erro ao excluir o usuário');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao excluir o usuário.');
    }
}


document.getElementById('logoutBtn').addEventListener('click', async function() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:8000/api/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            localStorage.clear();
            window.location.href = 'login.html';
        } else {
            console.error('Erro ao deslogar');
        }
    } catch (error) {
        console.error('Erro de rede ao tentar deslogar:', error);
    }
});


document.getElementById('dashboardBtn').addEventListener('click', function() {
    window.location.href = 'dashboard.html';
});


document.addEventListener('DOMContentLoaded', listarUsuarios);
