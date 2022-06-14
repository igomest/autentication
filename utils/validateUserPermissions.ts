
type User = {
    permissions?: string[];
    roles?: string[];
}


type validateUserPermissionsParams = {
    user: User;
    permissions?: string[];
    roles?: string[];
}

export const validateUserPermissions = ({ user, permissions, roles }: validateUserPermissionsParams) => {
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
}