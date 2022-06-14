import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { validateUserPermissions } from "../utils/validateUserPermissions";

type useCanParams = {
  permissions?: string[];
  roles?: string[];
};

export const useCan = ({ permissions, roles }: useCanParams) => {
  const { user, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    // verifica se o usuário está autenticado
    return false;
  }

  const userHesValidPermissions = validateUserPermissions({
    user,
    permissions,
    roles
  })

  return userHesValidPermissions;
};
