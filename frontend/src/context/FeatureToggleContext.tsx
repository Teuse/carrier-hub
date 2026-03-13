import { createContext, useContext, useEffect, useState } from 'react';

/* ====================================================== */

interface FeatureToggles {
  anomaliesOnly: boolean;
}

interface FeatureToggleContextValue {
  toggles: FeatureToggles;
  setToggle: (key: keyof FeatureToggles, value: boolean) => void;
}

/* ====================================================== */

const STORAGE_KEY = 'featureToggles';

const defaults: FeatureToggles = {
  anomaliesOnly: true,
};

const load = (): FeatureToggles => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...defaults, ...JSON.parse(stored) } : defaults;
  } catch {
    return defaults;
  }
};

/* ====================================================== */

const FeatureToggleContext = createContext<FeatureToggleContextValue | null>(null);

export function FeatureToggleProvider({ children }: { children: React.ReactNode }) {
  const [toggles, setToggles] = useState<FeatureToggles>(load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toggles));
  }, [toggles]);

  const setToggle = (key: keyof FeatureToggles, value: boolean) => {
    setToggles(prev => ({ ...prev, [key]: value }));
  };

  return (
    <FeatureToggleContext.Provider value={{ toggles, setToggle }}>
      {children}
    </FeatureToggleContext.Provider>
  );
}

export function useFeatureToggles() {
  const ctx = useContext(FeatureToggleContext);
  if (!ctx) throw new Error('useFeatureToggles must be used within FeatureToggleProvider');
  return ctx;
}