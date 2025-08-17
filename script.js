// Dados fictícios de pedidos baseados em CPF
const ordersDatabase = {
    '12345678901': {
        orderNumber: '2024001234',
        customerName: 'João Silva Santos',
        orderValue: 'R$ 299,90',
        orderDate: '15/01/2024',
        deliveryDate: '22/01/2024',
        currentStep: 4,
        timeline: [
            {
                title: 'Pedido Confirmado',
                description: 'Pedido recebido e pagamento aprovado',
                date: '15/01/2024 - 14:30'
            },
            {
                title: 'Em Análise',
                description: 'Verificação de dados e disponibilidade',
                date: '15/01/2024 - 15:45'
            },
            {
                title: 'Em Preparação',
                description: 'Produtos separados e embalados',
                date: '16/01/2024 - 09:20'
            },
            {
                title: 'Coletado pela Transportadora',
                description: 'Pedido retirado pela transportadora XYZ',
                date: '17/01/2024 - 16:10'
            },
            {
                title: 'A Caminho',
                description: 'Saiu para entrega - Centro de Distribuição SP',
                date: '19/01/2024 - 08:30'
            }
        ]
    },
    '98765432100': {
        orderNumber: '2024001567',
        customerName: 'Maria Oliveira Costa',
        orderValue: 'R$ 149,50',
        orderDate: '18/01/2024',
        deliveryDate: '25/01/2024',
        currentStep: 2,
        timeline: [
            {
                title: 'Pedido Confirmado',
                description: 'Pedido recebido e pagamento aprovado',
                date: '18/01/2024 - 10:15'
            },
            {
                title: 'Em Análise',
                description: 'Verificação de dados e disponibilidade',
                date: '18/01/2024 - 11:30'
            },
            {
                title: 'Em Preparação',
                description: 'Produtos sendo separados no estoque',
                date: '19/01/2024 - 14:20'
            }
        ]
    },
    '11122233344': {
        orderNumber: '2024001890',
        customerName: 'Carlos Roberto Lima',
        orderValue: 'R$ 89,90',
        orderDate: '20/01/2024',
        deliveryDate: '27/01/2024',
        currentStep: 5,
        timeline: [
            {
                title: 'Pedido Confirmado',
                description: 'Pedido recebido e pagamento aprovado',
                date: '20/01/2024 - 16:45'
            },
            {
                title: 'Em Análise',
                description: 'Verificação de dados e disponibilidade',
                date: '20/01/2024 - 17:00'
            },
            {
                title: 'Em Preparação',
                description: 'Produtos separados e embalados',
                date: '21/01/2024 - 08:30'
            },
            {
                title: 'Coletado pela Transportadora',
                description: 'Pedido retirado pela transportadora ABC',
                date: '21/01/2024 - 14:20'
            },
            {
                title: 'A Caminho',
                description: 'Saiu para entrega - Centro de Distribuição RJ',
                date: '22/01/2024 - 07:15'
            },
            {
                title: 'Entregue',
                description: 'Pedido entregue e recebido pelo cliente',
                date: '23/01/2024 - 15:30'
            }
        ]
    }
};

// Elementos do DOM
const cpfInput = document.getElementById('cpf');
const trackButton = document.getElementById('trackButton');
const orderResult = document.getElementById('orderResult');
const errorMessage = document.getElementById('errorMessage');

// Elementos de informações do pedido
const orderNumber = document.getElementById('orderNumber');
const orderDate = document.getElementById('orderDate');
const customerName = document.getElementById('customerName');
const orderValue = document.getElementById('orderValue');
const deliveryDate = document.getElementById('deliveryDate');
const timeline = document.getElementById('timeline');

// Função para formatar CPF
function formatCPF(value) {
    // Remove tudo que não é dígito
    value = value.replace(/\D/g, '');
    
    // Aplica a máscara
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    
    return value;
}

// Função para validar CPF (validação básica de formato)
function isValidCPF(cpf) {
    // Remove formatação
    cpf = cpf.replace(/\D/g, '');
    
    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) return false;
    
    // Verifica se não são todos os dígitos iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    return true;
}

// Função para limpar CPF (remover formatação)
function cleanCPF(cpf) {
    return cpf.replace(/\D/g, '');
}

// Função para atualizar o progresso visual
function updateProgress(currentStep) {
    const steps = document.querySelectorAll('.step');
    const progressFill = document.querySelector('.progress-fill');
    
    // Calcula a porcentagem do progresso
    const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;
    
    // Atualiza a barra de progresso
    setTimeout(() => {
        progressFill.style.width = `${progressPercentage}%`;
    }, 300);
    
    // Atualiza os steps
    steps.forEach((step, index) => {
        const stepNumber = index + 1;
        
        // Remove classes anteriores
        step.classList.remove('active', 'completed');
        
        if (stepNumber < currentStep) {
            step.classList.add('completed');
        } else if (stepNumber === currentStep) {
            step.classList.add('active');
        }
    });
}

// Função para criar o timeline
function createTimeline(timelineData) {
    timeline.innerHTML = '';
    
    timelineData.forEach((item, index) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        
        timelineItem.innerHTML = `
            <div class="timeline-content">
                <h5>${item.title}</h5>
                <p>${item.description}</p>
                <span class="timeline-date">${item.date}</span>
            </div>
        `;
        
        // Adiciona animação com delay
        timelineItem.style.opacity = '0';
        timelineItem.style.transform = 'translateX(-20px)';
        
        timeline.appendChild(timelineItem);
        
        // Anima a entrada do item
        setTimeout(() => {
            timelineItem.style.transition = 'all 0.5s ease';
            timelineItem.style.opacity = '1';
            timelineItem.style.transform = 'translateX(0)';
        }, index * 100 + 500);
    });
}

// Função para exibir os dados do pedido
function displayOrderData(orderData) {
    // Preenche as informações básicas
    orderNumber.textContent = orderData.orderNumber;
    orderDate.textContent = orderData.orderDate;
    customerName.textContent = orderData.customerName;
    orderValue.textContent = orderData.orderValue;
    deliveryDate.textContent = orderData.deliveryDate;
    
    // Esconde mensagem de erro e exibe resultado
    errorMessage.classList.add('hidden');
    orderResult.classList.remove('hidden');
    
    // Atualiza o progresso
    updateProgress(orderData.currentStep);
    
    // Cria o timeline
    createTimeline(orderData.timeline);
    
    // Scroll suave para o resultado
    setTimeout(() => {
        orderResult.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }, 300);
}

// Função para exibir erro
function displayError() {
    orderResult.classList.add('hidden');
    errorMessage.classList.remove('hidden');
    
    // Scroll suave para a mensagem de erro
    setTimeout(() => {
        errorMessage.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }, 300);
}

// Função para buscar pedido
function trackOrder() {
    const cpfValue = cpfInput.value;
    
    // Valida o CPF
    if (!isValidCPF(cpfValue)) {
        displayError();
        return;
    }
    
    // Limpa o CPF para busca
    const cleanedCPF = cleanCPF(cpfValue);
    
    // Busca o pedido na base de dados
    const orderData = ordersDatabase[cleanedCPF];
    
    if (orderData) {
        // Adiciona um pequeno delay para simular busca no servidor
        trackButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando...';
        trackButton.disabled = true;
        
        setTimeout(() => {
            displayOrderData(orderData);
            trackButton.innerHTML = '<i class="fas fa-search"></i> Acompanhar Pedido';
            trackButton.disabled = false;
        }, 1500);
    } else {
        displayError();
    }
}

// Event Listeners
cpfInput.addEventListener('input', function(e) {
    e.target.value = formatCPF(e.target.value);
});

cpfInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        trackOrder();
    }
});

trackButton.addEventListener('click', trackOrder);

// Adiciona alguns CPFs de exemplo no console para teste
console.log('CPFs de exemplo para teste:');
console.log('123.456.789-01 - João Silva Santos (A caminho)');
console.log('987.654.321-00 - Maria Oliveira Costa (Em preparação)');
console.log('111.222.333-44 - Carlos Roberto Lima (Entregue)');

// Função para demonstração automática (opcional)
function demoMode() {
    const demoCPFs = ['12345678901', '98765432100', '11122233344'];
    let currentDemo = 0;
    
    setInterval(() => {
        if (orderResult.classList.contains('hidden') && errorMessage.classList.contains('hidden')) {
            cpfInput.value = formatCPF(demoCPFs[currentDemo]);
            setTimeout(() => {
                trackOrder();
                currentDemo = (currentDemo + 1) % demoCPFs.length;
            }, 2000);
        }
    }, 10000);
}

// Descomente a linha abaixo para ativar o modo demonstração
// demoMode();

// Adiciona efeito de foco no input
cpfInput.addEventListener('focus', function() {
    this.parentElement.style.transform = 'scale(1.02)';
});

cpfInput.addEventListener('blur', function() {
    this.parentElement.style.transform = 'scale(1)';
});

// Adiciona efeito hover nos steps
document.querySelectorAll('.step').forEach(step => {
    step.addEventListener('mouseenter', function() {
        if (!this.classList.contains('active') && !this.classList.contains('completed')) {
            this.style.transform = 'translateY(-5px)';
        }
    });
    
    step.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Foca no input de CPF ao carregar a página
    cpfInput.focus();
    
    // Adiciona animação de entrada aos elementos
    const elements = document.querySelectorAll('.tracking-header, .tracking-form');
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200 + 300);
    });
});
