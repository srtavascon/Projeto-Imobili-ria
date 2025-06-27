// ========================
// INÍCIO - UTILIDADES GERAIS
// ========================

function getInquilinos() {
    const dados = localStorage.getItem('inquilinos');
    return dados ? JSON.parse(dados) : [];
}

function salvarInquilinos(inquilinos) {
    localStorage.setItem('inquilinos', JSON.stringify(inquilinos));
}

function getParametroUrl(nome) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(nome);
}

// ========================
// CADASTRO & EDIÇÃO (cadastro.html e editar.html)
// ========================

if (document.querySelector('form')) {
    const form = document.querySelector('form');
    const campos = form.querySelectorAll('input[required]');
    
    const mensagemErro = document.createElement('div');
    mensagemErro.style.color = 'red';
    mensagemErro.style.marginBottom = '10px';
    form.prepend(mensagemErro);

    const idEditando = getParametroUrl('id');
    if (idEditando !== null) {
        const inquilinos = getInquilinos();
        const inquilino = inquilinos.find(i => i.id === parseInt(idEditando));
        if (inquilino) {
            form.nome.value = inquilino.nome;
            form.telefone.value = inquilino.telefone;
            form.data_nascimento.value = inquilino.data_nascimento;
            form.email.value = inquilino.email;
            form.cpf.value = inquilino.cpf;
            form.endereco.value = inquilino.endereco;
            form.rg.value = inquilino.rg;
        }
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        let valido = true;
        mensagemErro.textContent = '';

        campos.forEach(campo => {
            campo.classList.remove('erro');
            if (!campo.value.trim()) {
                campo.classList.add('erro');
                valido = false;
            }
        });

        if (!valido) {
            mensagemErro.textContent = 'Por favor, preencha todos os campos obrigatórios.';
            return;
        }

        const novoInquilino = {
            id: idEditando ? parseInt(idEditando) : Date.now(),
            nome: form.nome.value,
            telefone: form.telefone.value,
            data_nascimento: form.data_nascimento.value,
            email: form.email.value,
            cpf: form.cpf.value,
            endereco: form.endereco.value,
            rg: form.rg.value,
            dataCadastro: new Date().toLocaleDateString('pt-BR')
        };

        const inquilinos = getInquilinos();

        if (idEditando) {
            const index = inquilinos.findIndex(i => i.id === parseInt(idEditando));
            inquilinos[index] = novoInquilino;
        } else {
            inquilinos.push(novoInquilino);
        }

        salvarInquilinos(inquilinos);
        window.location.href = 'inicio.html';
    });
}

// ========================
// LISTAGEM (inicio.html)
// ========================

if (window.location.pathname.includes('inicio.html')) {
    const tbody = document.querySelector('table tbody');
    const inquilinos = getInquilinos();
    tbody.innerHTML = '';

    inquilinos.forEach(inquilino => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${inquilino.nome}</td>
            <td></td> <!-- Código do imóvel (futuro) -->
            <td>${inquilino.dataCadastro}</td>
            <td>
                <a href="perfil.html?id=${inquilino.id}" class="btn">Visualizar</a>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ========================
// PERFIL (perfil.html)
// ========================

if (window.location.pathname.includes('perfil.html')) {
    const id = getParametroUrl('id');
    if (id) {
        const inquilinos = getInquilinos();
        const inquilino = inquilinos.find(i => i.id === parseInt(id));
        if (inquilino) {
            const spans = document.querySelectorAll('.dado-fixo');
            spans[0].textContent = inquilino.nome;
            spans[1].textContent = inquilino.telefone;
            spans[2].textContent = new Date(inquilino.data_nascimento).toLocaleDateString('pt-BR');
            spans[3].textContent = inquilino.email;
            spans[4].textContent = inquilino.cpf;
            spans[5].textContent = inquilino.endereco;
            spans[6].textContent = inquilino.rg;
            spans[7].textContent = ''; // Código do imóvel (não implementado ainda)
            spans[8].textContent = inquilino.dataCadastro;

            const editarBtn = document.querySelector('a[href="editar.html"]');
            if (editarBtn) editarBtn.href = `editar.html?id=${inquilino.id}`;
        }
    }
}

// ========================
// EXCLUSÃO NO editar.html
// ========================

if (window.location.pathname.includes('editar.html')) {
    const id = getParametroUrl('id');
    const excluirBtn = document.getElementById('btn-excluir');

    if (excluirBtn && id) {
        excluirBtn.addEventListener('click', () => {
            const confirmado = confirm('Tem certeza que deseja excluir este inquilino?');
            if (!confirmado) return;

            let inquilinos = getInquilinos();
            inquilinos = inquilinos.filter(i => i.id !== parseInt(id));
            salvarInquilinos(inquilinos);

            alert('Inquilino excluído com sucesso!');
            window.location.href = 'inicio.html';
        });
    }

            // Restaurar campos para o estado original ao carregar a página (ultimo salvamento)
        if (window.location.pathname.includes('editar.html')) {
            const id = getParametroUrl('id');
            let estadoOriginal = {};

            if (id) {
                const inquilinos = getInquilinos();
                const inquilino = inquilinos.find(i => i.id === parseInt(id));
                
                if (inquilino) {
                    estadoOriginal = { ...inquilino }; // Guardar o estado original dos dados

                    const form = document.querySelector('.form-container');
                    const btnRestaurar = form.querySelector('button[type="reset"]');

                    // Ao clicar em Restaurar, retornar aos dados originais
                    btnRestaurar.addEventListener('click', (e) => {
                        e.preventDefault(); // Evitar comportamento padrão do botão reset

                        form.nome.value = estadoOriginal.nome;
                        form.telefone.value = estadoOriginal.telefone;
                        form.data_nascimento.value = estadoOriginal.data_nascimento;
                        form.email.value = estadoOriginal.email;
                        form.cpf.value = estadoOriginal.cpf;
                        form.endereco.value = estadoOriginal.endereco;
                        form.rg.value = estadoOriginal.rg;
                    });
                }
            }
        }


}

// ========================
// ESTILO PARA ERROS
// ========================

const estiloErro = document.createElement('style');
estiloErro.textContent = `
    .erro {
        border: 1px solid red !important;
    }
`;
document.head.appendChild(estiloErro);
