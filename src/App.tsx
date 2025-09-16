 import React, { useState, useEffect } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import './App.css';;

// --- Interfaces ---
interface Utilisateur {
  id: number;
  nom?: string;
  email?: string;
}

interface Service {
  id: number;
  nom?: string;
  description?: string;
  prix?: number;
  dureeMinutes?: number;
}

interface Abonnement {
  id: number;
  utilisateur?: Utilisateur;
  service?: Service;
  dateDebut: string;
  dateFin: string;
  statut: string;
}

function App() {
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [abonnements, setAbonnements] = useState<Abonnement[]>([]);

  // Form states
  const [newUser, setNewUser] = useState({ nom: '', email: '' });
  const [newService, setNewService] = useState({ nom: '', description: '', prix: '', dureeMinutes: '' });
  const [abonnementForm, setAbonnementForm] = useState({ utilisateurId: '', serviceId: '', dateDebut: '', dateFin: '' });

  // Load data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [uRes, sRes, aRes] = await Promise.all([
      axios.get('http://localhost:8087/utilisateurs'),
      axios.get('http://localhost:8087/services'),
      axios.get('http://localhost:8087/abonnements')
    ]);
    setUtilisateurs(uRes.data);
    setServices(sRes.data);
    setAbonnements(aRes.data);
  };

  // Handlers
  const handleUserSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await axios.post('http://localhost:8087/utilisateurs', newUser);
    setNewUser({ nom: '', email: '' });
    fetchData();
  };

  const handleServiceSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      ...newService,
      prix: parseFloat(newService.prix),
      dureeMinutes: parseInt(newService.dureeMinutes),
    };
    await axios.post('http://localhost:8087/services', payload);
    setNewService({ nom: '', description: '', prix: '', dureeMinutes: '' });
    fetchData();
  };

  const handleAbonnementSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      utilisateur: { id: parseInt(abonnementForm.utilisateurId) },
      service: { id: parseInt(abonnementForm.serviceId) },
      dateDebut: abonnementForm.dateDebut,
      dateFin: abonnementForm.dateFin,
      statut: 'actif'
    };
    await axios.post('http://localhost:8087/abonnements', payload);
    setAbonnementForm({ utilisateurId: '', serviceId: '', dateDebut: '', dateFin: '' });
    fetchData();
  };

  return (
    <div className="container">
      <h1>Gestion des Abonnements</h1>

      {/* --- Utilisateur Form --- */}
      <h2>Ajouter Utilisateur</h2>
      <form onSubmit={handleUserSubmit}>
        <input type="text" placeholder="Nom" value={newUser.nom} onChange={(e) => setNewUser({ ...newUser, nom: e.target.value })} required />
        <input type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required />
        <button type="submit">Ajouter Utilisateur</button>
      </form>

      {/* --- Service Form --- */}
      <h2>Ajouter Service</h2>
      <form onSubmit={handleServiceSubmit}>
        <input type="text" placeholder="Nom" value={newService.nom} onChange={(e) => setNewService({ ...newService, nom: e.target.value })} required />
        <input type="text" placeholder="Description" value={newService.description} onChange={(e) => setNewService({ ...newService, description: e.target.value })} required />
        <input type="number" placeholder="Prix" value={newService.prix} onChange={(e) => setNewService({ ...newService, prix: e.target.value })} required />
        <input type="number" placeholder="Durée (minutes)" value={newService.dureeMinutes} onChange={(e) => setNewService({ ...newService, dureeMinutes: e.target.value })} required />
        <button type="submit">Ajouter Service</button>
      </form>

      {/* --- Abonnement Form --- */}
      <h2>Ajouter Abonnement</h2>
      <form onSubmit={handleAbonnementSubmit}>
        <select name="utilisateurId" value={abonnementForm.utilisateurId} onChange={(e) => setAbonnementForm({ ...abonnementForm, utilisateurId: e.target.value })} required>
          <option value="">-- Choisir un utilisateur --</option>
          {utilisateurs.map((u) => (
            <option key={u.id} value={u.id}>{u.nom} ({u.email})</option>
          ))}
        </select>

        <select name="serviceId" value={abonnementForm.serviceId} onChange={(e) => setAbonnementForm({ ...abonnementForm, serviceId: e.target.value })} required>
          <option value="">-- Choisir un service --</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>{s.nom} - {s.prix} TND</option>
          ))}
        </select>

        <input type="date" name="dateDebut" value={abonnementForm.dateDebut} onChange={(e) => setAbonnementForm({ ...abonnementForm, dateDebut: e.target.value })} required />
        <input type="date" name="dateFin" value={abonnementForm.dateFin} onChange={(e) => setAbonnementForm({ ...abonnementForm, dateFin: e.target.value })} required />
        <button type="submit">Ajouter Abonnement</button>
      </form>

      {/* --- Lists --- */}
      <h2>Utilisateurs</h2>
      <ul>
        {utilisateurs.map(u => (
          <li key={u.id}>{u.nom} ({u.email})</li>
        ))}
      </ul>

      <h2>Services</h2>
      <ul>
        {services.map(s => (
          <li key={s.id}>{s.nom} - {s.description} - {s.prix} TND</li>
        ))}
      </ul>

      <h2>Abonnements</h2>
      <ul>
        {abonnements.map(a => (
          <li key={a.id}>
            <strong>ID:</strong> {a.id} | 
            <strong> Utilisateur:</strong> {a.utilisateur?.nom} | 
            <strong> Service:</strong> {a.service?.nom} | 
            <strong> Début:</strong> {a.dateDebut} | 
            <strong> Fin:</strong> {a.dateFin}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
