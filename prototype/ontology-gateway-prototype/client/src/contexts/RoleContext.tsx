import { enterpriseRoles, type EnterpriseRole } from "@shared/domain";
import { createContext, useContext, useMemo, useState } from "react";

type RoleContextValue = {
  role: EnterpriseRole;
  setRole: (role: EnterpriseRole) => void;
  roles: readonly EnterpriseRole[];
};

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<EnterpriseRole>(() => {
    const stored = window.localStorage.getItem("orion-enterprise-role") as EnterpriseRole | null;
    return stored && enterpriseRoles.includes(stored) ? stored : "主管";
  });

  const value = useMemo(
    () => ({
      role,
      roles: enterpriseRoles,
      setRole: (nextRole: EnterpriseRole) => {
        setRole(nextRole);
        window.localStorage.setItem("orion-enterprise-role", nextRole);
      },
    }),
    [role],
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useEnterpriseRole() {
  const context = useContext(RoleContext);
  if (!context) throw new Error("useEnterpriseRole must be used within RoleProvider");
  return context;
}
