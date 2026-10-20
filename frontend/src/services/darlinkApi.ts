import { API_BASE, authHeaders, clearAuthSession, setAuthSession } from '../config/api';

async function parseError(res: Response): Promise<string> {
  if (res.status === 401) {
    clearAuthSession();
  }
  try {
    const j = await res.json();
    const main =
      typeof j.error === 'string'
        ? j.error
        : Array.isArray(j.error)
          ? j.error
              .map((e: { message?: string }) => {
                if (typeof e === 'string') return e;
                if (e?.message) return e.message;
                return JSON.stringify(e);
              })
              .join(', ')
          : res.statusText;
    const detail = typeof j.detail === 'string' ? j.detail : '';
    if (detail && detail !== main) {
      return `${main} (${detail})`;
    }
    return main;
  } catch {
    return res.statusText;
  }
}

export const darlinkApi = {
  async login(email: string, motDePasse: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, motDePasse }),
    });
    if (!res.ok) throw new Error(await parseError(res));
    const data = await res.json();
    setAuthSession(data.token, data.user);
    return data as { token: string; user: { id: number; nom: string; email: string; role: string } };
  },

  async register(payload: {
    nom: string;
    email: string;
    motDePasse: string;
    role: 'CLIENT' | 'HOTE';
    profession?: string;
    ribBanque?: string;
  }) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(await parseError(res));
    const data = await res.json();
    setAuthSession(data.token, data.user);
    return data;
  },

  logout() {
    clearAuthSession();
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, { headers: authHeaders() });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json() as Promise<{
      user: {
        id: number;
        nom: string;
        email: string;
        role: string;
        telephone: string | null;
        photoProfil: string | null;
        clientId: number | null;
        hoteId: number | null;
        client?: { biographie: string | null; profession: string | null };
        hote?: { ribBanque: string | null };
      };
    }>;
  },

  async updateMe(data: {
    nom?: string;
    telephone?: string;
    photoProfil?: string;
    biographie?: string;
    profession?: string;
    ribBanque?: string;
  }) {
    const res = await fetch(`${API_BASE}/auth/me`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json();
  },

  async listEquipements() {
    const res = await fetch(`${API_BASE}/equipements`);
    if (!res.ok) throw new Error(await parseError(res));
    return res.json() as Promise<{ id: number; nom: string; icone: string | null }[]>;
  },

  async createColiving(body: {
    titre: string;
    description?: string;
    adresse: string;
    lienGoogleMap?: string;
    regles?: string;
    equipementIds: number[];
    imageUrls: string[];
    chambres: Array<{
      nom: string;
      description?: string;
      capacitePersonnes: number;
      litsDisponibles: number;
      prixParMois: number;
      typeChambre: 'PRIVEE' | 'PARTAGEE_DORTOIR';
    }>;
  }) {
    const res = await fetch(`${API_BASE}/hote/colivings`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json();
  },
  async updateColiving(id: number, body: {
    titre: string;
    description?: string;
    adresse: string;
    lienGoogleMap?: string;
    regles?: string;
    latitude?: number;
    longitude?: number;
    equipementIds: number[];
    imageUrls: string[];
    chambres: Array<{
      id?: number;
      nom: string;
      description?: string;
      capacitePersonnes: number;
      litsDisponibles: number;
      prixParMois: number;
      typeChambre: 'PRIVEE' | 'PARTAGEE_DORTOIR';
    }>;
  }) {
    const res = await fetch(`${API_BASE}/hote/colivings/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json();
  },
  async listMyColivings() {
    const res = await fetch(`${API_BASE}/hote/colivings`, { headers: authHeaders() });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json();
  },

  async listHostReservations() {
    const res = await fetch(`${API_BASE}/hote/reservations`, { headers: authHeaders() });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json();
  },

  async listMyReservations() {
    const res = await fetch(`${API_BASE}/reservations/me`, { headers: authHeaders() });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json();
  },

  async hostReservationDecision(id: number, decision: 'confirm' | 'reject') {
    const res = await fetch(`${API_BASE}/hote/reservations/${id}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ decision }),
    });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json();
  },

  async listPendingColivingsAdmin() {
    const res = await fetch(`${API_BASE}/admin/colivings/pending`, { headers: authHeaders() });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json();
  },

  async validateColivingAdmin(id: number, statut: 'VALIDE' | 'REFUSE') {
    const res = await fetch(`${API_BASE}/admin/colivings/${id}/validation`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ statut }),
    });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json();
  },

  async listUsersAdmin() {
    const res = await fetch(`${API_BASE}/admin/users`, { headers: authHeaders() });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json() as Promise<
      { id: number; nom: string; email: string; role: string; dateCreation: string; telephone: string | null }[]
    >;
  },

  async listReservationsAdmin() {
    const res = await fetch(`${API_BASE}/admin/reservations`, { headers: authHeaders() });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json() as Promise<any[]>;
  },

  async getPlatformStatsAdmin() {
    const res = await fetch(`${API_BASE}/admin/stats`, { headers: authHeaders() });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json() as Promise<{
      totalUsers: number;
      totalColivings: number;
      totalReservations: number;
      totalHosts: number;
      totalRevenue: number;
      pendingColivings: number;
    }>;
  },

  async createReservation(body: {
    chambreId: number;
    dateDebut: string;
    dateFin: string;
    nombrePersonnes: number;
  }) {
    const res = await fetch(`${API_BASE}/reservations`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json();
  },

  async createPaiement(reservationId: number, methode: 'VIREMENT' | 'ESPECE' | 'CARTE_BANCAIRE' | 'PAYPAL') {
    const res = await fetch(`${API_BASE}/reservations/${reservationId}/paiement`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ methode }),
    });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json();
  },

  // ── Higgsfield AI ──

  async getAITemplates() {
    const res = await fetch(`${API_BASE}/ai/templates`);
    if (!res.ok) throw new Error(await parseError(res));
    return res.json() as Promise<{ label: string; prompt: string }[]>;
  },

  async generateAIImage(prompt: string, aspectRatio: string = '16:9') {
    const res = await fetch(`${API_BASE}/ai/generate-image`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ prompt, aspectRatio }),
    });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json() as Promise<{ message: string; imageUrl: string; prompt: string }>;
  },

  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);

    const headers: Record<string, string> = {};
    const token = localStorage.getItem('darlink_token');
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: headers,
      body: formData,
    });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json() as Promise<{ message: string; url: string }>;
  },

  // ── Documents ──
  async uploadDocument(type: string, fichier: string) {
    const res = await fetch(`${API_BASE}/documents`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ type, fichier }),
    });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json();
  },

  async listMyDocuments() {
    const res = await fetch(`${API_BASE}/documents`, { headers: authHeaders() });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json() as Promise<{ id: number; type: string; fichier: string; statut: string; dateSoumission: string }[]>;
  },

  async listPendingDocumentsAdmin() {
    const res = await fetch(`${API_BASE}/admin/documents/pending`, { headers: authHeaders() });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json() as Promise<{ id: number; type: string; fichier: string; statut: string; dateSoumission: string; user: string; email: string }[]>;
  },

  async moderateDocumentAdmin(id: number, statut: 'VALIDE' | 'REFUSE') {
    const res = await fetch(`${API_BASE}/admin/documents/${id}/validation`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ statut }),
    });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json();
  },

  // ── Traçabilité & Audits ──
  async getAuditLogs() {
    const res = await fetch(`${API_BASE}/audit`, { headers: authHeaders() });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json() as Promise<{ id: number; user: string; email: string; action: string; details: string; dateCreation: string }[]>;
  },

  // ── Demandes de Documents (Clients/Hôtes) ──
  async requestClientDocument(clientId: number) {
    const res = await fetch(`${API_BASE}/document-requests/request`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ clientId }),
    });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json();
  },

  async listClientRequests() {
    const res = await fetch(`${API_BASE}/document-requests/my-requests`, { headers: authHeaders() });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json() as Promise<any[]>;
  },

  async listHostRequests() {
    const res = await fetch(`${API_BASE}/document-requests/host-requests`, { headers: authHeaders() });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json() as Promise<any[]>;
  },

  async respondToDocumentRequest(id: number, fichierUrl: string) {
    const res = await fetch(`${API_BASE}/document-requests/${id}/respond`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ fichier: fichierUrl }),
    });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json();
  },

  async validateClientDocument(id: number, statut: 'VALIDE' | 'REFUSE') {
    const res = await fetch(`${API_BASE}/document-requests/${id}/validate`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ statut }),
    });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json();
  },

  async listAllRequestsAdmin() {
    const res = await fetch(`${API_BASE}/admin/document-requests`, { headers: authHeaders() });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json() as Promise<any[]>;
  },

  // ── Messagerie ──
  async sendMessage(destinataireId: number, contenu: string, colivingId?: number) {
    const res = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ destinataireId, contenu, colivingId }),
    });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json();
  },

  async getConversations() {
    const res = await fetch(`${API_BASE}/messages/conversations`, { headers: authHeaders() });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json() as Promise<any[]>;
  },

  async getMessages(contactId: number) {
    const res = await fetch(`${API_BASE}/messages/${contactId}`, { headers: authHeaders() });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json() as Promise<any[]>;
  },
};
