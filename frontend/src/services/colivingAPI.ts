import { API_BASE, authHeaders } from '../config/api';

export interface ColivingData {
  id: number;
  titre: string;
  description?: string;
  adresse: string;
  latitude?: number;
  longitude?: number;
  lienGoogleMap?: string;
  regles?: string;
  prixParMois: number;
  image: string;
  images: Array<{ url: string; isPrincipale: boolean }>;
  note: number;
  reviews: number;
  capacite: number;
  equipements: string[];
  hote: {
    id: number;
    nom: string;
    email: string;
    photoProfil?: string;
  };
  chambres: Array<{
    id: number;
    nom: string;
    description?: string;
    capacitePersonnes: number;
    litsDisponibles: number;
    prixParMois: string | number;
    typeChambre: string;
  }>;
  activites?: Array<{
    id: number;
    titre: string;
    description?: string;
    datePrevue: string;
    prixOptionnel: string | number;
    typeActivite: string;
  }>;
  avis?: Array<{
    id: number;
    note: number;
    commentaire: string;
    dateCreation: string;
    client: {
      nom: string;
      photoProfil?: string;
    };
  }>;
}

export const colivingAPI = {
  // Récupérer tous les colivings
  async getAllColivings(): Promise<ColivingData[]> {
    try {
      const response = await fetch(`${API_BASE}/colivings`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des colivings');
      return response.json();
    } catch (error) {
      console.error('Erreur API getAllColivings:', error);
      return [];
    }
  },

  // Récupérer un coliving par ID
  async getColivingById(id: number): Promise<ColivingData | null> {
    try {
      const response = await fetch(`${API_BASE}/colivings/${id}`);
      if (!response.ok) throw new Error('Coliving non trouvé');
      return response.json();
    } catch (error) {
      console.error('Erreur API getColivingById:', error);
      return null;
    }
  },

  // Récupérer les chambres disponibles
  async getAvailableChambres(colivingId: number, dateDebut: string, dateFin: string) {
    try {
      const response = await fetch(
        `${API_BASE}/colivings/available/search?colivingId=${colivingId}&dateDebut=${dateDebut}&dateFin=${dateFin}`
      );
      if (!response.ok) throw new Error('Erreur lors de la récupération des chambres disponibles');
      return response.json();
    } catch (error) {
      console.error('Erreur API getAvailableChambres:', error);
      return [];
    }
  },

  // Créer une réservation
  async createReservation(
    chambreId: number,
    dateDebut: string,
    dateFin: string,
    nombrePersonnes: number
  ) {
    try {
      const response = await fetch(`${API_BASE}/reservations`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          chambreId,
          dateDebut,
          dateFin,
          nombrePersonnes,
        }),
      });
      if (!response.ok) throw new Error('Erreur lors de la création de la réservation');
      return response.json();
    } catch (error) {
      console.error('Erreur API createReservation:', error);
      return null;
    }
  },
};
