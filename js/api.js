// ============================================
// API SERVICE - VERSÃO COMPLETA
// ============================================

const API_BASE_URL = 'http://localhost:8080';

class ApiService {
    constructor() {
        this.token = localStorage.getItem('token');
    }

    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    async request(endpoint, method = 'GET', data = null) {
        const url = `${API_BASE_URL}${endpoint}`;
        const options = {
            method,
            headers: this.getHeaders(),
        };

        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            
            if (response.status === 404) {
                return [];
            }
            
            if (response.status === 204 || (response.status === 200 && response.headers.get('content-length') === '0')) {
                return null;
            }
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error(`Erro na requisição ${endpoint}:`, error);
            return method === 'GET' ? [] : null;
        }
    }

    // ========== USUÁRIOS ==========
    async getUsuarios() {
        return this.request('/usuarios');
    }

    async getUsuario(id) {
        return this.request(`/usuarios/${id}`);
    }

    async salvarUsuario(usuario) {
        return this.request('/usuarios', 'POST', usuario);
    }

    async atualizarUsuario(id, usuario) {
        return this.request(`/usuarios/${id}`, 'PUT', usuario);
    }

    async deletarUsuario(id) {
        return this.request(`/usuarios/${id}`, 'DELETE');
    }

    // ========== MEMBROS ==========
    async getMembros() {
        return this.request('/membros');
    }

    async getMembro(id) {
        return this.request(`/membros/${id}`);
    }

    async getMembroPorUsuario(idUsuario) {
        const membros = await this.getMembros();
        return membros.find(m => m.usuario?.id === idUsuario);
    }

    async salvarMembro(membro) {
        return this.request('/membros', 'POST', membro);
    }

    async atualizarMembro(id, membro) {
        return this.request(`/membros/${id}`, 'PUT', membro);
    }

    async deletarMembro(id) {
        return this.request(`/membros/${id}`, 'DELETE');
    }

    // ========== JURADOS ==========
    async getJurados() {
        return this.request('/jurados');
    }

    async getJurado(id) {
        return this.request(`/jurados/${id}`);
    }

    async salvarJurado(jurado) {
        return this.request('/jurados', 'POST', jurado);
    }

    async atualizarJurado(id, jurado) {
        return this.request(`/jurados/${id}`, 'PUT', jurado);
    }

    async deletarJurado(id) {
        return this.request(`/jurados/${id}`, 'DELETE');
    }

    // ========== EVENTOS ==========
    async getEventos() {
        return this.request('/eventos');
    }

    async getEvento(id) {
        return this.request(`/eventos/${id}`);
    }

    async salvarEvento(evento) {
        return this.request('/eventos', 'POST', evento);
    }

    async atualizarEvento(id, evento) {
        return this.request(`/eventos/${id}`, 'PUT', evento);
    }

    async deletarEvento(id) {
        return this.request(`/eventos/${id}`, 'DELETE');
    }

    // ========== CATEGORIAS ==========
    async getCategorias() {
        return this.request('/categorias');
    }

    async getCategoriasPorEvento(idEvento) {
        return this.request(`/categorias/evento/${idEvento}`);
    }

    async salvarCategoria(categoria) {
        return this.request('/categorias', 'POST', categoria);
    }

    // ========== INSCRIÇÕES ==========
    async getInscricoes() {
        return this.request('/inscricoes');
    }

    async getInscricao(id) {
        return this.request(`/inscricoes/${id}`);
    }

    async getInscricoesPorEvento(idEvento) {
        return this.request(`/inscricoes/evento/${idEvento}`);
    }

    async getInscricoesPorMembro(idMembro) {
        return this.request(`/inscricoes/membro/${idMembro}`);
    }

    async salvarInscricao(inscricao) {
        return this.request('/inscricoes', 'POST', inscricao);
    }

    async deletarInscricao(id) {
        return this.request(`/inscricoes/${id}`, 'DELETE');
    }

    // ========== AVALIAÇÕES ==========
    async getAvaliacoes() {
        return this.request('/avaliacoes');
    }

    async getAvaliacoesPorInscricao(idInscricao) {
        return this.request(`/avaliacoes/inscricao/${idInscricao}`);
    }

    async salvarAvaliacao(avaliacao) {
        return this.request('/avaliacoes', 'POST', avaliacao);
    }

    async deletarAvaliacao(id) {
        return this.request(`/avaliacoes/${id}`, 'DELETE');
    }

    // ========== RESULTADOS ==========
    async getRanking(idEvento) {
        return this.request(`/resultados/evento/${idEvento}`);
    }

    // ========== LOGIN ==========
    async login(email, senha) {
        const usuarios = await this.getUsuarios();
        const usuario = usuarios.find(u => u.email === email && u.senha === senha);
        
        if (!usuario) {
            throw new Error('Email ou senha inválidos');
        }
        
        this.token = `token-${usuario.id}-${Date.now()}`;
        localStorage.setItem('token', this.token);
        localStorage.setItem('user', JSON.stringify(usuario));
        
        return { token: this.token, user: usuario };
    }

    async logout() {
        localStorage.clear();
        this.token = null;
        window.location.href = 'index.html';
    }

    // ========== DASHBOARD ==========
    async getDashboardStats() {
        const [eventos, inscricoes, avaliacoes, membros] = await Promise.all([
            this.getEventos(),
            this.getInscricoes(),
            this.getAvaliacoes(),
            this.getMembros()
        ]);
        
        const mediaGeral = avaliacoes.length > 0 
            ? (avaliacoes.reduce((s, a) => s + (a.nota || 0), 0) / avaliacoes.length).toFixed(1)
            : 0;
        
        return {
            eventos: eventos.length,
            participantes: membros.length,
            avaliacoes: avaliacoes.length,
            mediaGeral: mediaGeral
        };
    }
}

const api = new ApiService();