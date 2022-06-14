import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

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

  if (permissions?.length > 0) {
    const hasAllPermissions = permissions.every((permission) => {
      // retorna true, caso o usuário tenha todas as permissões recebidas dentro do array de permissões
      return user.permissions.includes(permission);
    });

    if (!hasAllPermissions) {
      return false;
    }
  }

  if (roles?.length > 0) {
    const hasAllRoles = roles.some((role) => {
      // Retorna true, caso o usuário tenha um dos cargos no array de roles.
      return user.roles.includes(role);
    });

    if (!hasAllRoles) {
      return false;
    }
  }

  return true;
};
