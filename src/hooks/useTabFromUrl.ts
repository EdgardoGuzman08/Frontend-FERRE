import { useLocation, useNavigate } from "react-router-dom";
import { useCallback, useMemo } from "react";

/**
 * Hook to sync tab state with URL.
 * @param basePath e.g. "/ventas"
 * @param defaultTab e.g. "cotizaciones"
 * @param validTabs list of valid tab values
 */
export function useTabFromUrl(basePath: string, defaultTab: string, validTabs: string[]) {
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = useMemo(() => {
    const segments = location.pathname.replace(basePath, "").split("/").filter(Boolean);
    const tab = segments[0];
    return tab && validTabs.includes(tab) ? tab : defaultTab;
  }, [location.pathname, basePath, defaultTab, validTabs]);

  const setActiveTab = useCallback(
    (tab: string) => {
      navigate(`${basePath}/${tab}`, { replace: true });
    },
    [navigate, basePath]
  );

  return [activeTab, setActiveTab] as const;
}
