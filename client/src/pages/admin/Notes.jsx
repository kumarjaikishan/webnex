import { useEffect, useState } from "react";
import api from "../../api/client.js";
import GearboxLoader from "../../components/GearboxLoader.jsx";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/notes"),
      api.get("/clients"),
    ])
      .then(([nRes, cRes]) => {
        setNotes(nRes.data || []);
        setClients(cRes.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const sorted = [...notes].sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Notes & cards sent</h1>
      <div className="rounded-2xl border border-edge bg-panel divide-y divide-white/10">
        {loading ? (
          <GearboxLoader label="Loading notes..." />
        ) : (
          <>
            {sorted.map((n) => {
              const client = clients.find((c) => c.id === n.clientId);
              return (
                <div key={n.id} className="px-5 py-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">{client?.name}</span>
                    <span className="font-mono text-xs text-cyan">{n.type}</span>
                  </div>
                  <p className="text-sm text-mist">{n.message}</p>
                </div>
              );
            })}
            {notes.length === 0 && <p className="px-5 py-6 text-sm text-mist">Nothing sent yet — do it from a client's page.</p>}
          </>
        )}
      </div>
    </div>
  );
}
