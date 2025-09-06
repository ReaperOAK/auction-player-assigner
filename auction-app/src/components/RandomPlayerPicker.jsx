import React, { useState, useRef, useEffect, useMemo } from 'react';

const POSITIONS = ['ALL', 'GK', 'DEF', 'MID', 'ATT'];
const GENDERS = ['ALL', 'MALE', 'FEMALE'];
const STATUSES = ['UNSOLD', 'SOLD', 'ALL'];

const RandomPlayerPicker = ({ players, onPick }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [picked, setPicked] = useState(null);
  const buttonRef = useRef(null);

  // Filters state
  const [positionFilter, setPositionFilter] = useState('ALL');
  const [genderFilter, setGenderFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('UNSOLD'); // default to unsold

  // Compute candidate pool based on filters
  const candidates = useMemo(() => {
    return players.filter(p => {
      // status
      if (statusFilter === 'UNSOLD' && p.soldTo) return false;
      if (statusFilter === 'SOLD' && !p.soldTo) return false;

      // position
      if (positionFilter !== 'ALL' && p.position !== positionFilter) return false;

      // gender (normalize)
      const g = (p.gender || 'male').toString().toUpperCase();
      if (genderFilter !== 'ALL' && g !== genderFilter) return false;

      return true;
    });
  }, [players, positionFilter, genderFilter, statusFilter]);

  const pickRandom = () => {
    if (candidates.length === 0) return;
    setIsSpinning(true);
    setPicked(null);

    const rounds = 18 + Math.floor(Math.random() * 12);
    let i = 0;
    const interval = setInterval(() => {
      const candidate = candidates[Math.floor(Math.random() * candidates.length)];
      setPicked(candidate);
      i += 1;
      if (i >= rounds) {
        clearInterval(interval);
        setIsSpinning(false);
        const final = candidates[Math.floor(Math.random() * candidates.length)];
        setPicked(final);
        if (onPick) onPick(final);
        if (buttonRef.current) buttonRef.current.focus();
      }
    }, 70 + Math.random() * 80);
  };

  useEffect(() => {
    // if players list changes and picked player is now sold/unavailable according to filters, clear it
    if (picked) {
      const stillAvailable = candidates.some(c => c.id === picked.id);
      if (!stillAvailable) setPicked(null);
    }
  }, [players, positionFilter, genderFilter, statusFilter]);

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <label className="sr-only" htmlFor="rp-position">Position</label>
        <select
          id="rp-position"
          value={positionFilter}
          onChange={(e) => setPositionFilter(e.target.value)}
          className="p-2 border rounded bg-white text-sm"
          aria-label="Filter by position"
        >
          {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        <label className="sr-only" htmlFor="rp-gender">Gender</label>
        <select
          id="rp-gender"
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
          className="p-2 border rounded bg-white text-sm"
          aria-label="Filter by gender"
        >
          {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
        </select>

        <label className="sr-only" htmlFor="rp-status">Status</label>
        <select
          id="rp-status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded bg-white text-sm"
          aria-label="Filter by status"
        >
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button
          ref={buttonRef}
          onClick={pickRandom}
          className="btn btn-ghost"
          aria-live="polite"
          disabled={candidates.length === 0}
        >
          🎲 Pick Random
        </button>

        <div className="text-sm text-gray-600">
          <div>{candidates.length} matching</div>
        </div>
      </div>

      {picked && (
        <div className={`p-3 rounded-md border ${isSpinning ? 'opacity-70 animate-pulse' : ''} bg-white`} role="status" aria-label={`Random player selected: ${picked.name}`}>
          <div className="font-medium text-sm text-gray-800">{picked.name}</div>
          <div className="text-xs text-gray-600">{picked.position} • Class of {picked.year}</div>
        </div>
      )}
    </div>
  );
};

export default RandomPlayerPicker;
