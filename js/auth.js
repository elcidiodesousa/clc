// Verificar autenticação
function verificarAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
        return false;
    }
    return true;
}

// Redirecionar baseado no tipo de usuário
function redirecionarPorTipo() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const tipo = user.tipo;
    
    if (tipo === 'ADMIN') {
        // Admin tem acesso total
        return;
    } else if (tipo === 'JURADO') {
        // Jurado foca em avaliações
        console.log('Jurado logado');
    } else {
        // Membro comum
        console.log('Membro logado');
    }
}

// Formatar data
function formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Formatar hora
function formatarHora(hora) {
    if (!hora) return '--:--';
    return hora.substring(0, 5);
}

// Validar email
function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Exportar funções
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { verificarAuth, formatarData, formatarHora, validarEmail };
}