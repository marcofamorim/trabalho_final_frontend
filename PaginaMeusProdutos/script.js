document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY_PEDIDOS = 'meusPedidos';
    const telefone = document.getElementById("telefone");
    const msg = document.getElementById("copiado-msg");
    const numero = "(31) 9 9945-5642"; 
    
    
    function getPedidos() {
        const pedidosJSON = localStorage.getItem(STORAGE_KEY_PEDIDOS);
        return pedidosJSON ? JSON.parse(pedidosJSON) : [];
    }
    
    function savePedidos(pedidos) {
        localStorage.setItem(STORAGE_KEY_PEDIDOS, JSON.stringify(pedidos));
    }


    window.adicionarNovoPedido = (nomeProduto, codigo, status, imagemSrc) => {
        const novoPedido = {
            id: Date.now(),
            nome: nomeProduto,
            codigo: codigo,
            status: status,
            data: new Date().toLocaleDateString('pt-BR'),
            imagem: imagemSrc || 'produto-default.png'
        };

        const pedidosAtuais = getPedidos();
        pedidosAtuais.unshift(novoPedido); 
        savePedidos(pedidosAtuais);
        
        if (document.querySelector('.pagina-pedidos')) {
             renderizarPedidos(); 
        }
    };


    function renderizarPedidos() {
        const listaPedidosContainer = document.querySelector('.lista-pedidos');
        if (!listaPedidosContainer) return;

        const pedidos = getPedidos();
        listaPedidosContainer.innerHTML = '';

        if (pedidos.length === 0) {
            listaPedidosContainer.innerHTML = '<p class="no-pedidos-message">Você ainda não possui pedidos registrados.</p>';
            return;
        }

        pedidos.forEach(pedido => {
            let statusClass = '';
            let buttonText = 'Ver Detalhes';
            
            if (pedido.status.includes('Entregue')) {
                statusClass = 'status-entregue';
            } else if (pedido.status.includes('Transporte')) {
                statusClass = 'status-em-andamento';
                buttonText = 'Ver Rastreio';
            } else {
                buttonText = 'Acompanhar';
            }
            
            const pedidoHTML = `
                <div class="card-pedido" data-pedido-id="${pedido.id}">
                    <div class="produto-imagem">
                        <img src="${pedido.imagem}" alt="Imagem do ${pedido.nome}" class="imagem-pedido-card">
                    </div>
                    <div class="detalhes-pedido">
                        <span class="codigo-pedido-texto">${pedido.nome}</span>
                        <span class="pedido-status ${statusClass}">Status: ${pedido.status}</span>
                        <span class="pedido-data">Comprado em: ${pedido.data} (Cód: ${pedido.codigo})</span>
                    </div>
                    <div class="pedido-acoes">
                        <button class="botao-detalhes">${buttonText}</button>
                    </div>
                </div>
            `;
            listaPedidosContainer.innerHTML += pedidoHTML;
        });
        
        document.querySelectorAll('.botao-detalhes').forEach(button => {
            button.addEventListener('click', (e) => {
                const card = e.target.closest('.card-pedido');
                const pedidoId = card.getAttribute('data-pedido-id');
                alert(`Simulando ação para o pedido ID: ${pedidoId}. Ação: ${e.target.textContent}`);
            });
        });
    }


    if (document.querySelector('.pagina-pedidos')) {
        if (getPedidos().length === 0) {
             window.adicionarNovoPedido('Teclado Mecânico RGB', 'PAG1001', 'Entregue', 'produto-exemplo.png');
             window.adicionarNovoPedido('Mouse Sem Fio Ultralight', 'PAG1002', 'Em Transporte', 'produto-exemplo-2.png');
        }
        renderizarPedidos();
    }
    
    if (telefone && msg) {
        telefone.addEventListener("click", () => {
            navigator.clipboard.writeText(numero).then(() => {
                msg.style.opacity = "1";
                setTimeout(() => {
                    msg.style.opacity = "0";
                }, 1500);
            });
        });
    }
});